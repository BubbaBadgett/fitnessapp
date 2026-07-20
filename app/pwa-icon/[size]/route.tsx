import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const dimension = Number(size) || 512;
  const maskable = request.nextUrl.searchParams.get("maskable") === "1";
  const padding = maskable ? dimension * 0.22 : dimension * 0.12;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: dimension - padding * 2,
            height: dimension - padding * 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#00ffff",
            fontSize: dimension * 0.4,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          IP
        </div>
      </div>
    ),
    { width: dimension, height: dimension }
  );
}
