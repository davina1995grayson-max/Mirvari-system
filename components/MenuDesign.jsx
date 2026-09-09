"use client";

import { useState, useEffect } from "react";

export default function MenuDesign({ menuData }) {
  
  const [openCategories, setOpenCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
  if (openCategories) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [openCategories]);
  
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
    position: "relative",
    textAlign: "center",
    marginBottom: 30,
  }}
>

  <button
    onClick={() => setOpenCategories(true)}
    style={{
      position: "absolute",
      left: 0,
      top: 20,
      border: "none",
      background: "transparent",
      fontSize: 32,
      color: "#b88a2a",
      cursor: "pointer",
    }}
  >
    ☰
  </button>

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
      {openCategories && (
  <div
    onClick={() => setOpenCategories(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.35)",
      zIndex: 1000,
      overflow: "hidden",
      display: "flex",
    }}
  >
<div
  onClick={(e) => e.stopPropagation()}
style={{
  width: "80%",
  maxWidth: 350,
  height: "100vh",
  background: "#f7f1e6",
  padding: "25px 25px 160px 25px",
  paddingBottom: "calc(160px + env(safe-area-inset-bottom))",
  boxSizing: "border-box",
  boxShadow: "5px 0 20px rgba(0,0,0,.2)",
  overflowY: "auto",
}}
>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            color: "#b88a2a",
          }}
        >
          Категории
        </h2>

        <button
          onClick={() => setOpenCategories(false)}
          style={{
            border: "none",
            background: "none",
            fontSize: 24,
          }}
        >
          ✕
        </button>
      </div>

      {menuData?.map((section) => (
        <button
          key={section.title}
          onClick={() => {
            setSelectedCategory(section.title);
            setOpenCategories(false);
          }}
          style={{
            width: "100%",
            padding: 15,
            marginBottom: 10,
            borderRadius: 15,
            border: "1px solid rgba(212,175,55,.5)",
            background: "#fff",
            textAlign: "left",
            fontSize: 16,
            color: "#2b2418",
          }}
        >
           {section.title}
        </button>
      ))}
    </div>
  </div>
)}

      <div
  style={{
    marginTop: 20,
  }}
>
{(selectedCategory
  ? menuData.filter(
      (section) => section.title === selectedCategory
    )
  : menuData
).map((section) => (
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

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 15,
  }}
>
  {section.items?.map((item) => (
    <div
      key={item.name}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(212,175,55,.25)",
        boxShadow: "0 8px 20px rgba(0,0,0,.08)",
      }}
    >

      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "100%",
            height: 110,
            objectFit: "cover",
          }}
        />
      )}

      <div
        style={{
          padding: "10px 8px 14px",
textAlign: "center",
        }}
      >

        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            minHeight: 30,
          }}
        >
          {item.name}
        </div>


        <div
          style={{
            marginTop: 4,
            color: "#b88a2a",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {item.price} AZN
        </div>

      </div>

    </div>
  ))}
</div>
    </div>
  ))}
</div>
    </div>
  );
}
