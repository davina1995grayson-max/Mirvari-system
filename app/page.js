"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export default function Page() {
  const router = useRouter();

  const [dark, setDark] = useState(true);
  const isBrowser = typeof window !== "undefined";
  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const callWaiter = () => {
  const text = `🔔 OFİSİANT ÇAĞIRILDI\n🪑 Masa: ${table}`;
  window.open(`https://wa.me/994553976762?text=${encodeURIComponent(text)}`);
};

const callBill = () => {
  const text = `💳 HESAB İSTƏNİLDİ\n🪑 Masa: ${table}`;
  window.open(`https://wa.me/994553976762?text=${encodeURIComponent(text)}`);
};
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});
  const [search, setSearch] = useState("");
  const cartRef = useRef(null);
  const [logoClicks, setLogoClicks] = useState(0);
const handleLogoClick = () => {
  setLogoClicks((prev) => {
    const next = prev + 1;
    if (next >= 3) {
      router.push("/admin");
      return 0;
    }
    return next;
  });

  setTimeout(() => setLogoClicks(0), 1500);
};

  // ===== LOAD MENU =====
  useEffect(() => {
    const loadMenu = async () => {
      const { data } = await supabase
        .from("menu")
        .select("*");

      if (!data) return;

      const grouped = {};

      data.forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });

      setMenuData(
        Object.keys(grouped).map((cat) => ({
          title: cat,
          items: grouped[cat],
        }))
      );
    };

    loadMenu();
  }, []);

  // ===== SCROLL SYNC (Glovo logic) =====
  useEffect(() => {
  if (!isBrowser) return;

  const handleScroll = () => {
    let current = null;

    menuData.forEach((section) => {
      const el = document.getElementById(section.title);
      if (!el) return;

      const rect = el.getBoundingClientRect();

      if (rect.top <= 40 && rect.bottom >= 40) {
        current = section.title;
      }
    });

    if (current) setActiveCategory(current);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [menuData]);
 useEffect(() => {
  if (!activeCategory) return;

  const el = document.getElementById("cat-" + activeCategory);
  if (!el) return;

  el.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
}, [activeCategory]);

  // ===== ADD TO CART =====
const addToCart = (item, e) => {
  setCart((prev) => {
    const exists = prev.find((i) => i.name === item.name);

    if (exists) {
      return prev.map((i) =>
        i.name === item.name
          ? { ...i, qty: (i.qty || 1) + 1 }
          : i
      );
    }

    return [...prev, { ...item, qty: 1 }];
  });

  if (typeof window === "undefined") return;

  const btn = e.currentTarget;
  const cartEl = cartRef.current;

  if (!btn || !cartEl) return;

  const flyEl = document.createElement("div");
  flyEl.innerText = "🍽️";
  flyEl.style.position = "fixed";
  flyEl.style.left = btn.getBoundingClientRect().left + "px";
  flyEl.style.top = btn.getBoundingClientRect().top + "px";
  flyEl.style.transition = "all 0.9s ease";
  flyEl.style.pointerEvents = "none";
  flyEl.style.zIndex = "99999";

  document.body.appendChild(flyEl);

  const cartRect = cartEl.getBoundingClientRect();

  requestAnimationFrame(() => {
    flyEl.style.left = cartRect.left + "px";
    flyEl.style.top = cartRect.top + "px";
    flyEl.style.opacity = "0";
  });

  setTimeout(() => flyEl.remove(), 800);
};

  const total = cart.reduce(
    (sum, i) => sum + i.price * (i.qty || 1),
    0
  );

  // ===== LOADING =====
  if (table === null) {
  return (
    <div style={{
  background: dark ? "#0b0b0b" : "#f6f6f6",
  color: dark ? "#fff" : "#111",
  minHeight: "100vh",
  padding: 24,
  fontFamily: "'Inter', sans-serif",
}}>

<div
  onClick={handleLogoClick}
  style={{
    textAlign: "center",
    marginBottom: 25,
    cursor: "pointer",
  }}
>
  <img
    src="/logo.png"
    alt="Mirvari Restaurant"
    style={{
      width: "100%",
      maxWidth: 420,
      height: "auto",
      display: "block",
      margin: "0 auto",
    }}
  />
</div>

<p
  style={{
    textAlign: "center",
    color: "#d8b15a",
    fontSize: 20,
    marginBottom: 30,
    fontWeight: 500,
  }}
>
Zəhmət olmasa masanı seçin
</p>

    <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
</div>

     <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12,
  maxWidth: 420,
  margin: "0 auto"
}}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
          <button
  key={num}
  onClick={() => setTable(num)}
  style={{
    background: "linear-gradient(135deg, #f5c542, #e0aa2b)",
    border: "none",
    padding: 18,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: "bold"
  }}
>
  🪑 {num}
</button>
        ))}
      </div>
    </div>
  );
    }

  // ===== UI =====
  return (
  <div
    style={{
      background:
        "linear-gradient(180deg,#0b0b0b 0%, #131313 35%, #191919 100%)",
      color: "white",
      minHeight: "100vh",
    }}
  >
    
<header
  style={{
    position: "sticky",
    top: 0,
    zIndex: 10000,
    background: "#0b0b0b",
    padding: "10px 16px",
    borderBottom: "1px solid rgba(245,197,66,.15)",
  }}
>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 10,
    }}
  >
    <img
      src="/logo(1).png"
      alt="Mirvari"
      onClick={handleLogoClick}
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        objectFit: "cover",
        cursor: "pointer",
      }}
    />

    <div>
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
  }}
>
  <div
    style={{
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 42,
  fontWeight: 400,
  fontStyle: "italic",
  color: "#f5c542",
  letterSpacing: 1,
  textShadow:
    "0 2px 6px rgba(0,0,0,.6), 0 0 12px rgba(245,197,66,.25)",
  lineHeight: 1,
}}
  >
    Mirvari
  </div>

  <div
    style={{
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 16,
  fontWeight: 700,
  fontStyle: "italic",
  color: "#d4b05a",
  letterSpacing: 4,
  textTransform: "uppercase",
  marginTop: 2,
}}
  >
    Restaurant
  </div>
      </div>
    </div>
  </div>

  <div
    style={{
      display: "flex",
      gap: 8,
    }}
  >
    <button
      onClick={() => setTable(null)}
      style={{
        flex: 1,
        background: "#f5c542",
        border: "none",
        padding: 10,
        borderRadius: 12,
        fontWeight: "bold",
      }}
    >
      🔄 Masa
    </button>

    <button
      onClick={callWaiter}
      style={{
        flex: 1,
        padding: 10,
        borderRadius: 12,
        background: "#1e1e1e",
        color: "#f5c542",
        border: "1px solid #f5c542",
      }}
    >
      🔔 Ofisiant
    </button>

    <button
      onClick={callBill}
      style={{
        flex: 1,
        padding: 10,
        borderRadius: 12,
        background: "#1e1e1e",
        color: "#f5c542",
        border: "1px solid #f5c542",
      }}
    >
      💳 Hesab
    </button>
  </div>

</header>

{/* ULTRA MOBILE CATEGORY BAR */}
<div
  style={{
    position: "sticky",
    top: 150,
    zIndex: 9999,
    background: "#111",
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
  }}
>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      padding: "8px 0",
      justifyContent: "flex-start",
    }}
  >
    {menuData.map((section) => (
      <button
        key={section.title}
        onClick={() => {
          setActiveCategory(section.title);

          const el = document.getElementById(section.title);

if (el) {
  const y = el.getBoundingClientRect().top + window.pageYOffset - 400;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
}
        }}
        style={{
  background:
    activeCategory === section.title
      ? "linear-gradient(135deg,#f5c542,#e0aa2b)"
      : "rgba(255,255,255,0.03)",

  color:
    activeCategory === section.title
      ? "#111"
      : "#f5c542",

  border: "1px solid rgba(245,197,66,0.25)",
  padding: "7px 14px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 13,
  whiteSpace: "nowrap",
  transition: "all .25s ease",
  boxShadow:
    activeCategory === section.title
      ? "0 4px 14px rgba(245,197,66,.35)"
      : "0 2px 8px rgba(0,0,0,.2)",
}}
      >
        {section.title}
      </button>
    ))}
  </div>
</div>

      {/* MENU */}
<div
  style={{
    padding: "12px",
  }}
>
{menuData.map((section) => (
  <div
    key={section.title}
    id={section.title}
    style={{
      scrollMarginTop: 170,
      marginBottom: 24,
    }}
  >

    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
    marginBottom: 22,
  }}
>
  <h2
    style={{
      color: "#f5c542",
      fontSize: 24,
      fontWeight: "700",
      margin: 0,
      whiteSpace: "nowrap",
      textShadow: "0 2px 8px rgba(245,197,66,.25)",
    }}
  >
    {section.title}
  </h2>

  <div
    style={{
      flex: 1,
      height: 1,
      background:
        "linear-gradient(to right, rgba(245,197,66,.9), rgba(245,197,66,.05))",
    }}
  />
</div>
            {section.items
              .filter((i) =>
                i.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.name}
                  style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "22px",
  marginBottom: "18px",
  background: "linear-gradient(180deg, #1b1b1b, #141414)",
  border: "1px solid rgba(245,197,66,0.18)",
  borderRadius: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,.35)",
transition: "0.25s",
overflow: "hidden",
cursor: "pointer",
}}
                >
<div
  style={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: 16,
  }}
>
  <img
    src={item.image || "/no-image.jpg"}
    alt={item.name}
    style={{
      width: 110,
      height: 110,
      objectFit: "cover",
      borderRadius: 16,
      flexShrink: 0,
      border: "1px solid rgba(245,197,66,.2)",
      boxShadow: "0 8px 20px rgba(0,0,0,.35)",
    }}
  />

  <div
    style={{
      flex: 1,
      minWidth: 0,
    }}
  >
    <div
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: "#fff",
        marginBottom: 8,
      }}
    >
      {item.name}
    </div>

    <div
      style={{
        color: "#f5c542",
        fontSize: 17,
        fontWeight: 700,
      }}
    >
      {item.price} ₼
    </div>

        {item.description && (
  <div
    style={{
      marginTop: 8,
      color: "#9f9f9f",
      fontSize: 13,
      lineHeight: 1.4,
    }}
  >
    {item.description}
  </div>
)}
  </div>

  <button
    onClick={(e) => addToCart(item, e)}
    style={{
      width: 48,
      height: 48,
      borderRadius: 16,
      border: "none",
      background: "linear-gradient(135deg,#f5c542,#e0aa2b)",
      color: "#111",
      fontSize: 28,
      fontWeight: "bold",
      cursor: "pointer",
      flexShrink: 0,
      boxShadow: "0 6px 18px rgba(245,197,66,.35)",
    }}
  >
    +
  </button>
</div>
</div>
              ))}
          </div>
        ))}
      </div>

      {/* CART BUTTON */}
      <div
        onClick={() => setCartOpen(true)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          background: "gold",
          padding: 15,
          borderRadius: 50,
          cursor: "pointer",
        }}
      >
        🛒 {cart.length}
      </div>

      {/* TOTAL */}
      <div style={{ position: "fixed", bottom: 90, right: 20 }}>
        💰 {total} AZN
      </div>

{cartOpen && (
  <div
    onClick={() => setCartOpen(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(6px)",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      zIndex: 99999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#141414",
        width: "100%",
        maxWidth: 420,
        height: "80vh",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: "flex",
        flexDirection: "column",
        padding: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>🛒 Səbət</h2>
        <button onClick={() => setCartOpen(false)}>✖</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {cart.map((item) => (
          <div key={item.name} style={{ marginBottom: 10 }}>
            <div>{item.name}</div>
            <div>{item.price} AZN</div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() =>
                  setCart((prev) =>
                    prev
                      .map((i) =>
                        i.name === item.name
                          ? { ...i, qty: (i.qty || 1) - 1 }
                          : i
                      )
                      .filter((i) => (i.qty || 0) > 0)
                  )
                }
              >
                ➖
              </button>

              <span>{item.qty}</span>

              <button
                onClick={() =>
                  setCart((prev) =>
                    prev.map((i) =>
                      i.name === item.name
                        ? { ...i, qty: (i.qty || 1) + 1 }
                        : i
                    )
                  )
                }
              >
                ➕
              </button>

              <button
                onClick={() =>
                  setCart((prev) =>
                    prev.filter((i) => i.name !== item.name)
                  )
                }
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3>💰 {total} AZN</h3>

         <button
  disabled={cart.length === 0}
  onClick={() => setCheckoutOpen(true)}
  style={{
    width: "100%",
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    border: "none",
    fontWeight: "bold",
    cursor: cart.length === 0 ? "not-allowed" : "pointer",
    background:
      cart.length === 0
        ? "rgba(255,255,255,0.1)"
        : "linear-gradient(135deg, #f5c542, #d8a92e)",
    color: cart.length === 0 ? "#777" : "#111",
    opacity: cart.length === 0 ? 0.6 : 1,
  }}
>
  🍽️ Sifariş et
</button>
    
      <button onClick={() => setCart([])}>
        🗑️ Təmizlə
      </button>
    </div>
  </div>
)}
  {checkoutOpen && (
  <div
    onClick={() => setCheckoutOpen(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#141414",
        padding: 20,
        borderRadius: 18,
        width: "90%",
        maxWidth: 420,
        border: "1px solid rgba(245,197,66,0.2)",
      }}
    >
      <h2 style={{ color: "#f5c542" }}>🍽️ Sifarişi təsdiqlə</h2>

      <p>🪑 Masa: {table}</p>

      <div style={{ marginTop: 10 }}>
        {cart.map((item) => (
          <div key={item.name}>
            • {item.name} x{item.qty || 1}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 15 }}>💰 {total} AZN</h3>

      <button
        onClick={() => {
          const itemsText = cart
            .map(
              (i) =>
                `• ${i.name} x${i.qty || 1} = ${i.price * (i.qty || 1)} AZN`
            )
            .join("\n");

          const text =
            `🍽️ YENİ SİFARİŞ\n` +
            `🪑 Masa: ${table}\n\n` +
            `${itemsText}\n\n` +
            `💰 TOTAL: ${total} AZN`;

          window.open(
            `https://wa.me/994553976762?text=${encodeURIComponent(text)}`
          );

          setCart([]);
          setCheckoutOpen(false);
          setCartOpen(false);
        }}
        style={{
          width: "100%",
          marginTop: 15,
          padding: 14,
          borderRadius: 14,
          border: "none",
          background: "#f5c542",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        🚀 Sifarişi göndər
      </button>
    </div>
  </div>
)}
    </div>
  );
      }
