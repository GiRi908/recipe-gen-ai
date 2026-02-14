import mongoose from 'mongoose'

const savedRecipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    notes: String,
    savedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Compound index to prevent duplicate saves
savedRecipeSchema.index({ user: 1, recipe: 1 }, { unique: true })

export default mongoose.model('SavedRecipe', savedRecipeSchema)
