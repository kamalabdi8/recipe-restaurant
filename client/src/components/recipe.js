import React, { useState, useEffect } from "react";

function Recipe() {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({ name: "", category_id: "", ingredients: "" });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipeRes = await fetch("http://localhost:5000/recipes");
        const recipeData = await recipeRes.json();
        setRecipes(recipeData);

        const categoryRes = await fetch("http://localhost:5000/categories");
        const categoryData = await categoryRes.json();
        setCategories(categoryData);
      } catch (err) {
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ingredients: formData.ingredients.split(",").map((item) => ({ name: item.trim() })), // Convert ingredients to array
        }),
      });
      const newRecipe = await response.json();
      setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
    } catch (error) {
      console.error("Error:", error);
      setError("Error adding recipe");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/recipes/${id}`, { method: "DELETE" });
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error:", error);
      setError("Error deleting recipe");
    }
  };

  return (
    <div>
      <h1>Recipe Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Recipe name"
        />
        <select name="category_id" value={formData.category_id} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma-separated)"
        ></textarea>
        <button type="submit">Add Recipe</button>
      </form>

      <h2>Recipe List</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.name}</h3>
            <p>Category: {recipe.category || "No Category"}</p>
            <p>Ingredients: {recipe.ingredients.map((ing) => ing.name).join(", ") || "No Ingredients"}</p>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Recipe;
