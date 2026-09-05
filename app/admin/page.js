"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase";

export default function AdminPage() {
  const ADMIN_PASSWORD = "edik6762";

  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");

  const [menuData, setMenuData] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState(null);

  const router = useRouter();

  // LOGIN CHECK
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") setIsAuth(true);
  }, []);

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem("adminAuth");
    router.push("/");
  };

  // LOAD MENU
  useEffect(() => {
    if (!isAuth) return;

    const loadMenu = async () => {
      const { data } = await supabase
  .from("menu")
  .select("*")
  .order("id", { ascending: true });

      const grouped = {};

      data?.forEach((item) => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }

       grouped[item.category].push({
  name: item.name,
  price: item.price,
  available: item.available,
  recommended: item.recommended,
  image: item.image,
});
      });

      const formatted = Object.keys(grouped).map((cat) => ({
        title: cat,
        items: grouped[cat],
      }));

      setMenuData(formatted);
    };

    loadMenu();
  }, [isAuth]);

  // CATEGORY
  const addCategory = () => {
    if (!newCategory.trim()) return;

    setMenuData((prev) => [
      ...prev,
      { title: newCategory, items: [] },
    ]);

    setNewCategory("");
  };

  const deleteCategory = (title) => {
    setMenuData((prev) => prev.filter((c) => c.title !== title));
  };

  const renameCategory = (oldTitle, newTitle) => {
    setMenuData((prev) =>
      prev.map((c) =>
        c.title === oldTitle ? { ...c, title: newTitle } : c
      )
    );
  };

  const moveCategory = (fromIndex, toIndex) => {
    setMenuData((prev) => {
      const copy = [...prev];
      const item = copy.splice(fromIndex, 1)[0];
      copy.splice(toIndex, 0, item);
      return copy;
    });
  };

  const compressImage = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");

    img.onload = () => {
      const maxWidth = 800;
      const scale = Math.min(maxWidth / img.width, 1);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => {
          resolve(
            new File(
              [blob],
              file.name,
              {
                type: "image/jpeg",
              }
            )
          );
        },
        "image/jpeg",
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
};
  const uploadImage = async (file) => {
  if (!file) return "";

  file = await compressImage(file);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file);

  if (error) {
    console.log(error);
    alert("Ошибка загрузки фото");
    return "";
  }

  const { data } = supabase.storage
    .from("menu-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
};
  const deleteImage = async (imageUrl) => {
    console.log("deleteImage получил:", imageUrl);
  if (!imageUrl) {
    console.log("Нет ссылки на фото");
    return;
  }

  const parts = imageUrl.split("/menu-images/");

  if (parts.length < 2) {
    console.log("Не удалось получить путь файла");
    return;
  }

  const filePath = parts[1];

  console.log("Пытаемся удалить:", filePath);

  const { data, error } = await supabase.storage
    .from("menu-images")
    .remove([filePath]);

  console.log("Ответ Supabase:", data, error);

  if (error) {
    console.log("Ошибка удаления:", error);
  } else {
    console.log("Удаление успешно");
  }
};
  const updateItemImage = async (section, name, file) => {
  if (!file) return;

  // ищем старое фото
  const oldImage = menuData
    .find((c) => c.title === section)
    ?.items.find((i) => i.name === name)
    ?.image;

  // загружаем новое фото
  const newImageUrl = await uploadImage(file);

  if (!newImageUrl) return;

  // удаляем старое фото
  if (oldImage) {
    await deleteImage(oldImage);
  }

  // меняем ссылку на новое фото
  setMenuData((prev) =>
    prev.map((c) =>
      c.title === section
        ? {
            ...c,
            items: c.items.map((i) =>
              i.name === name
                ? { ...i, image: newImageUrl }
                : i
            ),
          }
        : c
    )
  );
};


const removeItemImage = async (section, name) => {
  const item = menuData
    .find((c) => c.title === section)
    ?.items.find((i) => i.name === name);

  if (item?.image) {
    await deleteImage(item.image);
  }

  setMenuData((prev) =>
    prev.map((c) =>
      c.title === section
        ? {
            ...c,
            items: c.items.map((i) =>
              i.name === name
                ? { ...i, image: "" }
                : i
            ),
          }
        : c
    )
  );
};
  
  // ITEMS
  const addItem = async () => {
    if (!selectedSection || !newItemName || !newItemPrice) return;
    const imageUrl = await uploadImage(newItemImage);
    console.log("IMAGE URL:", imageUrl);

    setMenuData((prev) =>
      prev.map((c) =>
        c.title === selectedSection
          ? {
              ...c,
              items: [
                ...c.items,
{
  id: null,
  name: newItemName,
  price: Number(newItemPrice),
  image: "",
  imageFile: newItemImage,
  available: true,
  recommended: false,
}
              ],
            }
          : c
      )
    );

    setNewItemName("");
    setNewItemPrice("");
  };

  const updateItem = (section, oldName, field, value) => {
    setMenuData((prev) =>
      prev.map((c) =>
        c.title === section
          ? {
              ...c,
              items: c.items.map((i) =>
                i.name === oldName ? { ...i, [field]: value } : i
              ),
            }
          : c
      )
    );
  };

  const deleteItem = async (section, name) => {
  const itemToDelete = menuData
    .find((c) => c.title === section)
    ?.items.find((i) => i.name === name);

  console.log("Удаляемое блюдо:", itemToDelete);

if (itemToDelete?.image) {
  console.log("Ссылка фото:", itemToDelete.image);
  await deleteImage(itemToDelete.image);
} else {
  console.log("У блюда нет image");
}

  setMenuData((prev) =>
    prev.map((c) =>
      c.title === section
        ? {
            ...c,
            items: c.items.filter((i) => i.name !== name),
          }
        : c
    )
  );
};
  const toggleItem = (section, name) => {
    setMenuData((prev) =>
      prev.map((c) =>
        c.title === section
          ? {
              ...c,
              items: c.items.map((i) =>
                i.name === name
                  ? { ...i, available: !i.available }
                  : i
              ),
            }
          : c
      )
    );
  };
  
const toggleRecommended = (section, name) => {
  setMenuData((prev) =>
    prev.map((c) =>
      c.title === section
        ? {
            ...c,
            items: c.items.map((i) => ({
              ...i,
              recommended:
                i.name === name
                  ? !i.recommended
                  : false,
            })),
          }
        : c
    )
  );
};
  // SAVE
 const uploadMenuToSupabase = async () => {
  const dishes = [];

  menuData.forEach((section) => {
    section.items.forEach((item) => {
      dishes.push({
        name: item.name,
        price: item.price,
        category: section.title,
        available: item.available,
        recommended: item.recommended,
        image: item.image || "",
      });
    });
  });

  await supabase.from("menu").delete().neq("id", 0);
  await supabase.from("menu").insert(dishes);

  alert("Меню обновлено!");
};

  // LOGIN SCREEN
  if (!isAuth) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setIsAuth(true);
              localStorage.setItem("adminAuth", "true");
            } else {
              alert("Wrong password");
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  // PANEL
  return (
    <div style={{ padding: 20 }}>
      <h1>ADMIN PANEL</h1>

     <button 
  onClick={() => {
    console.log("КНОПКА НАЖАТА");
    uploadMenuToSupabase();
  }}
>
  Загрузить в Supabase
</button>

      <button onClick={logout}>Выход</button>

      <hr />

      <h3>Add Category</h3>
      <input
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={addCategory}>Add</button>

      <hr />

      <h3>Add Item</h3>

      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
      >
        <option value="">Select category</option>
        {menuData.map((c) => (
          <option key={c.title} value={c.title}>
            {c.title}
          </option>
        ))}
      </select>

      <input
        placeholder="Name"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
      />

      <input
        placeholder="Price"
        type="number"
        value={newItemPrice}
        onChange={(e) => setNewItemPrice(e.target.value)}
      />

          <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setNewItemImage(e.target.files[0])
  }
/>
    
      <button onClick={addItem}>Add Item</button>

      <hr />

      {menuData.map((section, index) => (
        <div key={section.title} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={section.title}
              onChange={(e) =>
                renameCategory(section.title, e.target.value)
              }
            />

            <button onClick={() => deleteCategory(section.title)}>
              ❌
            </button>

            <button onClick={() => moveCategory(index, 0)}>
              Top
            </button>

            <button
              onClick={() => moveCategory(index, index - 1)}
            >
              ⬆️
            </button>

            <button
              onClick={() => moveCategory(index, index + 1)}
            >
              ⬇️
            </button>
          </div>

          {section.items.map((item) => (
  <div key={item.name} style={{ display: "flex", gap: 10 }}>

    {item.image && (
      <img
        src={item.image}
        width="60"
        height="60"
        style={{
          objectFit: "cover",
          borderRadius: "8px"
        }}
      />
    )}

              <input
                style={{ width: "140px" }}
                value={item.name}
                onChange={(e) =>
                  updateItem(section.title, item.name, "name", e.target.value)
                }
              />

              <input
                style={{ width: "70px" }}
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(section.title, item.name, "price", Number(e.target.value))
                }
              />
                  <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    updateItemImage(
      section.title,
      item.name,
      e.target.files[0]
    )
  }
/>

{item.image && (
  <button
    onClick={() =>
      removeItemImage(section.title, item.name)
    }
  >
    🗑️ Фото
  </button>
)}

              <button
                onClick={() => toggleItem(section.title, item.name)}
              >
                {item.available ? "🚫" : "✅"}
              </button>
<button
  onClick={() =>
    toggleRecommended(section.title, item.name)
  }
>
  {item.recommended ? "⭐" : "☆"}
</button>
              <button
                onClick={() => deleteItem(section.title, item.name)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
