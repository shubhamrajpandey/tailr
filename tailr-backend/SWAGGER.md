# Tailr Authentication API — Swagger / OpenAPI Documentation

This document provides a guide to the interactive Swagger UI and OpenAPI 3.0 specification available in `tailr-backend`.

---

## 1. Quick Access URLs

When running the backend server locally (`bun run dev`):

| Resource | URL | Description |
|---|---|---|
| **Interactive Swagger UI** | [http://localhost:3001/swagger](http://localhost:3001/swagger) | Complete interactive API explorer with "Try it out" and Authorize modal |
| **OpenAPI Specification** | [http://localhost:3001/swagger/json](http://localhost:3001/swagger/json) | Raw OpenAPI 3.0 JSON specification schema |
| **Backend Base URL** | `http://localhost:3001` | Server root (CORS enabled for `http://localhost:3000`) |

---

## 2. API Endpoints Overview

All authentication routes are prefixed with `/auth` and tagged under **Auth**. System monitoring is under **System**.

### Auth Routes

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `POST` | `/auth/signup` | Register a new user and dispatch 6-digit OTP | None | `201`, `400`, `409`, `429` |
| `POST` | `/auth/verify-otp` | Verify 6-digit OTP, activate user, return access token & set refresh cookie | None | `200`, `400`, `429` |
| `POST` | `/auth/resend-otp` | Resend verification OTP (rate limited to 3 per 15 mins) | None | `200`, `400`, `429` |
| `POST` | `/auth/login` | Authenticate with email & password; issue access token + HttpOnly refresh cookie | None | `200`, `400`, `401`, `403`, `429` |
| `POST` | `/auth/refresh` | Rotate refresh token from HttpOnly cookie and issue fresh access token | Cookie | `200`, `401` |
| `POST` | `/auth/logout` | Revoke session in database and clear HttpOnly cookie | Cookie | `200` |
| `GET` | `/auth/me` | Fetch authenticated user profile | **Bearer JWT** | `200`, `401` |

### System Routes

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|:---:|---|
| `GET` | `/health` | Liveness and database connectivity health probe | None | `200`, `503` |

---

## 3. Interactive Testing Guide (Step-by-Step)

Follow these steps directly inside the Swagger UI at `http://localhost:3001/swagger`:

### Step 1: Start the Backend
In your terminal, navigate to `tailr-backend` and run:
```bash
cd tailr-backend
bun run dev
```

### Step 2: Register an Account (`POST /auth/signup`)
1. Expand `POST /auth/signup` and click **Try it out**.
2. Provide a request payload:
   ```json
   {
     "fullName": "Jane Doe",
     "email": "jane@example.com",
     "password": "Password123!",
     "confirmPassword": "Password123!"
   }
   ```
3. Click **Execute**.
4. Response: `201 Created` with message `"Account registered. Please verify the OTP sent to your email."`.
5. Check your backend terminal console. In development mode, the OTP is logged:
   ```text
   [MOCK-EMAIL] To: jane@example.com | Subject: Your Tailr Verification Code
   [MOCK-EMAIL] Code: 482910 (Expires in 10 minutes)
   ```

### Step 3: Verify OTP (`POST /auth/verify-otp`)
1. Expand `POST /auth/verify-otp` and click **Try it out**.
2. Supply the email and 6-digit code:
   ```json
   {
     "email": "jane@example.com",
     "otp": "482910"
   }
   ```
3. Click **Execute**.
4. Response: `200 OK` returning:
   ```json
   {
     "message": "Email verified successfully.",
     "data": {
       "user": {
         "id": "uuid-...",
         "fullName": "Jane Doe",
         "email": "jane@example.com",
         "isVerified": true
       },
       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```
5. Note: The browser receives the `Set-Cookie: tailr_refresh_token=...; HttpOnly; SameSite=Lax` header automatically.

### Step 4: Authorize with Bearer Token
1. Copy the `accessToken` from the response above.
2. Scroll to the top of Swagger UI and click the green **Authorize 🔓** button.
3. In the `bearerAuth (http, Bearer)` field, paste the token:
   ```text
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Click **Authorize**, then click **Close**.

### Step 5: Test Authenticated Endpoint (`GET /auth/me`)
1. Expand `GET /auth/me`.
2. Click **Try it out**, then **Execute**.
3. Response: `200 OK` with user details.

### Step 6: Test Refresh Token Rotation (`POST /auth/refresh`)
1. Expand `POST /auth/refresh`.
2. Click **Try it out**, then **Execute**.
3. Elysia reads the `tailr_refresh_token` HttpOnly cookie stored in your browser session, verifies it against PostgreSQL, revokes the old token, issues a new refresh token cookie, and returns a new `accessToken`.

### Step 7: Logout (`POST /auth/logout`)
1. Expand `POST /auth/logout`.
2. Click **Try it out**, then **Execute**.
3. Revokes the session in the database and clears the `tailr_refresh_token` cookie.

---

## 4. OpenAPI Security Specification

Swagger is configured with the `bearerAuth` HTTP Bearer scheme:

```json
"components": {
  "securitySchemes": {
    "bearerAuth": {
      "type": "http",
      "scheme": "bearer",
      "bearerFormat": "JWT",
      "description": "Provide access JWT token (e.g. from /auth/login or /auth/verify-otp)"
    }
  }
}
```

Protected routes (such as `/auth/me`) require:
```json
"security": [
  {
    "bearerAuth": []
  }
]
```

---

## 5. Error Response Envelope

All API errors return standard, consistent envelopes:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid credentials or request data",
    "details": null
  }
}
```

Standard Status Codes:
- `400 Bad Request`: Validation failure (TypeBox schema violations)
- `401 Unauthorized`: Missing or invalid Bearer JWT / refresh token
- `403 Forbidden`: Unverified account attempting to log in
- `409 Conflict`: Email address already registered
- `429 Too Many Requests`: Rate limit exceeded (OTP resend / brute-force protection)
- `500 Internal Server Error`: Unexpected server issue
