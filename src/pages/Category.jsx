import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import RecipeCard from '@/components/recipe/RecipeCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { recipeService } from '@/services/recipeService'
import { toast } from 'sonner'

export default function Category() {
    const { slug } = useParams()

    const { data: recipes, isLoading, error } = useQuery({
        queryKey: ['recipes', 'category', slug],
        queryFn: () => recipeService.getRecipes({ category: slug }),
    })

    const handleSaveRecipe = async (recipeId) => {
        try {
            await recipeService.saveRecipe(recipeId)
            toast.success('Recipe saved successfully!')
        } catch (error) {
            toast.error('Failed to save recipe')
        }
    }

    const handleUnsaveRecipe = async (recipeId) => {
        try {
            await recipeService.unsaveRecipe(recipeId)
            toast.success('Recipe removed from saved')
        } catch (error) {
            toast.error('Failed to remove recipe')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link to="/explore" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 capitalize">{slug?.replace('-', ' ')} Recipes</h1>
                <p className="text-muted-foreground">Explore our collection of {slug} recipes</p>
            </div>

            {/* Results */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive">Failed to load recipes. Please try again later.</p>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : recipes && recipes.length > 0 ? (
                <>
                    <div className="mb-4 text-sm text-muted-foreground">
                        Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                isSaved={recipe.isSaved}
                                onSave={handleSaveRecipe}
                                onUnsave={handleUnsaveRecipe}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg mb-2">No recipes found in this category</p>
                    <Link to="/explore">
                        <Button>Explore All Recipes</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
