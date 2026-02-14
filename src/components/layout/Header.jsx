import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { ChefHat, Menu, X, Search } from 'lucide-react'
import { Button } from '../ui/Button'
import { useState } from 'react'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Explore', href: '/explore' },
        { name: 'My Pantry', href: '/pantry', protected: true },
        { name: 'My Recipes', href: '/my-recipes', protected: true },
        { name: 'AI Recipe', href: '/ai-recipe', protected: true },
        { name: 'Pricing', href: '/pricing' },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <ChefHat className="h-6 w-6 text-primary" />
                    <span className="gradient-text">RecipeAI</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navigation.map((item) => (
                        <SignedIn key={item.name}>
                            <Link
                                to={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.name}
                            </Link>
                        </SignedIn>
                    ))}
                    {navigation.filter(item => !item.protected).map((item) => (
                        <SignedOut key={item.name}>
                            <Link
                                to={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.name}
                            </Link>
                        </SignedOut>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                        <Search className="h-5 w-5" />
                    </Button>

                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    <SignedOut>
                        <Link to="/sign-in">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/sign-up">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </SignedOut>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="container mx-auto px-4 py-4 space-y-3">
                        {navigation.map((item) => (
                            <SignedIn key={item.name}>
                                <Link
                                    to={item.href}
                                    className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </SignedIn>
                        ))}
                        {navigation.filter(item => !item.protected).map((item) => (
                            <SignedOut key={item.name}>
                                <Link
                                    to={item.href}
                                    className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </SignedOut>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}
