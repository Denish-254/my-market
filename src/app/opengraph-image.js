import { ImageResponse } from "next/og";

export const alt = "My Market";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #22c55e, #15803d)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800 }}>My Market</div>
        <div style={{ fontSize: 44, marginTop: 20 }}>Buy, sell and find services on campus</div>
      </div>
    ),
    size
  );
}