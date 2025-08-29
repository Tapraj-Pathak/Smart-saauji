import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StatsCard } from "@/components/StatsCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ShoppingCart, 
  Plus,
  Search,
  BarChart3,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  MoreVertical
} from "lucide-react";
import { Product, Recommendation } from "@/types/inventory";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wai Wai Noodles",
    quantity: 150,
    category: "Instant Food",
    expiryDate: "",
    minStock: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Nebico Biscuit",
    quantity: 8,
    category: "Snacks",
    expiryDate: "",
    minStock: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
 

];

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "stock-up",
    product: "Cooking Oil",
    message: "📢 Customers nearby are buying more Cooking Oil, stock up before Teej festival!",
    festival: "Teej Festival",
    urgency: "high",
    icon: "📈"
  },
  {
    id: "2",
    type: "reduce",
    product: "Biscuits",
    message: "📉 Biscuit sales are dropping this week, consider reducing supply",
    urgency: "medium",
    icon: "📉"
  },
  {
    id: "3",
    type: "seasonal",
    product: "Marigold Flowers",
    message: "🪔 Tihar is approaching in 2 weeks, consider stocking Marigold flowers",
    festival: "Tihar",
    urgency: "medium",
    icon: "🎊"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'qty_asc' | 'qty_desc'>('name_asc');
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    category: "",
    expiryDate: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [requestedWholesale, setRequestedWholesale] = useState<Record<string, boolean>>({});

  const API_BASE = (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<any[]>(`/products`);
        const mapped: Product[] = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          quantity: p.quantity ?? 0,
          category: p.category,
          expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString() : undefined,
          
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date()
        }));
        setProducts(mapped);
      } catch (e) {
        console.error(e);
        setProducts(mockProducts);
        toast({ title: "Using demo data", description: "Backend not reachable, showing mock products." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleUpdateQuantity = async (id: string, delta: number) => {
    try {
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
      ));
      const updated = await api.post<any>(`/products/${id}/adjust`, { delta }, true);
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, quantity: updated.quantity ?? p.quantity } : p
      ));
      toast({
        title: delta > 0 ? "Stock Added" : "Stock Removed",
        description: `Updated quantity by ${Math.abs(delta)}`,
      });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Update failed", description: e.message || "Could not update stock" });
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (isCreating) return;
      setIsCreating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Login required", description: "Please login to add products." });
        return;
      }
      const payload = {
        name: newProduct.name,
        quantity: Number(newProduct.quantity) || 0,
        category: newProduct.category || undefined,
        expiryDate: newProduct.expiryDate ? new Date(newProduct.expiryDate) : undefined
      };
      const created = await api.post<any>(`/products`, payload, true);
      const prod: Product = {
        id: created._id,
        name: created.name,
        quantity: created.quantity ?? 0,
        category: created.category,
        expiryDate: created.expiryDate ? new Date(created.expiryDate).toISOString() : undefined,
        createdAt: created.createdAt ? new Date(created.createdAt) : new Date(),
        updatedAt: created.updatedAt ? new Date(created.updatedAt) : new Date()
      };
      setProducts(prev => {
        if (prev.some(p => p.id === prod.id)) return prev;
        return [prod, ...prev];
      });
      setShowAddForm(false);
      setNewProduct({ name: "", quantity: "", category: "", expiryDate: "" });
      toast({ title: "Product added", description: `${prod.name} created successfully.` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Add failed", description: e.message || "Could not add product" });
    } finally { setIsCreating(false); }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'qty_asc':
        return (a.quantity || 0) - (b.quantity || 0);
      case 'qty_desc':
        return (b.quantity || 0) - (a.quantity || 0);
      case 'name_asc':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= (p.minStock || 10)).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const totalValue = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= (p.minStock || 10));

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Logo />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="hover:bg-accent"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/analytics")}
                className="hidden sm:flex items-center gap-2 hover:bg-accent"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { localStorage.removeItem('token'); navigate("/"); }}
                className="hover:bg-accent"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            gradient="bg-gradient-primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Stock"
            value={totalValue}
            description="units in inventory"
            icon={ShoppingCart}
            gradient="bg-gradient-emerald"
          />
          <StatsCard
            title="Low Stock Items"
            value={lowStockCount}
            icon={AlertTriangle}
            gradient="bg-gradient-warning"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Out of Stock"
            value={outOfStockCount}
            icon={TrendingUp}
            gradient="bg-gradient-danger"
          />
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-foreground">📊 Smart Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockRecommendations.map(rec => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>

        {/* Low Stock + Wholesale Assist */}
        {lowStockProducts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">Stock Alert ⚠️</h2>
            <div className="rounded-md border border-border bg-card " >
              <div className="divide-y divide-border">
                {lowStockProducts.map(item => (
                  <div key={item.id} className={`p-3 flex items-center justify-between gap-3 ${requestedWholesale[item.id] ? 'bg-red-50 dark:bg-red-900/30' : ''}`}>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Current: {item.quantity} • Min: {item.minStock || 10}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Request qty"
                        className="h-9 w-28"
                        onKeyDown={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          (e.target as HTMLInputElement).dataset.qty = String(val);
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={async (e) => {
                          const input = (e.currentTarget.previousSibling as HTMLInputElement);
                          const qty = Number(input?.dataset?.qty || 0);
                          const token = localStorage.getItem("token");
                          if (!token) {
                            toast({ title: "Login required", description: "Please login to send wholesale request." });
                            return;
                          }
                          try {
                            await api.post(`/wholesale/request`, { productId: item.id, quantity: qty, note: 'Auto-generated from low stock alert' }, true);
                            toast({ title: 'Request sent', description: `${item.name}: ${qty} units requested from wholesaler.` });
                            setRequestedWholesale(prev => ({ ...prev, [item.id]: true }));
                          } catch (err: any) {
                            toast({ title: 'Request failed', description: err.message || 'Please try again.' });
                          }
                        }}
                      >
                        Confirm & Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Add Product */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 relative">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products by name or category..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="sm:w-10 sm:h-10"
              onClick={() => setMenuOpen(v => !v)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card shadow-lg z-20">
                <div className="p-2">
                  <p className="px-2 py-1 text-xs text-muted-foreground">Sort by</p>
                  <div className="flex flex-col">
                    <button className={`text-left px-2 py-1 rounded hover:bg-accent ${sortBy==='name_asc'?'bg-accent/50':''}`} onClick={() => { setSortBy('name_asc'); setMenuOpen(false); }}>Name (A→Z)</button>
                    <button className={`text-left px-2 py-1 rounded hover:bg-accent ${sortBy==='name_desc'?'bg-accent/50':''}`} onClick={() => { setSortBy('name_desc'); setMenuOpen(false); }}>Name (Z→A)</button>
                    <button className={`text-left px-2 py-1 rounded hover:bg-accent ${sortBy==='qty_asc'?'bg-accent/50':''}`} onClick={() => { setSortBy('qty_asc'); setMenuOpen(false); }}>Quantity (Low→High)</button>
                    <button className={`text-left px-2 py-1 rounded hover:bg-accent ${sortBy==='qty_desc'?'bg-accent/50':''}`} onClick={() => { setSortBy('qty_desc'); setMenuOpen(false); }}>Quantity (High→Low)</button>
                  </div>
                  <div className="h-px my-2 bg-border" />
                  <p className="px-2 py-1 text-xs text-muted-foreground">View</p>
                  <div className="flex gap-2 px-2 pb-2">
                    <Button variant={viewMode==='grid' ? 'default' : 'outline'} size="sm" onClick={() => { setViewMode('grid'); setMenuOpen(false); }}>Grid</Button>
                    <Button variant={viewMode==='list' ? 'default' : 'outline'} size="sm" onClick={() => { setViewMode('list'); setMenuOpen(false); }}>List</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90 transition-opacity py-6 text-base"
            size="lg"
            onClick={() => setShowAddForm(v => !v)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-3">Add New Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Input
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              />
              <Input
                type="string"
                placeholder="Expiry Date"
                value={newProduct.expiryDate}
                onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
              />
              
            </div>
            <div className="mt-3 flex gap-3">
              <Button className="bg-success text-white" onClick={handleCreateProduct} disabled={isCreating}>
                {isCreating ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Products List/Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border rounded-md border border-border bg-card">
            {sortedProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category || '—'}{product.expiryDate ? ` • Exp: ${new Date(product.expiryDate).toLocaleDateString()}` : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Qty</span>
                    <input
                      type="number"
                      value={product.quantity}
                      className="h-8 w-20 rounded-md border border-border bg-background px-2 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const next = Math.max(0, Number((e.target as HTMLInputElement).value) || 0);
                          const delta = next - product.quantity;
                          if (delta !== 0) handleUpdateQuantity(product.id, delta);
                        }
                      }}
                      onBlur={(e) => {
                        const next = Math.max(0, Number((e.target as HTMLInputElement).value) || 0);
                        const delta = next - product.quantity;
                        if (delta !== 0) handleUpdateQuantity(product.id, delta);
                      }}
                    />
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(product.id, -1)} disabled={product.quantity === 0}>-</Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(product.id, 1)}>+</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products found matching your search</p>
          </div>
        )}
        {isLoading && (
          <p className="text-center text-muted-foreground py-8">Loading products...</p>
        )}
      </div>
    </div>
  );
}