import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

let genAI = null
let model = null

if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

export const aiService = {
    // Generate recipe from ingredients
    generateRecipe: async (ingredients, preferences = {}) => {
        if (!model) {
            throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.')
        }

        const preferencesText = []
        if (preferences.cuisine) preferencesText.push(`Cuisine: ${preferences.cuisine}`)
        if (preferences.dietary) preferencesText.push(`Dietary restrictions: ${preferences.dietary}`)
        if (preferences.cookingTime) preferencesText.push(`Maximum cooking time: ${preferences.cookingTime} minutes`)
        if (preferences.difficulty) preferencesText.push(`Difficulty level: ${preferences.difficulty}`)

        const prompt = `You are a professional chef and recipe creator. Generate a detailed recipe using the following ingredients: ${ingredients.join(', ')}.

${preferencesText.length > 0 ? `Preferences:\n${preferencesText.join('\n')}` : ''}

Respond ONLY with a valid JSON object in this exact format (no markdown, no code fences, just raw JSON):
{
    "title": "Recipe Name",
    "description": "A brief description of the dish",
    "cuisine": "Type of cuisine",
    "difficulty": "easy/medium/hard",
    "prepTime": 10,
    "cookTime": 20,
    "servings": 4,
    "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
    "instructions": "Step 1: Do this.\\nStep 2: Do that.\\nStep 3: Continue here.",
    "tips": "Any helpful cooking tips"
}`

        // Retry logic for rate limiting
        const maxRetries = 3
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await model.generateContent(prompt)
                const response = await result.response
                const text = response.text()

                // Clean up the response - remove any markdown code fences if present
                const cleanedText = text
                    .replace(/```json\s*/gi, '')
                    .replace(/```\s*/gi, '')
                    .trim()

                const recipe = JSON.parse(cleanedText)
                return recipe
            } catch (error) {
                console.error(`AI Generation Error (attempt ${attempt + 1}):`, error)

                // Check if it's a rate limit error (429)
                const isRateLimit = error.message?.includes('429') || error.message?.includes('quota')

                if (isRateLimit && attempt < maxRetries) {
                    // Exponential backoff: 3s, 6s, 12s
                    const delay = 3000 * Math.pow(2, attempt)
                    console.log(`Rate limited. Retrying in ${delay / 1000}s...`)
                    await new Promise(resolve => setTimeout(resolve, delay))
                    continue
                }

                if (isRateLimit) {
                    throw new Error('AI quota exceeded. Your daily free tier limit has been reached. Please try again later or use a new API key from Google AI Studio (https://aistudio.google.com/apikey).')
                }
                if (error instanceof SyntaxError) {
                    throw new Error('Failed to parse AI response. Please try again.')
                }
                throw new Error(error.message || 'Failed to generate recipe. Please try again.')
            }
        }
    },

    // Get recipe suggestions based on pantry items
    getSuggestedRecipes: async (pantryItems) => {
        if (!model) {
            throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.')
        }

        const ingredientNames = pantryItems.map(item => item.name).join(', ')

        const prompt = `You are a professional chef. Based on these available ingredients: ${ingredientNames}

Suggest 3 different recipes that can be made with some or all of these ingredients. For each recipe, provide a brief overview.

Respond ONLY with a valid JSON array (no markdown, no code fences, just raw JSON):
[
    {
        "title": "Recipe Name",
        "description": "Brief description",
        "difficulty": "easy/medium/hard",
        "estimatedTime": "30 min",
        "usedIngredients": ["ingredient1", "ingredient2"]
    }
]`

        try {
            const result = await model.generateContent(prompt)
            const response = await result.response
            const text = response.text()

            const cleanedText = text
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/gi, '')
                .trim()

            return JSON.parse(cleanedText)
        } catch (error) {
            console.error('AI Suggestions Error:', error)
            throw new Error('Failed to get recipe suggestions. Please try again.')
        }
    },
}

export default aiService
