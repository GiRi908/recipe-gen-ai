import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck, ArrowLeft, Printer, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { recipeService } from '@/services/recipeService'
import { toast } from 'sonner'

export default function RecipeDetail() {
    const { id } = useParams()
    const [checkedIngredients, setCheckedIngredients] = useState({})

    const { data: recipe, isLoading, error } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => recipeService.getRecipeById(id),
    })

    const handleToggleIngredient = (index) => {
        setCheckedIngredients((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    const handleSaveRecipe = async () => {
        try {
            await recipeService.saveRecipe(id)
            toast.success('Recipe saved successfully!')
        } catch (error) {
            toast.error('Failed to save recipe')
        }
    }

    const handleUnsaveRecipe = async () => {
        try {
            await recipeService.unsaveRecipe(id)
            toast.success('Recipe removed from saved')
        } catch (error) {
            toast.error('Failed to remove recipe')
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe?.title,
                    text: recipe?.description,
                    url: window.location.href,
                })
            } catch (error) {
                // User cancelled share
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied to clipboard!')
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-8 w-32 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-96 w-full rounded-lg" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !recipe) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-destructive text-lg mb-4">Recipe not found</p>
                    <Link to="/explore">
                        <Button>Back to Explore</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link to="/explore" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recipe Image */}
                <div className="relative">
                    <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
                        {recipe.imageUrl ? (
                            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                <ChefHat className="w-24 h-24 text-primary/40" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Recipe Info */}
                <div>
                    {/* Title & Badges */}
                    <div className="mb-4">
                        <h1 className="text-4xl font-bold mb-3">{recipe.title}</h1>
                        <div className="flex gap-2 flex-wrap mb-4">
                            {recipe.cuisine && <Badge variant="outline">{recipe.cuisine}</Badge>}
                            {recipe.category && <Badge variant="outline">{recipe.category}</Badge>}
                            {recipe.difficulty && (
                                <Badge
                                    variant={
                                        recipe.difficulty === 'easy'
                                            ? 'default'
                                            : recipe.difficulty === 'medium'
                                                ? 'secondary'
                                                : 'destructive'
                                    }
                                >
                                    {recipe.difficulty}
                                </Badge>
                            )}
                            {recipe.isAIGenerated && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    AI Generated
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {recipe.description && <p className="text-muted-foreground mb-6">{recipe.description}</p>}

                    {/* Meta Info */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                {recipe.prepTime && recipe.cookTime && (
                                    <div>
                                        <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">Total Time</p>
                                        <p className="font-semibold">{recipe.prepTime + recipe.cookTime} min</p>
                                    </div>
                                )}
                                {recipe.servings && (
                                    <div>
                                        <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <p className="text-sm text-muted-foreground">Servings</p>
                                        <p className="font-semibold">{recipe.servings}</p>
                                    </div>
                                )}
                                <div>
                                    <ChefHat className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-sm text-muted-foreground">Difficulty</p>
                                    <p className="font-semibold capitalize">{recipe.difficulty || 'Medium'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button onClick={recipe.isSaved ? handleUnsaveRecipe : handleSaveRecipe} className="flex-1 gap-2">
                            {recipe.isSaved ? (
                                <>
                                    <BookmarkCheck className="w-4 h-4" />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <Bookmark className="w-4 h-4" />
                                    Save Recipe
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Ingredients & Instructions */}
            <Tabs defaultValue="ingredients" className="mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                            <ul className="space-y-3">
                                {recipe.ingredients?.map((ingredient, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id={`ingredient-${index}`}
                                            checked={checkedIngredients[index] || false}
                                            onChange={() => handleToggleIngredient(index)}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <label
                                            htmlFor={`ingredient-${index}`}
                                            className={`flex-1 cursor-pointer ${checkedIngredients[index] ? 'line-through text-muted-foreground' : ''
                                                }`}
                                        >
                                            {typeof ingredient === 'string' ? ingredient : `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="instructions" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                            <div className="space-y-4">
                                {recipe.instructions?.split('\n').map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                            {index + 1}
                                        </div>
                                        <p className="flex-1 pt-1">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Nutrition Info */}
            {recipe.nutritionInfo && (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Nutrition Information</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(recipe.nutritionInfo).map(([key, value]) => (
                                <div key={key} className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground capitalize mb-1">{key}</p>
                                    <p className="text-lg font-semibold">{value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
