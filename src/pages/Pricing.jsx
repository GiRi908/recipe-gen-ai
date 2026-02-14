import { Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card'

export default function Pricing() {
    const tiers = [
        {
            name: 'Free',
            price: '$0',
            description: 'Perfect for trying out RecipeAI',
            features: [
                '5 AI recipe generations per day',
                'Basic pantry management',
                'Access to recipe library',
                'Save up to 10 recipes',
            ],
            cta: 'Get Started',
            highlighted: false,
        },
        {
            name: 'Premium',
            price: '$9.99',
            period: '/month',
            description: 'For passionate home cooks',
            features: [
                '50 AI recipe generations per day',
                'Advanced pantry scanner',
                'Unlimited saved recipes',
                'Nutrition information',
                'Priority support',
            ],
            cta: 'Upgrade to Premium',
            highlighted: true,
        },
        {
            name: 'Pro',
            price: '$19.99',
            period: '/month',
            description: 'For culinary enthusiasts',
            features: [
                'Unlimited AI recipe generations',
                'Advanced AI customization',
                'Meal planning & shopping lists',
                'Recipe sharing & collaboration',
                'API access',
                'Dedicated support',
            ],
            cta: 'Upgrade to Pro',
            highlighted: false,
        },
    ]

    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that's right for you. Upgrade or downgrade anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={tier.highlighted ? 'border-primary shadow-lg scale-105' : ''}
                        >
                            <CardHeader>
                                <CardTitle>{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={tier.highlighted ? 'default' : 'outline'}
                                >
                                    {tier.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
