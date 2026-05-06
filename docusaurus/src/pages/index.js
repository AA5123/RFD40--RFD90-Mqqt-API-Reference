import React, { useEffect } from "react";

export default function Home() {
  useEffect(function () {
    window.location.replace("/docs/");
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <p>Redirecting to API reference...</p>
      <p>
        If you are not redirected, open <a href="/docs/">the API reference page</a>.
      </p>
    </main>
  );
}
