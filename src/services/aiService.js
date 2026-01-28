const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateRecipe = async (ingredients) => {
  if (!API_KEY) throw new Error("API Key missing");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://chef-ai.vercel.app",
      "X-Title": "Culinara Premium"
    },
    body: JSON.stringify({
      "model": "tngtech/deepseek-r1t-chimera:free",
      "messages": [
        {
          "role": "system",
          "content": "You are a world-renowned Michelin Star Chef. Create a sophisticated, high-end recipe. The output must be valid Markdown. The first line must be the Title of the dish starting with '# '. Do not use emojis. Use professional culinary terminology. Structure: Title, Brief Description, Ingredients, Method, Plating."
        },
        {
          "role": "user",
          "content": `Create a gourmet recipe using: ${ingredients}`
        }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  return data.choices[0].message.content;
};

// Generates a high-quality AI image URL based on the dish title
export const getDishImage = (title) => {
  const cleanTitle = title.replace(/#/g, '').trim();
  const prompt = encodeURIComponent(`professional food photography of ${cleanTitle}, michelin star plating, dramatic lighting, 8k resolution, cinematic`);
  // Using Pollinations.ai for instant free AI image generation
  return `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=600&nologo=true&seed=${Math.random()}`;
};
