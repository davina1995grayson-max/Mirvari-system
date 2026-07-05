"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export default function Page() {
  const router = useRouter();

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

      if (rect.top <= 140 && rect.bottom >= 140) {
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

<h1
  style={{
    color: "#f5c542",
    cursor: "pointer",
    fontWeight: "bold"
  }}
  onClick={handleLogoClick}
>
  🍽️ Mirvari Restaurant
</h1>

<p>Zəhmət olmasa masanı seçin</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
          <button key={num} onClick={() => setTable(num)}>
            🪑 {num}
          </button>
        ))}
      </div>
    </div>
  );
    }

  // ===== UI =====
  return (
    <div style={{ background: "#0b0b0b", color: "white", minHeight: "100vh" }}>

<header style={{ position: "sticky", top: 0 }}>
  <h1 onClick={handleLogoClick}>
    🍽️ Mirvari Restaurant
  </h1>
</header>
{/* ULTRA MOBILE CATEGORY BAR */}
<div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 9999,
    background: "rgba(10,10,10,0.95)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(245,197,66,0.12)",
    padding: "10px 10px",
  }}
>
  <div
    style={{
      display: "flex",
      gap: 8,
      overflowX: "auto",
    }}
  >
    {menuData.map((section) => (
      <button
  id={"cat-" + section.title}
  key={section.title}
  onClick={() => {
    if (typeof window === "undefined") return;

    setActiveCategory(section.title);

    document
      .getElementById(section.title)
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  style={{
    flex: "0 0 auto",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(245,197,66,0.2)",
    background:
      activeCategory === section.title
        ? "#f5c542"
        : "rgba(255,255,255,0.04)",
    color: activeCategory === section.title ? "#111" : "#aaa",
    fontWeight: "600",
    fontSize: 13,
    whiteSpace: "nowrap",
    transition: "0.2s",
  }}
>
  {section.title}
</button>
    ))}
  </div>
</div>

      {/* MENU */}
      <div>
        {menuData.map((section) => (
          <div key={section.title} id={section.title} style={{ scrollMarginTop: 100 }}>

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
                    padding: 10,
                    marginTop: 8,
                    background: "#1a1a1a",
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <div>{item.name}</div>
                    <div style={{ color: "gold" }}>{item.price} AZN</div>
                  </div>

                  <button onClick={(e) => addToCart(item, e)}>
                    ➕
                  </button>
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

    </div>
  );
      }
