"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export default function Page() {

  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const pressTimer = useRef(null);
  const [menuData, setMenuData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dark, setDark] = useState(true);
  
  useEffect(() => {
  const handleScroll = () => {
    const sections = menuData.map(s => s.title);

    let current = null;

    sections.forEach(title => {
      const el = document.getElementById(title);
      if (!el) return;

      const rect = el.getBoundingClientRect();

      if (rect.top <= 120 && rect.bottom >= 120) {
        current = title;
      }
    });

    if (current) {
      setActiveCategory(current);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [menuData]);

useEffect(() => {

  const loadMenu = async () => {

    const { data, error } = await supabase
  .from("menu")
  .select("id, name, price, available, category, type, items")

console.log("DATA FROM SUPABASE:", data); // 👈 ВОТ СЮДА

    if (error) {
      console.log(error);
      return;
    }

    const grouped = {};

    data.forEach((item) => {

      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }

      grouped[item.category].push({
  name: item.name,
  price: item.price,
  available: item.available,

  type: item.type || null,

  items: item.items
    ? (typeof item.items === "string"
        ? JSON.parse(item.items)
        : item.items)
    : null,
});
    });

    const formatted = Object.keys(grouped).map((category) => ({
      title: category,
      items: grouped[category],
    }));

    setMenuData(formatted);

  };

  loadMenu();

}, []);

  const cartRef = useRef(null);
  const router = useRouter();
 const handleLogoClick = () => {
  setLogoClicks((prev) => {
    const next = prev + 1;

    if (next >= 3) {
      router.push("/admin");
      return 0;
    }

    return next;
  });

  setTimeout(() => {
    setLogoClicks(0);
  }, 1500);
};
  const logoutAdmin = () => {
  setIsAdmin(false);
};

const addToCart = (item, e) => {
  setCart((prev) => {
    const existing = prev.find((i) => i.name === item.name);

    if (existing) {
      return prev.map((i) =>
        i.name === item.name
          ? { ...i, qty: (i.qty || 1) + 1 }
          : i
      );
    }

    return [...prev, { ...item, qty: 1 }];
  });

  const btn = e.currentTarget;
  const cartEl = cartRef.current;

  if (!btn || !cartEl) return;

  // 🍽️ анимация добавления в корзину
const flyEl = document.createElement("div");
flyEl.innerText = "🍽️";
flyEl.style.position = "fixed";
flyEl.style.left = btn.getBoundingClientRect().left + "px";
flyEl.style.top = btn.getBoundingClientRect().top + "px";
flyEl.style.fontSize = "18px";
flyEl.style.zIndex = 9999;
flyEl.style.transition = "all 0.8s cubic-bezier(.2,.9,.2,1)";
flyEl.style.pointerEvents = "none";
flyEl.style.transform = "scale(1)";
flyEl.style.opacity = "1";

document.body.appendChild(flyEl);
  const cartRect = cartEl.getBoundingClientRect();

  requestAnimationFrame(() => {
    flyEl.style.left = cartRect.left + "px";
    flyEl.style.top = cartRect.top + "px";
    flyEl.style.transform = "scale(0.2)";
    flyEl.style.opacity = "0";
  });

  setTimeout(() => {
    flyEl.remove();
  }, 800);
};

  const updatePrice = (sectionTitle, itemName, newPrice) => {
  setMenuData((prev) =>
    prev.map((section) => {
      if (section.title !== sectionTitle) return section;

      return {
        ...section,
        items: section.items.map((item) =>
          item.name === itemName
            ? { ...item, price: Number(newPrice) }
            : item
        ),
      };
    })
  );
};

  const updateName = (sectionTitle, oldName, newName) => {
  setMenuData((prev) =>
    prev.map((section) => {
      if (section.title !== sectionTitle) return section;

      return {
        ...section,
        items: section.items.map((item) =>
          item.name === oldName
            ? { ...item, name: newName }
            : item
        ),
      };
    })
  );
};

  const addNewItem = () => {
  if (!selectedSection || !newItemName || !newItemPrice) return;

  setMenuData((prev) =>
    prev.map((section) => {
      if (section.title !== selectedSection) return section;

      return {
        ...section,
        items: [
          ...section.items,
          {
            name: newItemName,
            price: Number(newItemPrice),
            available: true,
          },
        ],
      };
    })
  );

  setNewItemName("");
  setNewItemPrice("");
};
  
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  const order = () => {
  const itemsText = cart
    .map((i) => {
      const qty = i.qty || 1;
      return `• ${i.name} x${qty} = ${i.price * qty} AZN`;
    })
    .join("\n");

  const text =
    `🍽️ YENİ SİFARİŞ\n` +
    `🪑 Masa: ${table}\n\n` +
    `${itemsText}\n\n` +
    `💰 TOTAL: ${total} AZN`;

    window.open(
    `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
  );
};

  const callWaiter = () => {
  const text =
    `🔔 OFİSİANT ÇAĞIRILDI\n\n` +
    `🪑 Masa: ${table}`;

  window.open(
    `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
  );
};
  const callBill = () => {
  const text =
    `💳 HESAB İSTƏNİLDİ\n\n` +
    `🪑 Masa: ${table}`;

  window.open(
    `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
  );
};
  const textColor = dark ? "white" : "black";

  if (table === null) {
    return (
      <div style={{
  background: dark ? "#0b0b0b" : "#f6f6f6",
  color: dark ? "#fff" : "#111",
  minHeight: "100vh",
  padding: 24,
  fontFamily: "'Inter', sans-serif",
  letterSpacing: "0.2px",
}}>
        <h1
  style={{
    color: "#f5c542",
    cursor: "pointer",
    userSelect: "none",
  }}
  onClick={handleLogoClick}
>
</h1>
      
        <p>Zəhmət olmasa masanı seçin</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 15,
          width: "100%",
          maxWidth: 400
        }}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setTable(num)}
              style={{
                background: "#f5c542",
                border: "none",
                padding: 20,
                borderRadius: 16,
                fontSize: 20
              }}
            >
              🪑 {num}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
  background: "#0b0b0b",
  color: "white",
  minHeight: "100vh",
  padding: 20,
  fontFamily: "Inter, sans-serif"
}}>

      {/* HEADER */}
       <div style={{
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap"
}}>
  <h1 style={{ color: "#f5c542" }}>
  </h1>

   <button
  onClick={() => setTable(null)}
  style={{
    background: "linear-gradient(135deg, #f5c542, #e0aa2b)",
    color: "#111",
    border: "none",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(245, 197, 66, 0.25)",
    transition: "all 0.2s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  🔄 Masa dəyiş
</button>
</div>
    
      <p>📍 Baku · Pirallahi</p>
      <p>🪑 Masa: {table}</p>

<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 10,
    marginBottom: 15,
  }}
>
  <button
  onClick={callWaiter}
  style={{
    flex: 1,
    padding: 14,
    borderRadius: 12,
    background: "#1e1e1e",
    color: "#f5c542",
    border: "1px solid #f5c542",
    boxShadow: "0 0 12px rgba(245,197,66,0.35)",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.25s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.boxShadow =
      "0 0 18px rgba(245,197,66,0.7)";
    e.currentTarget.style.transform = "scale(1.04)";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.boxShadow =
      "0 0 12px rgba(245,197,66,0.35)";
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  🔔 Ofisiant
</button>

  <button
  onClick={callBill}
  style={{
    flex: 1,
    padding: 14,
    borderRadius: 12,
    background: "#1e1e1e",
    color: "#f5c542",
    border: "1px solid #f5c542",
    boxShadow: "0 0 12px rgba(245,197,66,0.35)",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.25s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.boxShadow =
      "0 0 18px rgba(245,197,66,0.7)";
    e.currentTarget.style.transform = "scale(1.04)";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.boxShadow =
      "0 0 12px rgba(245,197,66,0.35)";
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  💳 Hesab
</button>
</div>

      {isAdmin && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.9)",
      zIndex: 99999,
      padding: 20,
      color: "white",
    }}
  >
    <h2>🕶️ Admin Panel</h2>
    <button
  onClick={logoutAdmin}
  style={{
    padding: "10px 14px",
    borderRadius: 8,
    background: "red",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: 10
  }}
>
  🚪 Выйти
</button>

    <button
      onClick={() => setAdminOpen(false)}
      style={{
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
        border: "none",
        background: "#f5c542",
        fontWeight: "bold",
      }}
    >
      ❌ Close
    </button>

    <hr style={{ margin: "20px 0" }} />

    <h3>🍽️ Edit Menu</h3>

<hr style={{ margin: "20px 0" }} />

{menuData.map((section) => (
  <div key={section.title} style={{ marginBottom: 20 }}>
    <h4
  onClick={() =>
    setOpenCategory(
      openCategory === section.title ? null : section.title
    )
  }
  style={{
    color: "#f5c542",
    cursor: "pointer"
  }}
>
  {section.title}
</h4>

{openCategory === section.title && (
  <>
    {section.items.map((item) => (
      <div
        key={item.name}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 8,
          marginTop: 6,
          background: "#1e1e1e",
          borderRadius: 8,
        }}
      >
        <div
  key={item.name}
  style={{
    background: "#1e1e1e",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  }}
>
  {/* строка блюда */}
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <div>
      <div>{item.name}</div>
      <div style={{ color: "#f5c542" }}>
        {item.price} AZN
      </div>
    </div>

    <button
      onClick={(e) => addToCart(item, e)}
      style={{
        background: "#f5c542",
        border: "none",
        borderRadius: 8,
        padding: "6px 10px",
        cursor: "pointer",
      }}
    >
      ➕
    </button>
  </div>

{/* 🍱 СЕТ */}
  {item.type === "set" && (
    <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
      <b>Состав:</b>
      {item.items?.map((i, idx) => (
        <div key={idx}>• {i.name}</div>
      ))}
    </div>
  )}
</div>
      </div>
    ))}
  </>
)}

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => {
              setMenuData((prev) =>
                prev.map((s) => ({
                  ...s,
                  items: s.items.map((i) =>
                    i.name === item.name
                      ? { ...i, available: !i.available }
                      : i
                  ),
                }))
              );
            }}
            style={{
              padding: "4px 8px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {item.available ? "🙈 Hide" : "👁️ Show"}
          </button>

          <button
            onClick={() => {
              setMenuData((prev) =>
                prev.map((s) => ({
                  ...s,
                  items: s.items.filter((i) => i.name !== item.name),
                }))
              );
            }}
            style={{
              padding: "4px 8px",
              border: "none",
              borderRadius: 6,
              background: "red",
              color: "white",
              cursor: "pointer",
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    ))}
    </div>
)}
      <div style={{
  display: "flex",
  gap: 10,
  overflowX: "auto",
  padding: "10px 0",
  marginBottom: 10
}}>
  {menuData.map(section => (
    <button
      key={section.title}
      onClick={() =>
        document.getElementById(section.title)?.scrollIntoView({ behavior: "smooth" })
      }
style={{
  whiteSpace: "nowrap",
  padding: "8px 12px",
  borderRadius: 20,
  border: "1px solid #f5c542",
  cursor: "pointer",
  background:
    activeCategory === section.title ? "#f5c542" : "#1e1e1e",
  color: activeCategory === section.title ? "#111" : "#f5c542",
  fontWeight: "bold",
  transition: "0.2s"
}}
    >
      {section.title}
    </button>
  ))}
</div>

    {/* MENU */}
{menuData.map((section) => (
  <div key={section.title} id={section.title}>
    
    {/* SECTION HEADER */}
    <h2
      onClick={() =>
        setOpenedMenu(
          openedMenu === section.title ? null : section.title
        )
      }
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22,
        fontStyle: "italic",
        color: "#f5c542",
        cursor: "pointer",
        padding: 14,
        borderRadius: 14,
        background: "rgba(245,197,66,0.08)",
        marginTop: 24,
        marginBottom: 8,
        border: "1px solid rgba(245,197,66,0.15)",
        letterSpacing: "0.5px",
        boxShadow: "0 0 12px rgba(245,197,66,0.08)",
        transition: "all 0.2s ease",
      }}
    >
      {section.title}{" "}
      {openedMenu === section.title ? "▲" : "▼"}
    </h2>

    {/* ITEMS */}
    {openedMenu === section.title && (
      <>
        {section.items
          .filter((item) => {
            const matchSearch = item.name
              .toLowerCase()
              .includes(search.toLowerCase());

            return matchSearch && item.available;
          })
          .map((item) => (
            <div
              key={item.name}
              style={{
                background: "#151515",
                padding: 14,
                borderRadius: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
                border: "1px solid rgba(245,197,66,0.12)",
                gap: 12,
              }}
            >
              {/* LEFT SIDE */}
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: 16 }}>
                  {item.name}
                </div>

                <div style={{ color: "#f5c542", marginTop: 4 }}>
                  {item.price} AZN
                </div>

                {/* DESCRIPTION */}
                {item.description && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 13,
                      opacity: 0.8,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {Array.isArray(item.description)
                      ? item.description.join("\n")
                      : item.description}
                  </div>
                )}
              </div>

              {/* ADD BUTTON */}
              <button
                onClick={(e) => addToCart(item, e)}
                style={{
                  background: "#f5c542",
                  border: "none",
                  borderRadius: 10,
                  width: 38,
                  height: 38,
                  fontWeight: "bold",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          ))}
      </>
    )}
  </div>
))}

      {/* MODAL */}
      {cartOpen && (
       <div
  onClick={() => setCartOpen(false)}
  style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    zIndex: 99999,
    animation: "fadeIn 0.25s ease"
  }}
><div
  onClick={(e) => e.stopPropagation()}
  style={{
    background: "#1e1e1e",
    width: "100%",
    maxWidth: 420,
    height: "75vh",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: "flex",
    flexDirection: "column",
    padding: 20,
    animation: "slideUp 0.3s ease"
  }}
>
            <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  }}
>
  <h2 style={{ margin: 0 }}>🛒 Səbət</h2>

  <button
    onClick={() => setCartOpen(false)}
    style={{
      border: "none",
      background: "transparent",
      fontSize: 24,
      cursor: "pointer",
      color: textColor,
      padding: 0,
    }}
  >
    ✖
  </button>
</div>

<div
  style={{
    flex: 1,
    overflowY: "auto",
    marginTop: 10,
    marginBottom: 10,
  }}
>

            {cart.map((item) => (
  <div
    key={item.name}
    style={{
      marginBottom: 12,
      paddingBottom: 10,
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* INFO */}
      <div>
        <div
          style={{
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {item.name}
        </div>

        <small
          style={{
            opacity: 0.7,
          }}
        >
          {item.price} AZN
        </small>
      </div>

      {/* CONTROLS */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* MINUS */}
        <button
          onClick={() =>
            setCart((prev) =>
              prev
                .map((i) =>
                  i.name === item.name
                    ? {
                        ...i,
                        qty: (i.qty || 1) - 1
                      }
                    : i
                )
                .filter((i) => (i.qty || 0) > 0)
            )
          }
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ➖
        </button>

        {/* QTY */}
        <span
          style={{
            minWidth: 20,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {item.qty}
        </span>

        {/* PLUS */}
        <button
          onClick={() =>
            setCart((prev) =>
              prev.map((i) =>
                i.name === item.name
                  ? {
                      ...i,
                      qty: i.qty + 1,
                    }
                  : i
              )
            )
          }
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ➕
        </button>

        {/* DELETE */}
        <button
          onClick={() =>
            setCart((prev) =>
              prev.filter((i) => i.name !== item.name)
            )
          }
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
))}
  </div>
            <h3>💰 {total} AZN</h3>

<button
  onClick={() => {
  if (window.confirm("Səbəti tam təmizləmək istəyirsiniz?")) {
    setCart([]);
  }
}}
  style={{
    width: "100%",
    padding: 10,
    marginBottom: 10,
    border: "none",
    borderRadius: 10,
    background: "#cc3333",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  🗑️ Səbəti təmizlə
</button>

<button
  onClick={order}
  style={{
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 10,
    boxShadow: "0 6px 20px rgba(245,197,66,0.5)",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Заказ
</button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
     <div
  ref={cartRef}
  onClick={() => setCartOpen(true)}
  style={{
    position: "fixed",
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f5c542, #d8a92e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    cursor: "pointer",
    zIndex: 9999,
    boxShadow: "0 10px 25px rgba(245,197,66,0.35)"
  }}
>
  🛒 {cart.length}
</div>

    </div>
  );
}
<style jsx>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(40px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`}</style>
