// We access the key securely via Environment Variables
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateRecipe = async (ingredients) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check Vercel settings.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://chef-ai.vercel.app", 
      "X-Title": "Chef AI Mobile"
    },
    body: JSON.stringify({
      "model": "tngtech/deepseek-r1t-chimera:free",
      "messages": [
        {
          "role": "system",
          "content": "You are a professional chef. Create a detailed recipe using the provided ingredients. Include a Title, Ingredients list, and Instructions. Use Markdown formatting."
        },
        {
          "role": "user",
          "content": `I have these ingredients: ${ingredients}. Create a recipe.`
        }
      ]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.choices[0].message.content;
};
