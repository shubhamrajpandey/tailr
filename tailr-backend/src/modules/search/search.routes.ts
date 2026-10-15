import { Elysia } from "elysia";
import { searchController } from "./search.controller";
import { GlobalSearchQuery } from "./search.model";
import { createRequireAuth } from "../../middleware/auth-guard";

export const searchRoutes = new Elysia({ prefix: "/search" })
  .use(createRequireAuth("search"))
  .get(
    "/",
    ({ authUser, query }) =>
      searchController.search({ authUser: authUser!, query }),
    {
      query: GlobalSearchQuery,
      detail: {
        tags: ["Search"],
        summary: "Global Unified Search",
        description:
          "Full-text search across job applications, master & tailored resumes, cover letters, companies directory, and dashboard pages.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Categorized search results." },
          401: { description: "Unauthorized." },
        },
      },
    }
  );
