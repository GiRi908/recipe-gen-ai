import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Create or update user from Clerk webhook
router.post('/sync', async (req, res) => {
    try {
        const { clerkId, email, firstName, lastName } = req.body

        let user = await User.findOne({ clerkId })

        if (user) {
            // Update existing user
            user.email = email
            user.firstName = firstName
            user.lastName = lastName
            await user.save()
        } else {
            // Create new user
            user = new User({
                clerkId,
                email,
                firstName,
                lastName
            })
            await user.save()
        }

        res.json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Get user by Clerk ID
router.get('/clerk/:clerkId', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update user subscription
router.put('/:id/subscription', async (req, res) => {
    try {
        const { subscriptionTier, subscriptionStatus, stripeCustomerId, stripeSubscriptionId } = req.body

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { subscriptionTier, subscriptionStatus, stripeCustomerId, stripeSubscriptionId },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Get user's saved recipes
router.get('/:id/saved-recipes', async (req, res) => {
    try {
        const SavedRecipe = (await import('../models/SavedRecipe.js')).default

        const savedRecipes = await SavedRecipe.find({ user: req.params.id })
            .populate('recipe')
            .sort({ savedAt: -1 })

        res.json(savedRecipes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
