"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";

export default function Page() {
  const router = useRouter();

  const [menuData, setMenuData] = useState([]);
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const indicatorRef = useRef(null);
  const categoryRefs = useRef({});
  const [search, setSearch] = useState("");
  const cartRef = useRef(null);

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

    if (current) {
      setActiveCategory(current);

      const btn = categoryRefs.current[current];
      const indicator = indicatorRef.current;

      if (btn && indicator) {
        indicator.style.width = btn.offsetWidth + "px";
        indicator.style.left = btn.offsetLeft + "px";
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [menuData]);

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
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * (i.qty || 1),
    0
  );

  // ===== LOADING =====
  if (table === null) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Выбери стол</h2>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => setTable(n)}>
            🪑 {n}
          </button>
        ))}
      </div>
    );
  }

  // ===== UI =====
  return (
    <div style={{ background: "#0b0b0b", color: "white", minHeight: "100vh" }}>

      {/* TOP CATEGORIES */}
      <div style={{
        position: "sticky",
        top: 0,
        display: "flex",
        overflowX: "auto",
        gap: 10,
        padding: 10,
        background: "#111",
        zIndex: 1000
      }}>
        <div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 9999,
    background: "rgba(15,15,15,0.7)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(245,197,66,0.15)",
    padding: "10px 0",
  }}
>
  <div style={{ position: "relative", display: "flex", overflowX: "auto" }}>

    <div
      ref={indicatorRef}
      style={{
        position: "absolute",
        bottom: 0,
        height: 3,
        width: 0,
        left: 0,
        background: "linear-gradient(90deg, #f5c542, #ffdd77)",
        borderRadius: 999,
        transition: "all 0.3s ease",
      }}
    />

    {menuData.map((section) => (
      <button
        key={section.title}
        ref={(el) => (categoryRefs.current[section.title] = el)}
        onClick={() => {
          setActiveCategory(section.title);

          document
            .getElementById(section.title)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        style={{
          padding: "10px 16px",
          margin: "0 6px",
          borderRadius: 999,
          border: "none",
          background: "transparent",
          color:
            activeCategory === section.title ? "#f5c542" : "#aaa",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        {section.title}
      </button>
    ))}
  </div>
</div>
      </div>

<div style={{
  position: "sticky",
  top: 0,
  zIndex: 9999,
  display: "flex",
  overflowX: "auto",
  background: "rgba(10,10,10,0.75)",
  backdropFilter: "blur(16px)",
  padding: 10,
}}>

  <div
    ref={indicatorRef}
    style={{
      position: "absolute",
      bottom: 0,
      height: 3,
      width: 0,
      background: "#f5c542",
      transition: "0.3s",
    }}
  />

  {menuData.map((section) => (
    <button
      key={section.title}
      ref={(el) => (categoryRefs.current[section.title] = el)}
      onClick={() => {
        setActiveCategory(section.title);

        document.getElementById(section.title)
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      style={{
        padding: "10px 14px",
        borderRadius: 999,
        border: "none",
        background: "transparent",
        color: activeCategory === section.title ? "#f5c542" : "#aaa",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      {section.title}
    </button>
  ))}
</div>

      {/* MENU */}
      <div>
        {menuData.map((section) => (
          <div key={section.title} id={section.title} style={{ scrollMarginTop: 100 }}>
            
            <h2 style={{ color: "gold" }}>
              {section.title}
            </h2>

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
