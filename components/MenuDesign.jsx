"use client";

export default function MenuDesign({ menuData }) {
  return (
    <div
  style={{
    minHeight: "100vh",
    background: "#f7f1e6",
    padding: "20px",
    color: "#2b2418",
    overflowY: "auto",
  }}
>
<div
  style={{
    textAlign: "center",
    marginBottom: 30,
  }}
>
  <img
    src="/logo.png"
    alt="Mirvari Restaurant"
    style={{
      width: "75%",
      maxWidth: 320,
      height: "auto",
      filter:
        "drop-shadow(0 8px 20px rgba(212,175,55,.25))",
    }}
  />

  <div
    style={{
      marginTop: 6,
      color: "#8c6a22",
      fontSize: 13,
      fontStyle: "italic",
      letterSpacing: 1,
    }}
  >
    Hər loxmada incə bir zövq
  </div>
</div>

      <div
  style={{
    marginTop: 20,
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
