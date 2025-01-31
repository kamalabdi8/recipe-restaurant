import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: '', instructions: '', category_id: '' });

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/categories', { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/categories/${id}`);
      setCategories(categories.filter(category => category.id !== id));
      setRecipes(recipes.filter(recipe => recipe.category_id !== id)); // Remove related recipes
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/recipes', newRecipe);
      setRecipes([...recipes, response.data]);
      setNewRecipe({ title: '', ingredients: '', instructions: '', category_id: '' });
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/recipes/${id}`);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div className="App">
      <h1>Recipe Manager</h1>
      
      <h2>Categories</h2>
      <form onSubmit={handleAddCategory}>
        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category" required />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name || 'No Name'} {/* Make sure category.name is a string */}
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Add Recipe</h2>
      <form onSubmit={handleAddRecipe}>
        <input type="text" value={newRecipe.title} onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })} placeholder="Title" required />
        <textarea value={newRecipe.ingredients} onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })} placeholder="Ingredients" required />
        <textarea value={newRecipe.instructions} onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })} placeholder="Instructions" required />
        <select value={newRecipe.category_id} onChange={(e) => setNewRecipe({ ...newRecipe, category_id: e.target.value })} required>
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit">Add Recipe</button>
      </form>

      <h2>Recipes</h2>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <strong>{recipe.title}</strong> 
            {/* Ensure recipe.category exists before accessing recipe.category.name */}
            <p>Category: {recipe.category ? recipe.category.name : 'No Category'}</p>
            <p><em>Ingredients:</em> {recipe.ingredients}</p>
            <p><em>Instructions:</em> {recipe.instructions}</p>
            <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
