import { NextResponse } from "next/server";
import { analyze } from "sdp-analyzer";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const packages = url.searchParams.get("packages");
    if (!packages) {
      return NextResponse.json({
        message: "The packages key required",
        result: [],
      });
    }
    try {
      const result = await analyze(packages);
      return NextResponse.json({
        message: "Succeeded to query packages",
        result: result,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        message: "Failed to query packages",
        result: [],
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
