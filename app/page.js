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
    if (activeCategory === "Hamısı") return;
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
}, [menuData, activeCategory]);
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
  useEffect(() => {
  if (menuData.length > 0 && !activeCategory) {
    setActiveCategory("Hamısı");
  }
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
  <div
    style={{
      backgroundImage: dark ? "none" : "url('/images/pearl-header.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "repeat",
      backgroundColor: dark ? "#0b0b0b" : "transparent",

      color: dark ? "#fff" : "#111",
      minHeight: "100vh",
      padding: 24,
      fontFamily: "'Inter', sans-serif",
    }}
>

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
      backgroundImage: "url('/images/pearl-header.png')",
      backgroundSize: "cover",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",

      minHeight: "100vh",

      color: "#222",
    }}
>
    
<div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "6px 12px 8px",

    background:
      "linear-gradient(
        to bottom,
        rgba(255,255,255,0.35),
        rgba(255,255,255,0.15),
        transparent
      )",

    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",

    isolation: "isolate",
  }}
>
  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  }}
>
    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
  }}
>
  <div
    style={{
  width: 40,
  height: 40,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
}}
  >
    <img
      src="/logo(1).png"
      alt="Mirvari"
      onClick={handleLogoClick}
      style={{
  width: 42,
  height: 42,
  objectFit: "contain",
  cursor: "pointer",
  filter: "drop-shadow(0 3px 10px rgba(212,175,55,.28))",
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
        color: "#9d7424",
        fontFamily: "'Playfair Display', serif",
        fontSize: 30,
        letterSpacing: 0.5,
        fontStyle: "italic",
        fontWeight: 300,
        lineHeight: 1,
        textShadow: "0 2px 10px rgba(184,138,42,.15)",
        filter: "drop-shadow(0 0 12px rgba(245,197,66,.2))",
      }}
    >
      Mirvari
    </div>

    <div
      style={{
        color: "#b4934d",
        fontSize: 8,
        letterSpacing: 5,
        marginTop: 1,
        fontWeight: 700,
      }}
    >
      RESTAURANT
    </div>
        <div
style={{
  marginTop:6,
  color:"#b4934d",
  fontSize:10,
  letterSpacing:2,
  fontStyle:"italic",
}}
>
  Hər loxmada incə bir zövq
</div>
  </div>
</div>
        <div
style={{
  display:"flex",
  gap:4,
  justifyContent:"flex-end",
  alignItems:"center",
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
  width: 34,
  height: 34,
  fontSize: 15,
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
  width: 34,
  height: 34,
  fontSize: 15,
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
    🔔
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
  width: 34,
  height: 34,
  fontSize: 15,
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

{/* CATEGORY BAR */}
<div
style={{
  position: "sticky",
  top: 120,
  zIndex: 60,

  background:
    "linear-gradient(
      to bottom,
      rgba(255,255,255,0.25),
      transparent
    )",

  backdropFilter:"blur(10px)",
  WebkitBackdropFilter:"blur(10px)",
    }}
    >
  <div
  style={{
    display: "flex",
    gap: 8,
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap",
    padding: "4px 0px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  }}
>
<button
  onClick={() => {
    setActiveCategory("Hamısı");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }}
  style={{
    flexShrink: 0,

    background:
      activeCategory === "Hamısı"
      ? "linear-gradient(180deg,#f8d86d,#d7a42c)"
      : "rgba(255,255,255,.18)",

    backdropFilter:"blur(16px)",
    WebkitBackdropFilter:"blur(16px)",

    border:"1.5px solid rgba(212,175,55,.75)",

    color:"#8c6a22",
padding: "7px 18px",
fontSize: 12,
borderRadius: 999,
height: 36,
minWidth: "auto",

    display:"flex",
    alignItems:"center",
    justifyContent:"center",

    cursor:"pointer",
    fontWeight:"700",
    whiteSpace:"nowrap",
  }}
>
  ✨ Hamısı
</button>
{menuData.map((section) => (
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
? "linear-gradient(180deg,#f8d86d,#d7a42c)"
: "rgba(255,255,255,.18)",

backdropFilter:"blur(16px)",
WebkitBackdropFilter:"blur(16px)",

border:
activeCategory === section.title
? "1px solid #d4af37"
: "1px solid rgba(212,175,55,.55)",
      
      color:
 activeCategory === section.title
 ? "#2b2418"
 : "#8c6a22",

     padding: "5px 14px",
fontSize:10,
borderRadius:999,
height:32,
minHeight:32,
minWidth:"auto",
display:"flex",
alignItems:"center",
justifyContent:"center",
gap:6,
      cursor: "pointer",
      fontWeight: "700",
      whiteSpace: "nowrap",
      transition: "all .25s ease",
      boxShadow:
activeCategory === section.title
? `
0 0 0 1px rgba(255,240,190,.45),
0 10px 30px rgba(212,175,55,.28),
0 0 20px rgba(255,215,120,.35),
inset 0 1px 0 rgba(255,255,255,.6)
`
: `
0 0 0 1px rgba(255,230,170,.18),
0 8px 22px rgba(212,175,55,.12),
inset 0 1px 0 rgba(255,255,255,.55)
`,
    }}
  >
    {section.title}
  </button>
))}
  </div>
</div>
</div>

      {/* MENU */}
<div
  style={{
    position: "relative",
    zIndex: 1,
    padding: "20px 10px 0",
  }}
>
{(
activeCategory === "Hamısı"
  ? menuData.map((section) => ({
      ...section,
      items: [
        section.items.find((item) => item.recommended) ||
        section.items[0],
      ],
    }))
  : menuData.filter(
      (section) => section.title === activeCategory
    )
).map((section) => (
  <div
    key={section.title}
    id={section.title}
    style={{
      scrollMarginTop: 150,
      marginBottom: 24,
    }}
  >
            {section.items
              .filter((i) =>
                i.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <div
  key={item.name}
  style={{
 display:"flex",
 justifyContent:"space-between",
 alignItems:"center",
 padding:"12px 16px",
marginBottom:10,
borderRadius:22,
 background: "rgba(255,255,255,0.05)",
 backdropFilter:"blur(4px)",
 WebkitBackdropFilter:"blur(4px)",
 border: "1px solid rgba(212,175,55,.28)",
 transition:".35s",
 overflow: "visible",
 cursor:"pointer",
 position: "relative",
zIndex: 0,
 boxShadow:
activeCategory === "Hamısı"
? `
0 0 0 1px rgba(255,215,120,.45),
0 12px 35px rgba(212,175,55,.18),
0 0 24px rgba(255,215,120,.22),
inset 0 1px 1px rgba(255,255,255,.55)
`
: `
0 0 0 1px rgba(255,255,255,.18),
0 8px 22px rgba(0,0,0,.10),
0 0 16px rgba(212,175,55,.12),
inset 0 1px 1px rgba(255,255,255,.55)
`,
}}
>
  {activeCategory === "Hamısı" && (
  <div
    style={{
      position:"absolute",
      top:-12,
      right:10,
      zIndex:5,
      padding:"4px 10px",
      borderRadius:999,
      background:
        "linear-gradient(135deg,#f8d86d,#d4af37)",
      color:"#5a3d00",
      fontSize:10,
      fontWeight:700,
      letterSpacing:.5,
      boxShadow:
        "0 5px 15px rgba(212,175,55,.35)",
    }}
  >
    ⭐ Mirvari seçimi
  </div>
)}
  <div
style={{
 position:"absolute",
 top:0,
 left:0,
 right:0,
 height:"45%",
 background:
 "linear-gradient(to bottom, rgba(255,255,255,.18), transparent)",
 borderRadius:28,
 pointerEvents:"none",
}}
/>
  
<div
  style={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: 10,
  }}
>
<div
style={{
  width:95,
height:95,
marginLeft:-20,
marginTop:-10,
marginBottom:-10,
  borderRadius:"50%",
  overflow:"hidden",
  flexShrink:0,
  zIndex:2,
  boxShadow:
  "0 20px 45px rgba(0,0,0,.25), 0 0 25px rgba(245,197,66,.18)",
}}
>
  <img
    src={item.image || "/no-image.jpg"}
    alt={item.name}
    style={{
  width:"100%",
  height:"100%",
  objectFit:"cover",
}}
  />
</div>
    
  <div
    style={{
      flex: 1,
      minWidth: 0,
      paddingLeft: 4,
    }}
  >
    <div
style={{
  lineHeight: 1.2,
  letterSpacing: ".2px",
  marginBottom: 8,
  fontSize: "18px",
  fontWeight: "700",
  color: "#2b2418",
  fontFamily: "'Cormorant Garamond', serif",
}}
>
{item.name}
</div>
<div
  style={{
    width:70,
    opacity:.7,
    height: 2,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 5,
    background:
      "linear-gradient(90deg,#f5c542,rgba(245,197,66,0))",
  }}
/>
    {item.description && (
  <div
    style={{
 color:"rgba(70,55,35,.75)",
fontSize:11,
lineHeight:1.35,
marginTop: 2,
marginBottom: 8,
 fontFamily:"Inter, sans-serif",
}}
  >
    {item.description}
  </div>
)}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems:"stretch",
  }}
>
<div>
  <div
    style={{
      fontSize: 9,
letterSpacing: 1,
marginBottom: 2,
      color:"rgba(120,90,40,.65)",
      textTransform:"uppercase",
    }}
  >
    PRICE
  </div>

  <div
    style={{
      color:"#b88a2a",
      fontSize:16,
      fontWeight:"600",
      fontFamily:"'Cormorant Garamond', serif",
      textShadow:
      "0 0 14px rgba(245,197,66,.35)",
    }}
  >
    {item.price} ₼
  </div>
</div>
      <button
  onClick={(e) => addToCart(item, e)}
  style={{
    width:38,
height:38,
fontSize:22,
borderRadius:12,
    border:"1px solid rgba(255,255,255,.55)",
    background:
    "linear-gradient(145deg,#fff4c7,#e8b83e)",
    color:"#7d5a12",
    fontWeight:"500",
    cursor:"pointer",
    flexShrink:0,
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    boxShadow:`
0 4px 12px rgba(212,175,55,.25),
inset 0 1px 2px rgba(255,255,255,.7)
`,
    transition:"all .25s ease",
  }}
  onMouseDown={(e)=>{
    e.currentTarget.style.transform="scale(.85)";
  }}
  onMouseUp={(e)=>{
    e.currentTarget.style.transform="scale(1)";
  }}
>
  +
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
