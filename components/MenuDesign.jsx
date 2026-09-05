"use client";

export default function MenuDesign({
  menuData,
  activeCategory,
  setActiveCategory,
  addToCart,
}) {

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F4EE",
        color: "#2b2418",
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
      }}
    >

      {/* HEADER */}
      <header
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:25,
        }}
      >

        <div>
          <div
            style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:34,
              color:"#B88A2A",
              fontStyle:"italic",
            }}
          >
            MIRVARI
          </div>

          <div
            style={{
              fontSize:10,
              color:"#B88A2A",
              letterSpacing:2,
              fontStyle:"italic",
            }}
          >
            Hər loxmada incə bir zövq
          </div>
        </div>


        <div
          style={{
            display:"flex",
            gap:8,
          }}
        >
          <button className="lang">
            AZ
          </button>

          <button className="lang">
            RU
          </button>

          <button className="lang">
            EN
          </button>

          <button className="icon">
            🌙
          </button>

          <button className="icon">
            🛒
          </button>

        </div>

      </header>


      {/* CATEGORIES */}

      <div
        style={{
          display:"flex",
          gap:10,
          overflowX:"auto",
          marginBottom:25,
          paddingBottom:10,
        }}
      >

        {menuData.map((section)=>(
          <button
            key={section.title}
            onClick={()=>{
              setActiveCategory(section.title)
            }}
            style={{
              flexShrink:0,
              padding:"10px 18px",
              borderRadius:14,
              border:
              activeCategory===section.title
              ?
              "1px solid #D4AF37"
              :
              "1px solid #E5DED2",

              background:
              activeCategory===section.title
              ?
              "linear-gradient(#E9C45A,#C99828)"
              :
              "#fff",

              color:
              activeCategory===section.title
              ?
              "#fff"
              :
              "#4b4030",

              fontWeight:600,
              cursor:"pointer",
            }}
          >
            {section.title}
          </button>
        ))}

      </div>



      {/* MENU ITEMS */}

      {menuData
      .filter(section =>
        !activeCategory ||
        section.title===activeCategory
      )
      .map(section=>(

        <div key={section.title}>

          <h2
            style={{
              textAlign:"center",
              fontFamily:"serif",
              marginBottom:20,
            }}
          >
            {section.title}
          </h2>


          {section.items.map(item=>(

            <div
              key={item.name}
              style={{
                background:"#fff",
                borderRadius:18,
                padding:12,
                marginBottom:12,
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                boxShadow:
                "0 5px 20px rgba(0,0,0,.05)",
              }}
            >

              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:15,
                }}
              >

                <img
                  src={item.image || "/no-image.jpg"}
                  style={{
                    width:80,
                    height:70,
                    objectFit:"cover",
                    borderRadius:12,
                  }}
                />


                <div>

                  <div
                    style={{
                      fontSize:18,
                      fontFamily:"serif",
                      fontWeight:600,
                    }}
                  >
                    {item.name}
                  </div>


                  <div
                    style={{
                      color:"#B88A2A",
                      marginTop:6,
                      fontWeight:700,
                    }}
                  >
                    {item.price} AZN
                  </div>

                </div>

              </div>


              <button
                onClick={(e)=>addToCart(item,e)}
                style={{
                  width:38,
                  height:38,
                  borderRadius:12,
                  border:"none",
                  background:"#D4AF37",
                  color:"#fff",
                  fontSize:22,
                }}
              >
                +
              </button>


            </div>

          ))}


        </div>

      ))}


    </div>
  );
}
