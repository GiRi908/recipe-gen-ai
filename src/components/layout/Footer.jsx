import { Link } from 'react-router-dom'
import { ChefHat, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                            <ChefHat className="h-6 w-6 text-primary" />
                            <span className="gradient-text">RecipeAI</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your AI-powered recipe assistant. Create delicious meals with what you have.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/explore" className="hover:text-foreground transition-colors">Explore Recipes</Link></li>
                            <li><Link to="/ai-recipe" className="hover:text-foreground transition-colors">AI Generator</Link></li>
                            <li><Link to="/pantry" className="hover:text-foreground transition-colors">Pantry Manager</Link></li>
                            <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} RecipeAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
