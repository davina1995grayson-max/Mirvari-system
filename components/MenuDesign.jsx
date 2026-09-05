"use client";

export default function MenuDesign({ menuData }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f1e6",
        padding: "20px",
        color: "#2b2418",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#b88a2a",
          fontFamily: "serif",
          fontSize: 42,
          marginTop: 20,
        }}
      >
        Mirvari
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#8c6a22",
          letterSpacing: 3,
        }}
      >
        RESTAURANT
      </p>

      <div
        style={{
          marginTop: 40,
          padding: 20,
          borderRadius: 25,
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(212,175,55,.4)",
          textAlign: "center",
        }}
      >
        Новый дизайн меню
      </div>
    </div>
  );
}
