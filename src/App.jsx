import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateRecipe, getDishImage } from './services/aiService';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setRecipe('');
    setImageUrl('');
    
    try {
      // 1. Generate Text
      const textResult = await generateRecipe(ingredients);
      setRecipe(textResult);

      // 2. Extract Title for Image
      // Looks for first line starting with #
      const titleMatch = textResult.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        const image = getDishImage(titleMatch[1]);
        setImageUrl(image);
      }
    } catch (error) {
      setRecipe(`**Error:** ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="brand">CULINARA</h1>
        <div className="subtitle">Artificial Intelligence Gastronomy</div>
      </header>

      <div className="input-wrapper">
        <textarea
          rows="3"
          placeholder="Enter available ingredients (e.g., Truffle oil, wild mushrooms, arborio rice...)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button 
          className="generate-btn"
          onClick={handleCreate}
          disabled={loading || !ingredients}
        >
          {loading ? 'Curating Experience...' : 'Design Menu'}
        </button>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}

      {recipe && (
        <div className="recipe-card">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Generated Dish" 
              className="dish-image"
              onError={(e) => e.target.style.display = 'none'} // Hide if fails
            />
          )}
          <div className="recipe-content">
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
