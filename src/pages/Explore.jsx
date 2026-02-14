import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import RecipeCard from '@/components/recipe/RecipeCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { recipeService } from '@/services/recipeService'
import { toast } from 'sonner'

export default function Explore() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCuisine, setSelectedCuisine] = useState('all')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')
    const [sortBy, setSortBy] = useState('newest')

    // Fetch recipes with filters
    const { data: recipes, isLoading, error } = useQuery({
        queryKey: ['recipes', selectedCuisine, selectedCategory, selectedDifficulty, sortBy, searchQuery],
        queryFn: () =>
            recipeService.getRecipes({
                cuisine: selectedCuisine !== 'all' ? selectedCuisine : undefined,
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
                sort: sortBy,
                search: searchQuery || undefined,
            }),
    })

    const handleClearFilters = () => {
        setSelectedCuisine('all')
        setSelectedCategory('all')
        setSelectedDifficulty('all')
        setSortBy('newest')
        setSearchQuery('')
    }

    const activeFiltersCount =
        (selectedCuisine !== 'all' ? 1 : 0) +
        (selectedCategory !== 'all' ? 1 : 0) +
        (selectedDifficulty !== 'all' ? 1 : 0)

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
                <h1 className="text-4xl font-bold mb-2">Explore Recipes</h1>
                <p className="text-muted-foreground">Discover delicious recipes from around the world</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search recipes by name or ingredients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                    </div>

                    {/* Cuisine Filter */}
                    <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cuisines</SelectItem>
                            <SelectItem value="italian">Italian</SelectItem>
                            <SelectItem value="chinese">Chinese</SelectItem>
                            <SelectItem value="indian">Indian</SelectItem>
                            <SelectItem value="mexican">Mexican</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                            <SelectItem value="thai">Thai</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="american">American</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="dessert">Dessert</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                            <SelectItem value="appetizer">Appetizer</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Difficulty Filter */}
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort By */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="quick">Quickest</SelectItem>
                            <SelectItem value="easy">Easiest</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2">
                            <X className="w-4 h-4" />
                            Clear Filters
                            <Badge variant="secondary" className="ml-1">
                                {activeFiltersCount}
                            </Badge>
                        </Button>
                    )}
                </div>
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
                    <p className="text-muted-foreground text-lg mb-2">No recipes found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    )
}
