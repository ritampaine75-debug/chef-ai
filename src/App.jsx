import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateRecipe } from './services/aiService';
import { theme } from './theme/colors';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCook = async () => {
    if (!ingredients.trim()) return;
    
    setLoading(true);
    setRecipe(''); // Clear previous recipe
    
    try {
      const result = await generateRecipe(ingredients);
      setRecipe(result);
    } catch (error) {
      setRecipe(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: theme.primary, textAlign: 'center' }}>👨‍🍳 Chef AI</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Enter your ingredients below:
      </p>

      <textarea
        rows="4"
        placeholder="e.g. Eggs, milk, cheese, bread..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <button onClick={handleCook} disabled={loading || !ingredients}>
        {loading ? 'Cooking...' : 'Create Recipe'}
      </button>

      {recipe && (
        <div className="recipe-output">
          <ReactMarkdown>{recipe}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default App;
