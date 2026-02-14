import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    subscriptionTier: {
        type: String,
        enum: ['free', 'premium', 'pro'],
        default: 'free'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String
}, {
    timestamps: true
})

export default mongoose.model('User', userSchema)
