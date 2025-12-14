"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6"
        }}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "1rem"
            }}>
              Something went wrong!
            </h2>
            <button
              onClick={() => reset()}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer"
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
