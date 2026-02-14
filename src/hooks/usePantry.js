import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import pantryService from '../services/pantryService'
import { toast } from 'sonner'

// Get pantry items
export function usePantryItems(userId) {
    return useQuery({
        queryKey: ['pantry', userId],
        queryFn: () => pantryService.getPantryItems(userId),
        enabled: !!userId,
    })
}

// Add pantry item
export function useAddPantryItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: pantryService.addPantryItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] })
            toast.success('Item added to pantry!')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to add item')
        },
    })
}

// Bulk add pantry items
export function useBulkAddPantryItems() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: pantryService.bulkAddPantryItems,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] })
            toast.success(`${data.length} items added to pantry!`)
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to add items')
        },
    })
}

// Update pantry item
export function useUpdatePantryItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => pantryService.updatePantryItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] })
            toast.success('Item updated!')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update item')
        },
    })
}

// Delete pantry item
export function useDeletePantryItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: pantryService.deletePantryItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] })
            toast.success('Item removed from pantry')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to remove item')
        },
    })
}

// Clear expired items
export function useClearExpiredItems() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: pantryService.clearExpiredItems,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['pantry'] })
            toast.success(`${data.deletedCount} expired items cleared`)
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to clear items')
        },
    })
}
