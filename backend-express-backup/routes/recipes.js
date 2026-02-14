import express from 'express'
import Recipe from '../models/Recipe.js'
import SavedRecipe from '../models/SavedRecipe.js'

const router = express.Router()

// Get all recipes with filters
router.get('/', async (req, res) => {
    try {
        const { cuisine, category, difficulty, search, limit = 20, page = 1 } = req.query

        const query = {}
        if (cuisine) query.cuisine = cuisine
        if (category) query.category = category
        if (difficulty) query.difficulty = difficulty
        if (search) {
            query.$text = { $search: search }
        }

        const skip = (page - 1) * limit
        const recipes = await Recipe.find(query)
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'firstName lastName')

        const total = await Recipe.countDocuments(query)

        res.json({
            recipes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get single recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('createdBy', 'firstName lastName')

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' })
        }

        res.json(recipe)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Create new recipe
router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe(req.body)
        await recipe.save()
        res.status(201).json(recipe)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Update recipe
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' })
        }

        res.json(recipe)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Delete recipe
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id)

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' })
        }

        res.json({ message: 'Recipe deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Save recipe to user's favorites
router.post('/:id/save', async (req, res) => {
    try {
        const { userId } = req.body

        const savedRecipe = new SavedRecipe({
            user: userId,
            recipe: req.params.id,
            notes: req.body.notes
        })

        await savedRecipe.save()
        res.status(201).json(savedRecipe)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Recipe already saved' })
        }
        res.status(400).json({ error: error.message })
    }
})

// Unsave recipe
router.delete('/:id/save', async (req, res) => {
    try {
        const { userId } = req.body

        const result = await SavedRecipe.findOneAndDelete({
            user: userId,
            recipe: req.params.id
        })

        if (!result) {
            return res.status(404).json({ error: 'Saved recipe not found' })
        }

        res.json({ message: 'Recipe unsaved successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
