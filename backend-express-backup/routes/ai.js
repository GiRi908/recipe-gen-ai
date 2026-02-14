import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Recipe from '../models/Recipe.js'
import PantryItem from '../models/PantryItem.js'
import multer from 'multer'

const router = express.Router()

// Configure multer for image uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

// Initialize Gemini AI
let genAI
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

// Generate recipe from pantry items
router.post('/generate-recipe', async (req, res) => {
    try {
        if (!genAI) {
            return res.status(503).json({ error: 'AI service not configured. Please add GEMINI_API_KEY to environment variables.' })
        }

        const { ingredients, preferences } = req.body

        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ error: 'Please provide at least one ingredient' })
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const prompt = `Create a detailed recipe using the following ingredients: ${ingredients.join(', ')}.

${preferences?.cuisine ? `Cuisine: ${preferences.cuisine}` : ''}
${preferences?.difficulty ? `Difficulty: ${preferences.difficulty}` : ''}
${preferences?.cookingTime ? `Maximum cooking time: ${preferences.cookingTime} minutes` : ''}
${preferences?.dietary ? `Dietary restrictions: ${preferences.dietary.join(', ')}` : ''}

Please provide the recipe in the following JSON format:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount", "unit": "unit"}
  ],
  "instructions": "Step-by-step instructions",
  "prepTime": number (in minutes),
  "cookTime": number (in minutes),
  "servings": number,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine type",
  "category": "category",
  "nutritionInfo": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "tags": ["tag1", "tag2"]
}

Make sure the recipe is creative, delicious, and uses the provided ingredients as the main components.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            return res.status(500).json({ error: 'Failed to parse AI response' })
        }

        const recipeData = JSON.parse(jsonMatch[0])
        recipeData.isAIGenerated = true

        res.json(recipeData)
    } catch (error) {
        console.error('AI Generation Error:', error)
        res.status(500).json({ error: error.message })
    }
})

// Scan pantry image with AI
router.post('/scan-pantry', upload.single('image'), async (req, res) => {
    try {
        if (!genAI) {
            return res.status(503).json({ error: 'AI service not configured. Please add GEMINI_API_KEY to environment variables.' })
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an image' })
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const imageParts = [{
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
            }
        }]

        const prompt = `Analyze this image and identify all food items, ingredients, or pantry items visible. 
    
    Return the results in the following JSON format:
    {
      "items": [
        {
          "name": "item name",
          "category": "vegetables|fruits|meat|dairy|grains|spices|condiments|other",
          "confidence": "high|medium|low"
        }
      ]
    }
    
    Only include items you can clearly identify. Be specific with names (e.g., "red bell pepper" instead of just "pepper").`

        const result = await model.generateContent([prompt, ...imageParts])
        const response = await result.response
        const text = response.text()

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            return res.status(500).json({ error: 'Failed to parse AI response' })
        }

        const scannedData = JSON.parse(jsonMatch[0])
        res.json(scannedData)
    } catch (error) {
        console.error('AI Scan Error:', error)
        res.status(500).json({ error: error.message })
    }
})

// Get recipe suggestions based on pantry
router.get('/suggestions/:userId', async (req, res) => {
    try {
        // Get user's pantry items
        const pantryItems = await PantryItem.find({ user: req.params.userId })
        const pantryNames = pantryItems.map(item => item.name.toLowerCase())

        // Get all recipes
        const recipes = await Recipe.find()

        // Calculate match percentage for each recipe
        const recipesWithMatch = recipes.map(recipe => {
            const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase())
            const matches = recipeIngredients.filter(ing =>
                pantryNames.some(pantry =>
                    ing.includes(pantry) || pantry.includes(ing)
                )
            )

            const matchPercentage = Math.round((matches.length / recipeIngredients.length) * 100)
            const missingIngredients = recipeIngredients.filter(ing =>
                !pantryNames.some(pantry => ing.includes(pantry) || pantry.includes(ing))
            )

            return {
                ...recipe.toObject(),
                matchPercentage,
                missingIngredients,
                matchedIngredients: matches.length
            }
        })

        // Sort by match percentage
        recipesWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage)

        // Filter recipes with at least 30% match
        const suggestions = recipesWithMatch.filter(r => r.matchPercentage >= 30)

        res.json(suggestions)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
