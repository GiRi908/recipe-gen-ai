import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit, Camera, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { pantryService } from '@/services/pantryService'
import { toast } from 'sonner'

export default function Pantry() {
    const { user } = useUser()
    const queryClient = useQueryClient()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        unit: '',
        category: '',
        expiryDate: '',
    })

    // Fetch pantry items
    const { data: pantryItems, isLoading } = useQuery({
        queryKey: ['pantry', user?.id],
        queryFn: () => pantryService.getPantryItems(user?.id),
        enabled: !!user?.id,
    })

    // Add pantry item mutation
    const addItemMutation = useMutation({
        mutationFn: (item) => pantryService.addPantryItem(item, user?.id),
        onSuccess: () => {
            queryClient.invalidateQueries(['pantry', user?.id])
            toast.success('Item added to pantry!')
            setIsAddDialogOpen(false)
            resetForm()
        },
        onError: () => {
            toast.error('Failed to add item')
        },
    })

    // Delete pantry item mutation
    const deleteItemMutation = useMutation({
        mutationFn: (itemId) => pantryService.deletePantryItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries(['pantry', user?.id])
            toast.success('Item removed from pantry')
        },
        onError: () => {
            toast.error('Failed to remove item')
        },
    })

    // Update pantry item mutation
    const updateItemMutation = useMutation({
        mutationFn: ({ itemId, updates }) => pantryService.updatePantryItem(itemId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries(['pantry', user?.id])
            toast.success('Item updated!')
            setEditingItem(null)
            resetForm()
        },
        onError: () => {
            toast.error('Failed to update item')
        },
    })

    const resetForm = () => {
        setFormData({
            name: '',
            quantity: '',
            unit: '',
            category: '',
            expiryDate: '',
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.quantity) {
            toast.error('Please fill in required fields')
            return
        }

        if (editingItem) {
            updateItemMutation.mutate({ itemId: editingItem.id, updates: formData })
        } else {
            addItemMutation.mutate(formData)
        }
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit || '',
            category: item.category || '',
            expiryDate: item.expiryDate || '',
        })
        setIsAddDialogOpen(true)
    }

    const handleDelete = (itemId) => {
        if (confirm('Are you sure you want to remove this item?')) {
            deleteItemMutation.mutate(itemId)
        }
    }

    // Group items by category
    const groupedItems = pantryItems?.reduce((acc, item) => {
        const category = item.category || 'Uncategorized'
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
    }, {})

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Pantry</h1>
                    <p className="text-muted-foreground">Manage your ingredients and get recipe suggestions</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Camera className="w-4 h-4" />
                        Scan Items
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2" onClick={() => { setEditingItem(null); resetForm(); }}>
                                <Plus className="w-4 h-4" />
                                Add Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Item Name *</label>
                                    <Input
                                        placeholder="e.g., Tomatoes"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Quantity *</label>
                                        <Input
                                            placeholder="e.g., 5"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Unit</label>
                                        <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pieces">Pieces</SelectItem>
                                                <SelectItem value="kg">Kilograms</SelectItem>
                                                <SelectItem value="g">Grams</SelectItem>
                                                <SelectItem value="l">Liters</SelectItem>
                                                <SelectItem value="ml">Milliliters</SelectItem>
                                                <SelectItem value="cups">Cups</SelectItem>
                                                <SelectItem value="tbsp">Tablespoons</SelectItem>
                                                <SelectItem value="tsp">Teaspoons</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Category</label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Vegetables">Vegetables</SelectItem>
                                            <SelectItem value="Fruits">Fruits</SelectItem>
                                            <SelectItem value="Dairy">Dairy</SelectItem>
                                            <SelectItem value="Meat">Meat</SelectItem>
                                            <SelectItem value="Grains">Grains</SelectItem>
                                            <SelectItem value="Spices">Spices</SelectItem>
                                            <SelectItem value="Condiments">Condiments</SelectItem>
                                            <SelectItem value="Beverages">Beverages</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Expiry Date</label>
                                    <Input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" className="flex-1" disabled={addItemMutation.isPending || updateItemMutation.isPending}>
                                        {editingItem ? 'Update Item' : 'Add Item'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Pantry Items */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                </div>
            ) : pantryItems && pantryItems.length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedItems || {}).map(([category, items]) => (
                        <div key={category}>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                {category}
                                <Badge variant="secondary" className="ml-2">
                                    {items.length}
                                </Badge>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {items.map((item) => (
                                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground">
                                                {item.quantity} {item.unit}
                                            </p>
                                            {item.expiryDate && (
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="p-12">
                    <div className="text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">Your pantry is empty</h3>
                        <p className="text-muted-foreground mb-6">Start adding ingredients to get personalized recipe suggestions</p>
                        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Your First Item
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
