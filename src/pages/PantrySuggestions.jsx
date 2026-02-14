import { useUser } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import RecipeCard from '@/components/recipe/RecipeCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { pantryService } from '@/services/pantryService'
import { aiService } from '@/services/aiService'
import { recipeService } from '@/services/recipeService'
import { toast } from 'sonner'

export default function PantrySuggestions() {
    const { user } = useUser()

    const { data: pantryItems } = useQuery({
        queryKey: ['pantry', user?.id],
        queryFn: () => pantryService.getPantryItems(user?.id),
        enabled: !!user?.id,
    })

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ['pantry-suggestions', user?.id],
        queryFn: () => aiService.getSuggestedRecipes(user?.id),
        enabled: !!user?.id,
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <Sparkles className="w-10 h-10 text-primary" />
                    Pantry-Based Suggestions
                </h1>
                <p className="text-muted-foreground">
                    Recipes you can make with ingredients from your pantry
                </p>
            </div>

            {/* Pantry Summary */}
            {pantryItems && pantryItems.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Your Pantry
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {pantryItems.slice(0, 15).map((item) => (
                                <Badge key={item.id} variant="secondary">
                                    {item.name}
                                </Badge>
                            ))}
                            {pantryItems.length > 15 && (
                                <Badge variant="outline">+{pantryItems.length - 15} more</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Suggested Recipes */}
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
            ) : suggestions && suggestions.length > 0 ? (
                <>
                    <div className="mb-4 text-sm text-muted-foreground">
                        Found {suggestions.length} recipe{suggestions.length !== 1 ? 's' : ''} matching your pantry
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {suggestions.map((recipe) => (
                            <div key={recipe.id} className="relative">
                                <RecipeCard
                                    recipe={recipe}
                                    isSaved={recipe.isSaved}
                                    onSave={handleSaveRecipe}
                                    onUnsave={handleUnsaveRecipe}
                                />
                                {recipe.matchPercentage && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <Badge className="bg-primary text-primary-foreground">
                                            {recipe.matchPercentage}% Match
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="p-12">
                    <div className="text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No suggestions yet</h3>
                        <p className="text-muted-foreground mb-6">
                            {pantryItems && pantryItems.length > 0
                                ? 'We couldn\'t find recipes matching your pantry. Try adding more ingredients!'
                                : 'Add ingredients to your pantry to get personalized recipe suggestions'}
                        </p>
                    </div>
                </Card>
            )}
        </div>
    )
}
