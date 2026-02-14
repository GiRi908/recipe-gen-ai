import mongoose from 'mongoose'

const pantryItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: String,
    unit: String,
    category: {
        type: String,
        enum: ['vegetables', 'fruits', 'meat', 'dairy', 'grains', 'spices', 'condiments', 'other'],
        default: 'other'
    },
    expiryDate: Date,
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Index for efficient user queries
pantryItemSchema.index({ user: 1, category: 1 })

export default mongoose.model('PantryItem', pantryItemSchema)
