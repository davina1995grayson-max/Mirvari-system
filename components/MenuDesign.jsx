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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 5px",
    marginBottom: 20,
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "#f7f1e6",
  }}
>

  {/* Слева */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >

    <button
      onClick={() => setOpenCategories(true)}
      style={{
        border: "none",
        background: "transparent",
        fontSize: 28,
        color: "#b88a2a",
        padding: 0,
      }}
    >
      ☰
    </button>


    <img
      src="/logo.png"
      alt="Mirvari"
      style={{
        width: 90,
        height: "auto",
      }}
    />

  </div>


  {/* Справа */}
  <div
    style={{
      display: "flex",
      gap: 8,
    }}
  >

        <button
          onClick={() => setTable(null)}

          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.88)";
          }}

          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          
          style={{
            width: 38,
            height: 38,
            fontSize: 17,
            borderRadius: 14,
            background:
              "rgba(255,255,255,0.28)",
            color:"#b88a2a",
            border:
              "1px solid rgba(212,175,55,.35)",
            cursor:"pointer",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            backdropFilter:"blur(12px)",
            WebkitBackdropFilter:"blur(12px)",
            boxShadow:
              "0 6px 18px rgba(212,175,55,.18)",
            transition:"all .25s ease",
          }}
        >                 
            🪑
           </button> 
    
            <button
              onClick={callWaiter}

              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.88)";
              }}

              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}

              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              
              style={{
                width: 38,
height: 38,
fontSize: 17,
borderRadius: 14,

background:
"rgba(255,255,255,0.28)",

color:"#b88a2a",

border:
"1px solid rgba(212,175,55,.35)",

cursor:"pointer",

display:"flex",
alignItems:"center",
justifyContent:"center",

backdropFilter:"blur(12px)",
WebkitBackdropFilter:"blur(12px)",

boxShadow:
"0 6px 18px rgba(212,175,55,.18)",

transition:"all .25s ease",
}}

> 

👨🏻‍🍳

  </button> 
    
    <button
        onClick={callBill}

onMouseDown={(e) => {
e.currentTarget.style.transform = "scale(0.88)";
}}

onMouseUp={(e) => {
e.currentTarget.style.transform = "scale(1)";
}}

onMouseLeave={(e) => {
e.currentTarget.style.transform = "scale(1)";
}}
style={{
width: 38,
height: 38,
fontSize: 17,
borderRadius: 14,

background:
"rgba(255,255,255,0.28)",

color:"#b88a2a",

border:
"1px solid rgba(212,175,55,.35)",

cursor:"pointer",

display:"flex",
alignItems:"center",
justifyContent:"center",

backdropFilter:"blur(12px)",
WebkitBackdropFilter:"blur(12px)",

boxShadow:
"0 6px 18px rgba(212,175,55,.18)",

transition:"all .25s ease",
}}
> 
💳
  </button>  
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
