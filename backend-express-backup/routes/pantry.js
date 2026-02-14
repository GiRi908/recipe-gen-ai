import express from 'express'
import PantryItem from '../models/PantryItem.js'

const router = express.Router()

// Get all pantry items for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const items = await PantryItem.find({ user: req.params.userId })
            .sort({ category: 1, name: 1 })

        // Group by category
        const grouped = items.reduce((acc, item) => {
            const category = item.category || 'other'
            if (!acc[category]) acc[category] = []
            acc[category].push(item)
            return acc
        }, {})

        res.json({ items, grouped })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Add pantry item
router.post('/', async (req, res) => {
    try {
        const item = new PantryItem(req.body)
        await item.save()
        res.status(201).json(item)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Bulk add pantry items (for AI scanner)
router.post('/bulk', async (req, res) => {
    try {
        const { items } = req.body
        const savedItems = await PantryItem.insertMany(items)
        res.status(201).json(savedItems)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Update pantry item
router.put('/:id', async (req, res) => {
    try {
        const item = await PantryItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!item) {
            return res.status(404).json({ error: 'Pantry item not found' })
        }

        res.json(item)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Delete pantry item
router.delete('/:id', async (req, res) => {
    try {
        const item = await PantryItem.findByIdAndDelete(req.params.id)

        if (!item) {
            return res.status(404).json({ error: 'Pantry item not found' })
        }

        res.json({ message: 'Pantry item deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Clear expired items
router.delete('/user/:userId/expired', async (req, res) => {
    try {
        const result = await PantryItem.deleteMany({
            user: req.params.userId,
            expiryDate: { $lt: new Date() }
        })

        res.json({
            message: 'Expired items cleared',
            deletedCount: result.deletedCount
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
