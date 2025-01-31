import React, { useState, useEffect } from "react";
import Category from "./category";

function Ingredient() {
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/ingredients")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ingredients");
        return res.json();
      })
      .then((data) => setIngredients(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="loading">Error: {error}</p>;
  }

  console.log(ingredients)

  return (
    <div>
      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            <p>{ingredient.name}</p>
            {ingredient.image && <img src={ingredient.image} alt={ingredient.name} width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ingredient;
