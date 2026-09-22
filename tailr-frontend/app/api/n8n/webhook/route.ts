import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      webhookUrl = "https://thatpandey.app.n8n.cloud/webhook-test/job-application",
      payload,
    } = body;

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json(
        { error: "A valid webhook URL is required." },
        { status: 400 }
      );
    }

    // Ensure valid URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(webhookUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid webhook URL format." },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Relay POST request to n8n webhook
    let response: Response;
    try {
      response = await fetch(parsedUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          "User-Agent": "Tailr-App/1.0",
        },
        body: JSON.stringify(payload ?? {}),
        signal: AbortSignal.timeout(30000), // 30s timeout for n8n processing
      });
    } catch (networkErr: unknown) {
      const durationMs = Date.now() - startTime;
      const errorMessage =
        networkErr instanceof Error ? networkErr.message : "Network error contacting n8n";

      return NextResponse.json(
        {
          success: false,
          status: 504,
          durationMs,
          error: `Failed to connect to n8n webhook: ${errorMessage}`,
          help: "Ensure your n8n cloud instance is accessible and that the URL is correct.",
        },
        { status: 504 }
      );
    }

    const durationMs = Date.now() - startTime;
    const responseText = await response.text();

    let parsedData: unknown = null;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = responseText;
    }

    // n8n returns 404 with a specific message when a test webhook is not actively listening
    const isTestWebhook = webhookUrl.includes("webhook-test");
    const isNotListening =
      response.status === 404 &&
      typeof responseText === "string" &&
      responseText.toLowerCase().includes("not registered");

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      durationMs,
      data: parsedData,
      isTestWebhook,
      isNotListening,
      help: isNotListening
        ? "Your n8n test webhook is not active. In n8n, open this workflow and click 'Test step' or 'Listen for test event' on the Webhook node, then submit again!"
        : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json(
      { error: `Internal server error: ${message}` },
      { status: 500 }
    );
  }
}
