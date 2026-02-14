import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        name: String,
        quantity: String,
        unit: String
    }],
    instructions: {
        type: String,
        required: true
    },
    prepTime: Number, // in minutes
    cookTime: Number, // in minutes
    servings: Number,
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    cuisine: String,
    category: String,
    imageUrl: String,
    nutritionInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        fiber: Number
    },
    isAIGenerated: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [String]
}, {
    timestamps: true
})

// Indexes for better query performance
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' })
recipeSchema.index({ cuisine: 1, category: 1 })
recipeSchema.index({ difficulty: 1 })

export default mongoose.model('Recipe', recipeSchema)
