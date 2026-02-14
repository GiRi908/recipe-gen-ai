import api from './api'

export const userService = {
    // Sync user with backend (called after Clerk auth)
    syncUser: async (clerkId, email, firstName, lastName) => {
        const response = await api.post('/users/sync', {
            clerkId,
            email,
            firstName,
            lastName
        })
        return response.data
    },

    // Get user by Clerk ID
    getUserByClerkId: async (clerkId) => {
        const response = await api.get(`/users/clerk/${clerkId}`)
        return response.data
    },

    // Update user subscription
    updateSubscription: async (userId, subscriptionData) => {
        const response = await api.put(`/users/${userId}/subscription`, subscriptionData)
        return response.data
    },

    // Get user's saved recipes
    getSavedRecipes: async (userId) => {
        const response = await api.get(`/users/${userId}/saved-recipes`)
        return response.data
    },
}

export default userService
