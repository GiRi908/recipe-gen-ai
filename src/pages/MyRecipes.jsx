import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { Search, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import RecipeCard from '@/components/recipe/RecipeCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { recipeService } from '@/services/recipeService'
import { toast } from 'sonner'

export default function MyRecipes() {
    const { user } = useUser()
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const { data: savedRecipes, isLoading, refetch } = useQuery({
        queryKey: ['saved-recipes', user?.id, sortBy],
        queryFn: () => recipeService.getSavedRecipes(user?.id, sortBy),
        enabled: !!user?.id,
    })

    const handleUnsaveRecipe = async (recipeId) => {
        try {
            await recipeService.unsaveRecipe(recipeId)
            toast.success('Recipe removed from saved')
            refetch()
        } catch (error) {
            toast.error('Failed to remove recipe')
        }
    }

    const filteredRecipes = savedRecipes?.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">My Saved Recipes</h1>
                <p className="text-muted-foreground">Your collection of favorite recipes</p>
            </div>

            {/* Search and Sort */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search saved recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Recently Saved</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results */}
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
            ) : filteredRecipes && filteredRecipes.length > 0 ? (
                <>
                    <div className="mb-4 text-sm text-muted-foreground">
                        {filteredRecipes.length} saved recipe{filteredRecipes.length !== 1 ? 's' : ''}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} isSaved={true} onUnsave={handleUnsaveRecipe} />
                        ))}
                    </div>
                </>
            ) : (
                <Card className="p-12">
                    <div className="text-center">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Start exploring recipes and save your favorites to see them here
                        </p>
                        <Button onClick={() => (window.location.href = '/explore')}>Explore Recipes</Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
