import { NextRequest, NextResponse } from "next/server";
import { Application } from "@/shared/types/application";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status")?.toLowerCase();

  const filtered: Application[] = [];

  return NextResponse.json({
    data: filtered,
    total: 0,
    status: statusParam || "all",
  });
}
