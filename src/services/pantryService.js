import strapiApi from './api'

export const pantryService = {
    // Get all pantry items for a user
    getPantryItems: async (userId) => {
        const response = await strapiApi.get('/pantry-items', {
            params: {
                filters: {
                    userId: { $eq: userId }
                },
                populate: '*',
                sort: ['name:asc']
            }
        })
        // Strapi v5 returns { data: [...], meta: {...} }
        return response.data?.data || []
    },

    // Add pantry item
    addPantryItem: async (itemData, userId) => {
        const response = await strapiApi.post('/pantry-items', {
            data: {
                ...itemData,
                userId
            }
        })
        return response.data?.data
    },

    // Update pantry item
    updatePantryItem: async (id, itemData) => {
        const response = await strapiApi.put(`/pantry-items/${id}`, {
            data: itemData
        })
        return response.data?.data
    },

    // Delete pantry item
    deletePantryItem: async (id) => {
        const response = await strapiApi.delete(`/pantry-items/${id}`)
        return response.data?.data
    },
}

export default pantryService
