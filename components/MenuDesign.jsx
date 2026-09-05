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
  }}
>
  {menuData?.map((section) => (
    <div
      key={section.title}
      style={{
        marginBottom: 30,
      }}
    >
      <h2
        style={{
          color: "#b88a2a",
          fontSize: 26,
          borderBottom: "1px solid rgba(212,175,55,.4)",
          paddingBottom: 8,
        }}
      >
        {section.title}
      </h2>

      {section.items?.map((item) => (
        <div
          key={item.name}
          style={{
            background: "rgba(255,255,255,0.6)",
            borderRadius: 20,
            padding: 15,
            marginBottom: 12,
            border: "1px solid rgba(212,175,55,.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                color: "#b88a2a",
                marginTop: 5,
              }}
            >
              {item.price} ₼
            </div>
          </div>

          {item.image && (
            <img
              src={item.image}
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      ))}
    </div>
  ))}
</div>
    </div>
  );
}
