import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react'
import { Toaster } from 'sonner'

// Layout
import Layout from './components/layout/Layout'

// Public Pages
import Home from './pages/Home'
import Explore from './pages/Explore'
import RecipeDetail from './pages/RecipeDetail'
import Category from './pages/Category'
import Pricing from './pages/Pricing'

// Protected Pages
import Pantry from './pages/Pantry'
import MyRecipes from './pages/MyRecipes'
import AIRecipe from './pages/AIRecipe'
import PantrySuggestions from './pages/PantrySuggestions'

// Protected Route Wrapper
function ProtectedRoute({ children }) {
    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}

function App() {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="recipes/:id" element={<RecipeDetail />} />
                    <Route path="category/:slug" element={<Category />} />
                    <Route path="pricing" element={<Pricing />} />

                    {/* Protected Routes */}
                    <Route
                        path="pantry"
                        element={
                            <ProtectedRoute>
                                <Pantry />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="my-recipes"
                        element={
                            <ProtectedRoute>
                                <MyRecipes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="ai-recipe"
                        element={
                            <ProtectedRoute>
                                <AIRecipe />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="pantry-suggestions"
                        element={
                            <ProtectedRoute>
                                <PantrySuggestions />
                            </ProtectedRoute>
                        }
                    />

                    {/* Auth Routes */}
                    <Route
                        path="sign-in/*"
                        element={
                            <div className="flex items-center justify-center min-h-screen">
                                <SignIn routing="path" path="/sign-in" />
                            </div>
                        }
                    />
                    <Route
                        path="sign-up/*"
                        element={
                            <div className="flex items-center justify-center min-h-screen">
                                <SignUp routing="path" path="/sign-up" />
                            </div>
                        }
                    />
                </Route>
            </Routes>

            {/* Toast Notifications */}
            <Toaster position="top-right" richColors />
        </>
    )
}

export default App
