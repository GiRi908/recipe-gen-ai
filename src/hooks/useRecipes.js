import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import recipeService from '../services/recipeService'
import { toast } from 'sonner'

// Get all recipes
export function useRecipes(filters = {}) {
    return useQuery({
        queryKey: ['recipes', filters],
        queryFn: () => recipeService.getRecipes(filters),
    })
}

// Get single recipe
export function useRecipe(id) {
    return useQuery({
        queryKey: ['recipe', id],
        queryFn: () => recipeService.getRecipeById(id),
        enabled: !!id,
    })
}

// Create recipe
export function useCreateRecipe() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: recipeService.createRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] })
            toast.success('Recipe created successfully!')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to create recipe')
        },
    })
}

// Save recipe
export function useSaveRecipe() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ recipeId, userId, notes }) =>
            recipeService.saveRecipe(recipeId, userId, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-recipes'] })
            toast.success('Recipe saved to favorites!')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to save recipe')
        },
    })
}

// Unsave recipe
export function useUnsaveRecipe() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ recipeId, userId }) =>
            recipeService.unsaveRecipe(recipeId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved-recipes'] })
            toast.success('Recipe removed from favorites')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to remove recipe')
        },
    })
}
