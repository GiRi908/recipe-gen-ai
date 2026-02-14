import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ChefHat, Sparkles, ScanLine, BookOpen } from 'lucide-react'

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="gradient-hero py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold text-white">
                            Cook Smarter with{' '}
                            <span className="gradient-text bg-gradient-to-r from-green-400 to-emerald-500">
                                AI-Powered Recipes
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Transform your pantry into delicious meals. Get personalized recipe suggestions
                            based on what you already have at home.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/ai-recipe">
                                <Button size="lg" className="text-lg px-8">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generate Recipe
                                </Button>
                            </Link>
                            <Link to="/explore">
                                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                                    Explore Recipes
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Cook Better
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Powered by AI to make cooking easier, faster, and more enjoyable
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all animate-slide-up">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Recipe Generator</h3>
                            <p className="text-muted-foreground">
                                Generate custom recipes based on your available ingredients and dietary preferences
                            </p>
                        </div>

                        <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <ScanLine className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Smart Pantry Scanner</h3>
                            <p className="text-muted-foreground">
                                Scan your pantry items with AI vision to automatically track what you have
                            </p>
                        </div>

                        <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Recipe Library</h3>
                            <p className="text-muted-foreground">
                                Access thousands of recipes or save your AI-generated favorites
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Add Your Pantry Items</h3>
                            <p className="text-muted-foreground">
                                Manually add items or use our AI scanner to quickly catalog your ingredients
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Generate Recipes</h3>
                            <p className="text-muted-foreground">
                                Let AI create personalized recipes based on what you have and your preferences
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Start Cooking</h3>
                            <p className="text-muted-foreground">
                                Follow step-by-step instructions and enjoy your delicious meal
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <ChefHat className="h-16 w-16 mx-auto mb-6 opacity-90" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Transform Your Cooking?
                    </h2>
                    <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                        Join thousands of home cooks who are making the most of their pantry with AI
                    </p>
                    <Link to="/sign-up">
                        <Button size="lg" variant="secondary" className="text-lg px-8">
                            Get Started Free
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
