import strapiApi from './api'

export const recipeService = {
    // Get all recipes with filters
    getRecipes: async (userId, filters = {}) => {
        const params = {
            filters: {
                userId: { $eq: userId }
            },
            populate: '*',
            pagination: {
                page: filters.page || 1,
                pageSize: filters.limit || 25
            }
        }

        // Add additional filters
        if (filters.cuisine) params.filters.cuisine = { $eq: filters.cuisine }
        if (filters.difficulty) params.filters.difficulty = { $eq: filters.difficulty }
        if (filters.search) params.filters.title = { $containsi: filters.search }

        const response = await strapiApi.get('/recipes', { params })
        // Strapi v5 returns { data: [...], meta: {...} }
        return response.data?.data || []
    },

    // Get single recipe
    getRecipeById: async (id) => {
        const response = await strapiApi.get(`/recipes/${id}`, {
            params: { populate: '*' }
        })
        return response.data?.data
    },

    // Create recipe
    createRecipe: async (recipeData, userId) => {
        const response = await strapiApi.post('/recipes', {
            data: {
                ...recipeData,
                userId
            }
        })
        return response.data?.data
    },

    // Update recipe
    updateRecipe: async (id, recipeData) => {
        const response = await strapiApi.put(`/recipes/${id}`, {
            data: recipeData
        })
        return response.data?.data
    },

    // Delete recipe
    deleteRecipe: async (id) => {
        const response = await strapiApi.delete(`/recipes/${id}`)
        return response.data?.data
    },

    // Save AI-generated recipe
    saveGeneratedRecipe: async (recipeData, userId) => {
        const response = await strapiApi.post('/recipes', {
            data: {
                ...recipeData,
                userId,
                aiGenerated: true
            }
        })
        return response.data?.data
    },
}

export default recipeService
