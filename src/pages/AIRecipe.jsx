import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Sparkles, ChefHat, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { pantryService } from '@/services/pantryService'
import { aiService } from '@/services/aiService'
import { recipeService } from '@/services/recipeService'
import { toast } from 'sonner'

export default function AIRecipe() {
    const { user } = useUser()
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [preferences, setPreferences] = useState({
        cuisine: '',
        dietary: '',
        cookingTime: '',
        difficulty: '',
    })
    const [generatedRecipe, setGeneratedRecipe] = useState(null)

    const { data: pantryItems, isLoading: loadingPantry } = useQuery({
        queryKey: ['pantry', user?.id],
        queryFn: () => pantryService.getPantryItems(user?.id),
        enabled: !!user?.id,
    })

    const generateRecipeMutation = useMutation({
        mutationFn: (data) => aiService.generateRecipe(data.ingredients, data.preferences),
        onSuccess: (data) => {
            setGeneratedRecipe(data)
            toast.success('Recipe generated successfully!')
        },
        onError: () => {
            toast.error('Failed to generate recipe. Please try again.')
        },
    })

    const saveRecipeMutation = useMutation({
        mutationFn: (recipe) => recipeService.saveGeneratedRecipe(recipe),
        onSuccess: () => {
            toast.success('Recipe saved to your collection!')
        },
        onError: () => {
            toast.error('Failed to save recipe')
        },
    })

    const handleToggleIngredient = (itemId) => {
        setSelectedIngredients((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        )
    }

    const handleGenerate = () => {
        if (selectedIngredients.length === 0) {
            toast.error('Please select at least one ingredient')
            return
        }

        const ingredients = pantryItems
            .filter((item) => selectedIngredients.includes(item.id))
            .map((item) => item.name)

        generateRecipeMutation.mutate({ ingredients, preferences })
    }

    const handleSaveRecipe = () => {
        if (generatedRecipe) {
            saveRecipeMutation.mutate(generatedRecipe)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <Sparkles className="w-10 h-10 text-primary" />
                    AI Recipe Generator
                </h1>
                <p className="text-muted-foreground">
                    Select ingredients from your pantry and let AI create a personalized recipe for you
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Ingredients & Preferences */}
                <div className="space-y-6">
                    {/* Pantry Ingredients */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Ingredients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingPantry ? (
                                <p className="text-muted-foreground">Loading pantry items...</p>
                            ) : pantryItems && pantryItems.length > 0 ? (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {pantryItems.map((item) => (
                                        <label
                                            key={item.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedIngredients.includes(item.id)}
                                                onChange={() => handleToggleIngredient(item.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.quantity} {item.unit}
                                                </p>
                                            </div>
                                            {item.category && <Badge variant="outline">{item.category}</Badge>}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">Your pantry is empty</p>
                                    <Button onClick={() => (window.location.href = '/pantry')}>Add Ingredients</Button>
                                </div>
                            )}
                            {selectedIngredients.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm font-medium mb-2">Selected: {selectedIngredients.length} ingredients</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Cuisine</label>
                                <Select value={preferences.cuisine || 'any'} onValueChange={(value) => setPreferences({ ...preferences, cuisine: value === 'any' ? '' : value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any cuisine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any cuisine</SelectItem>
                                        <SelectItem value="italian">Italian</SelectItem>
                                        <SelectItem value="chinese">Chinese</SelectItem>
                                        <SelectItem value="indian">Indian</SelectItem>
                                        <SelectItem value="mexican">Mexican</SelectItem>
                                        <SelectItem value="japanese">Japanese</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Dietary Restrictions</label>
                                <Select value={preferences.dietary || 'none'} onValueChange={(value) => setPreferences({ ...preferences, dietary: value === 'none' ? '' : value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                        <SelectItem value="vegan">Vegan</SelectItem>
                                        <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                                        <SelectItem value="dairy-free">Dairy-Free</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Cooking Time</label>
                                <Select value={preferences.cookingTime || 'any'} onValueChange={(value) => setPreferences({ ...preferences, cookingTime: value === 'any' ? '' : value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any time</SelectItem>
                                        <SelectItem value="15">Under 15 min</SelectItem>
                                        <SelectItem value="30">Under 30 min</SelectItem>
                                        <SelectItem value="60">Under 1 hour</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
                                <Select value={preferences.difficulty || 'any'} onValueChange={(value) => setPreferences({ ...preferences, difficulty: value === 'any' ? '' : value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any level</SelectItem>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={selectedIngredients.length === 0 || generateRecipeMutation.isPending}
                        className="w-full h-12 text-base gap-2"
                        size="lg"
                    >
                        {generateRecipeMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating Recipe...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate Recipe
                            </>
                        )}
                    </Button>
                </div>

                {/* Right Column - Generated Recipe */}
                <div>
                    {generatedRecipe ? (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl mb-2">{generatedRecipe.title}</CardTitle>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge variant="secondary">AI Generated</Badge>
                                            {generatedRecipe.difficulty && <Badge>{generatedRecipe.difficulty}</Badge>}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {generatedRecipe.description && (
                                    <p className="text-muted-foreground">{generatedRecipe.description}</p>
                                )}

                                {/* Meta Info */}
                                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                                    {generatedRecipe.prepTime && (
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Prep</p>
                                            <p className="font-semibold">{generatedRecipe.prepTime} min</p>
                                        </div>
                                    )}
                                    {generatedRecipe.cookTime && (
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Cook</p>
                                            <p className="font-semibold">{generatedRecipe.cookTime} min</p>
                                        </div>
                                    )}
                                    {generatedRecipe.servings && (
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Servings</p>
                                            <p className="font-semibold">{generatedRecipe.servings}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Ingredients */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                                    <ul className="space-y-2">
                                        {generatedRecipe.ingredients?.map((ingredient, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{ingredient}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Instructions */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                                    <ol className="space-y-3">
                                        {generatedRecipe.instructions?.split('\n').map((step, index) => (
                                            <li key={index} className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1 pt-0.5">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {/* Save Button */}
                                <Button onClick={handleSaveRecipe} disabled={saveRecipeMutation.isPending} className="w-full gap-2">
                                    <ChefHat className="w-4 h-4" />
                                    Save to My Recipes
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center p-12">
                            <div className="text-center">
                                <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-xl font-semibold mb-2">No recipe generated yet</h3>
                                <p className="text-muted-foreground">
                                    Select ingredients and click "Generate Recipe" to create your personalized recipe
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
