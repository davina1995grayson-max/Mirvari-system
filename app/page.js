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
  let current = menuData[0]?.title;

  menuData.forEach((section) => {
    const el = document.getElementById(section.title);
    if (!el) return;

    const rect = el.getBoundingClientRect();

    if (rect.top <= 220) {
      current = section.title;
    }
  });

  setActiveCategory(current);
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

  const categoryImages = {
  "🥗 Soyuq Qəlyanaltılar": "/category/soyuqqelyan.jpg",
  "🥙 Salatlar": "/category/salad.jpg",
  "🍲 Şorbalar": "/category/soup.jpg",
  "🍔 Street Food / Fast Food": "/category/fastfood.jpg",
  "🔥 İsti Qəlyanaltılar": "/category/istiqelyan.jpg",
  "🍚 Qarnirlər": "/category/qarnir.jpg", 
  "🍖 Sac": "/category/sac.jpg",
  "🍢 Kabablar": "/category/kabab.jpg",
  "🍛 İsti Yeməklər": "/category/istiyemek.jpg",
  "🐟 Balıq Yeməkləri": "/category/fish.jpg",
  "🍹 İçkilər": "/category/drink.jpg",
  "🍰 Desertlər": "/category/desert.jpg",
  "🍺 Pivə Məzələri": "/category/pivo.jpg",
  "🍻 Pivə & İçkilər": "/category/vodka.jpg",
};

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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  }}
>
    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,
  }}
>
  <div
    style={{
  width: 68,
  height: 68,
  borderRadius: "50%",
  background:
    "linear-gradient(180deg, rgba(255,255,255,.05), rgba(245,197,66,.08))",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(245,197,66,.25)",
  boxShadow:
    "0 12px 28px rgba(0,0,0,.45), inset 0 1px 1px rgba(255,255,255,.05)",
  flexShrink: 0,
}}
  >
    <img
      src="/logo(1).png"
      alt="Mirvari"
      onClick={handleLogoClick}
      style={{
        width: 52,
        height: 52,
        objectFit: "contain",
        cursor: "pointer",
      }}
    />
  </div>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        color: "#f5c542",
        fontFamily: "'Playfair Display', serif",
        fontSize: 42,
        fontStyle: "italic",
        fontWeight: 600,
        letterSpacing: 1,
        lineHeight: 1,
        textShadow: "0 2px 8px rgba(245,197,66,.25)",
        filter: "drop-shadow(0 0 12px rgba(245,197,66,.2))",
      }}
    >
      Mirvari
    </div>

    <div
      style={{
        color: "#c9a64d",
        fontSize: 13,
        letterSpacing: 8,
        fontWeight: 700,
        marginTop: 3,
      }}
    >
      RESTAURANT
    </div>
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    color: "#d9b86a",
    fontSize: 12,
    fontWeight: 500,
  }}
>
  ⭐⭐⭐⭐⭐
  <span style={{ opacity: .75 }}>
    Premium Restaurant
  </span>
</div>
  </div>
</div>
  </div>

  <div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 4,
  }}
>
  <button
    onClick={() => setTable(null)}
    style={{
      flex: 1,
      height: 44,
      borderRadius: 22,
      background: "#f5c542",
      color: "#111",
      border: "none",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
    }}
  >
    🔄 Masa
  </button>

  <button
    onClick={callWaiter}
    style={{
      flex: 1,
      height: 44,
      borderRadius: 22,
      background: "transparent",
      color: "#f5c542",
      border: "1px solid rgba(245,197,66,.4)",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
    }}
  >
    🔔 Ofisiant
  </button>

  <button
    onClick={callBill}
    style={{
      flex: 1,
      height: 44,
      borderRadius: 22,
      background: "transparent",
      color: "#f5c542",
      border: "1px solid rgba(245,197,66,.4)",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
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
  top: 156,
  zIndex: 9999,
  background: "rgba(18,18,18,.95)",
  backdropFilter: "blur(18px)",
  padding: "14px 14px 12px",
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  borderBottom: "1px solid rgba(245,197,66,.08)",
  boxShadow: "0 12px 30px rgba(0,0,0,.45)",
}}
>
  <div
  style={{
    color: "#c6a85d",
    fontSize: 12,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 10,
    fontWeight: 600,
  }}
>
  OUR MENU
</div>
  <div
  style={{
    display: "flex",
    gap: 10,
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    padding: "6px 2px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>{menuData.map((section) => (
  <button
    key={section.title}
    id={"cat-" + section.title}
    onClick={() => {
      setActiveCategory(section.title);
      const el = document.getElementById(section.title);

      if (el) {
        const y =
          el.getBoundingClientRect().top +
          window.pageYOffset -
          280;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }}
    style={{
      flexShrink: 0,
      background:
        activeCategory === section.title
          ? "linear-gradient(135deg,#f5c542,#e0aa2b)"
          : "rgba(255,255,255,0.03)",

      color:
        activeCategory === section.title
          ? "#111"
          : "#f5c542",

      border: "1px solid rgba(245,197,66,0.25)",
      padding: "10px 18px",
      borderRadius: 18,
      cursor: "pointer",
      fontWeight: "700",
      fontSize: 14,
      whiteSpace: "nowrap",
      transition: "all .25s ease",
      boxShadow:
        activeCategory === section.title
          ? "0 10px 24px rgba(245,197,66,.45), inset 0 1px 1px rgba(255,255,255,.3)"
          : "0 6px 18px rgba(0,0,0,.35)",
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
    padding: "18px",
    maxWidth: 900,
    margin: "0 auto",
  }}
>
{menuData.map((section) => (
  <div
    key={section.title}
    id={section.title}
    style={{
      scrollMarginTop: 230,
      marginBottom: 24,
    }}
  >
{categoryImages[section.title] && (
  <div
    style={{
      position: "relative",
      height: 180,
      borderRadius: 22,
      overflow: "hidden",
      marginBottom: 18,
      boxShadow: "0 10px 30px rgba(0,0,0,.35)",
    }}
  >
    <img
      src={categoryImages[section.title]}
      alt={section.title}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />

    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,.75), transparent)",
      }}
    />

    <div
  style={{
    position: "absolute",
    bottom: 18,
    left: 20,
  }}
>
  <h2
    style={{
      margin: 0,
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 34,
      fontStyle: "italic",
      fontWeight: 700,
      color: "#f5c542",
      letterSpacing: 1,
      textShadow:
        "0 2px 8px rgba(0,0,0,.8), 0 0 18px rgba(245,197,66,.45)",
    }}
  >
    {section.title}
  </h2>

 <div
  style={{
    width: "70%",
    maxWidth: 170,
    height: 2,
    marginTop: 6,
    background:
      "linear-gradient(90deg, #f5c542 0%, rgba(245,197,66,.5) 55%, transparent 100%)",
    borderRadius: 20,
    boxShadow:
      "0 0 10px rgba(245,197,66,.35)",
  }}
/>
</div>
  </div>
)}
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
  padding: "26px",
  marginBottom: 22,
  background:
  "linear-gradient(180deg, rgba(33,33,33,.96), rgba(18,18,18,.98))",
  border: "1px solid rgba(245,197,66,.12)",
  borderRadius: 28,
  boxShadow:
  "0 18px 40px rgba(0,0,0,.45), 0 0 1px rgba(255,255,255,.05)",
  transition: ".35s",
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",
}}
                >
<div
  style={{
  display: "flex",
  alignItems: "center",
  width: "100%",
  gap: 22,
}}
>
  <img
  src={item.image || "/no-image.jpg"}
  alt={item.name}
  style={{
  width: 125,
  height: 125,
  objectFit: "cover",
  borderRadius: 24,
  border: "2px solid rgba(245,197,66,.18)",
  flexShrink: 0,

  boxShadow:
    "0 18px 35px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.03)",

  transition: ".35s",
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
  fontSize: 22,
  fontWeight: "700",
  color: "#ffffff",
  lineHeight: 1.25,
  letterSpacing: ".2px",
  marginBottom: 8,
}}
    >
      {item.name}
</div>
<div
  style={{
    width: 36,
    height: 2,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 5,
    background:
      "linear-gradient(90deg,#f5c542,rgba(245,197,66,0))",
  }}
/>
    {item.description && (
  <div
    style={{
  color: "#b5b5b5",
  fontSize: 15,
  lineHeight: 1.7,
  marginTop: 8,
  marginBottom: 18,
  opacity: .9,
}}
  >
    {item.description}
  </div>
)}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <div>
  <div
    style={{
      color: "#777",
      fontSize: 11,
      letterSpacing: 2,
      marginBottom: 4,
      textTransform: "uppercase",
    }}
  >
    Price
  </div>

  <div
    style={{
      color: "#F4C542",
      fontSize: 26,
      fontWeight: "700",
      textShadow: "0 0 15px rgba(245,197,66,.25)",
    }}
  >
    {item.price} ₼
  </div>
</div>
      <button
  onClick={(e) => addToCart(item, e)}
  style={{
  width: 58,
  height: 58,
  borderRadius: 20,
  border: "none",
  background:
    "linear-gradient(180deg,#FFE28A 0%,#F5C542 55%,#C99216 100%)",
  color: "#111",
  fontSize: 34,
  fontWeight: "700",
  cursor: "pointer",
  flexShrink: 0,
  boxShadow:
    "0 12px 24px rgba(245,197,66,.35), inset 0 2px 3px rgba(255,255,255,.55)",
  transition: ".25s",
}}
>
  ＋
</button>
</div>
  </div>

</div>
</div>
              ))}
          </div>
        ))}
      </div>

{cart.length > 0 && (
  <div
    onClick={() => setCartOpen(true)}
    style={{
      position: "fixed",
      left: 16,
      right: 16,
      bottom: 16,
      height: 68,
      borderRadius: 22,
      background: "linear-gradient(135deg,#f5c542,#d8a322)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px",
      cursor: "pointer",
      zIndex: 9999,
      boxShadow: "0 15px 35px rgba(245,197,66,.35)",
    }}
  >
    <div>
      <div
        style={{
          color: "#111",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        🛒 {cart.reduce((sum, item) => sum + (item.qty || 1), 0)} məhsul
      </div>

      <div
        style={{
          color: "#3b2b00",
          fontSize: 13,
        }}
      >
        Səbətə bax
      </div>
    </div>

    <div
      style={{
        color: "#111",
        fontWeight: 800,
        fontSize: 22,
      }}
    >
      {total} ₼
    </div>
  </div>
)}

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
        background: "linear-gradient(180deg,#1b1b1b,#111)",
        width: "100%",
        maxWidth: 420,
        height: "80vh",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        display: "flex",
        flexDirection: "column",
        padding: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2
  style={{
    color: "#f5c542",
    fontSize: 28,
    margin: 0,
    fontWeight: 700,
  }}
>
  🛒 Səbət
</h2>
        <button onClick={() => setCartOpen(false)}>✖</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {cart.map((item) => (
  <div
    key={item.name}
    style={{
      background: "#1c1c1c",
      border: "1px solid rgba(245,197,66,.15)",
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,.3)",
    }}
  >
            <div
  style={{
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 6,
  }}
>
  {item.name}
</div>
            <div
  style={{
    color: "#f5c542",
    fontWeight: 700,
    fontSize: 17,
    marginBottom: 12,
  }}
>
  {item.price} ₼
</div>

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
