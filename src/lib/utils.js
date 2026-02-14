import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

/**
 * Debounce function for search and input
 */
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Calculate match percentage between pantry items and recipe ingredients
 */
export function matchPantryToRecipe(pantryItems, recipeIngredients) {
    if (!pantryItems?.length || !recipeIngredients?.length) return 0

    const pantryNames = pantryItems.map(item => item.name.toLowerCase())
    const matches = recipeIngredients.filter(ingredient =>
        pantryNames.some(pantryItem =>
            ingredient.name.toLowerCase().includes(pantryItem) ||
            pantryItem.includes(ingredient.name.toLowerCase())
        )
    )

    return Math.round((matches.length / recipeIngredients.length) * 100)
}

/**
 * Format cooking time
 */
export function formatCookingTime(minutes) {
    if (!minutes) return ''
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

/**
 * Get difficulty badge color
 */
export function getDifficultyColor(difficulty) {
    const colors = {
        easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return colors[difficulty?.toLowerCase()] || colors.medium
}
