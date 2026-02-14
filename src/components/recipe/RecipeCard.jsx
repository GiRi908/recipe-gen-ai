import { Link } from 'react-router-dom'
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function RecipeCard({ recipe, isSaved = false, onSave, onUnsave, className }) {
    const handleSaveClick = (e) => {
        e.preventDefault()
        if (isSaved) {
            onUnsave?.(recipe.id)
        } else {
            onSave?.(recipe.id)
        }
    }

    return (
        <Link to={`/recipes/${recipe.id}`} className="block group">
            <Card className={cn('overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1', className)}>
                {/* Recipe Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                    {recipe.imageUrl ? (
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <ChefHat className="w-16 h-16 text-primary/40" />
                        </div>
                    )}

                    {/* Save Button */}
                    {(onSave || onUnsave) && (
                        <button
                            onClick={handleSaveClick}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                        >
                            {isSaved ? (
                                <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                            ) : (
                                <Bookmark className="w-5 h-5 text-gray-700" />
                            )}
                        </button>
                    )}

                    {/* AI Generated Badge */}
                    {recipe.isAIGenerated && (
                        <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-white/90 text-primary border-primary/20">
                                AI Generated
                            </Badge>
                        </div>
                    )}

                    {/* Difficulty Badge */}
                    {recipe.difficulty && (
                        <div className="absolute bottom-3 left-3">
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
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {recipe.title}
                    </h3>

                    {/* Description */}
                    {recipe.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{recipe.description}</p>
                    )}

                    {/* Cuisine & Category */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                        {recipe.cuisine && (
                            <Badge variant="outline" className="text-xs">
                                {recipe.cuisine}
                            </Badge>
                        )}
                        {recipe.category && (
                            <Badge variant="outline" className="text-xs">
                                {recipe.category}
                            </Badge>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
                    {/* Time & Servings */}
                    <div className="flex items-center gap-4">
                        {recipe.prepTime && recipe.cookTime && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{recipe.prepTime + recipe.cookTime} min</span>
                            </div>
                        )}
                        {recipe.servings && (
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{recipe.servings}</span>
                            </div>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
