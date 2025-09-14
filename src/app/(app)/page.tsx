import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        background: "#f7fafc",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", margin: 0 }}>
            Welcome to TeaBack
          </h1>
          <p style={{ marginTop: "1rem", color: "#4a5568", lineHeight: 1.5 }}>
            A simple place to make fun and give suggestions and feedback anonymously.
          </p>

          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
            <Link
              href="/login"
              style={{
                background: "#111827",
                color: "#fff",
                padding: "0.6rem 1rem",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Log in
            </Link>

            <Link
              href="/signup"
              style={{
                background: "#fff",
                border: "1px solid #d1d5db",
                color: "#111827",
                padding: "0.6rem 1rem",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </div>
        </div>

        <div
          style={{
            width: 300,
            height: 200,
            background: "linear-gradient(135deg,#e6fffa,#ebf8ff)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#065f46",
            fontWeight: 700,
          }}
        >
          🍵 TeaBack
        </div>
      </div>
    </main>
  );
}
