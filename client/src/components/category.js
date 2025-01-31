import React, { useState, useEffect } from "react";
import axios from "axios";

function Category() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data); 
      } catch (err) {
        setError("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (err) {
      setError("Error deleting category");
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name || "No Name"}
            <button onClick={() => handleDelete(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
