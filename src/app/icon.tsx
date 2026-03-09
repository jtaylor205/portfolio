import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #080810 0%, #0D9488 25%, #2DD4BF 50%, #10B981 70%, #06B6D4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        JT
      </div>
    ),
    { ...size }
  );
}
