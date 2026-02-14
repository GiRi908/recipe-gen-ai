import { useQuery, useMutation } from '@tanstack/react-query'
import aiService from '../services/aiService'
import { toast } from 'sonner'

// Generate recipe
export function useGenerateRecipe() {
    return useMutation({
        mutationFn: ({ ingredients, preferences }) =>
            aiService.generateRecipe(ingredients, preferences),
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to generate recipe')
        },
    })
}

// Scan pantry image
export function useScanPantryImage() {
    return useMutation({
        mutationFn: aiService.scanPantryImage,
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to scan image')
        },
    })
}

// Get recipe suggestions
export function useRecipeSuggestions(userId) {
    return useQuery({
        queryKey: ['suggestions', userId],
        queryFn: () => aiService.getSuggestedRecipes(userId),
        enabled: !!userId,
    })
}
