import { useState } from "react";
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
  Sun
} from "lucide-react";
import { Product, Recommendation } from "@/types/inventory";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wai Wai Noodles | वाइ वाइ चाउचाउ",
    quantity: 150,
    category: "Instant Food | तत्काल खाना",
    expiryDate: new Date("2024-06-15"),
    minStock: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Nebico Biscuit | नेबिको बिस्कुट",
    quantity: 8,
    category: "Snacks | खाजा",
    expiryDate: new Date("2024-04-20"),
    minStock: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Mustard Oil (1L) | तोरीको तेल (१ लिटर)",
    quantity: 0,
    category: "Cooking Oil | खाना पकाउने तेल",
    expiryDate: new Date("2024-12-01"),
    minStock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Dettol Soap | डेटोल साबुन",
    quantity: 45,
    category: "Personal Care | व्यक्तिगत हेरचाह",
    expiryDate: new Date("2025-01-15"),
    minStock: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    name: "Real Juice (1L) | रियल जुस (१ लिटर)",
    quantity: 25,
    category: "Beverages | पेय पदार्थ",
    expiryDate: new Date("2024-03-10"),
    minStock: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    name: "Surf Excel (1kg) | सर्फ एक्सेल (१ किलो)",
    quantity: 12,
    category: "Household | घरायसी सामान",
    expiryDate: new Date("2025-06-20"),
    minStock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  }
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
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
    ));
    toast({
      title: delta > 0 ? "Stock Added" : "Stock Removed",
      description: `Updated quantity by ${Math.abs(delta)}`,
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= (p.minStock || 10)).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;
  const totalValue = products.reduce((acc, p) => acc + p.quantity, 0);

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
                onClick={() => navigate("/")}
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
            title="Total Products | कुल सामानहरू"
            value={totalProducts}
            icon={Package}
            gradient="bg-gradient-primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Stock | कुल स्टक"
            value={totalValue}
            description="units in inventory | भण्डारमा एकाइहरू"
            icon={ShoppingCart}
            gradient="bg-gradient-emerald"
          />
          <StatsCard
            title="Low Stock Items | कम स्टक सामान"
            value={lowStockCount}
            icon={AlertTriangle}
            gradient="bg-gradient-warning"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Out of Stock | स्टक सकियो"
            value={outOfStockCount}
            icon={TrendingUp}
            gradient="bg-gradient-danger"
          />
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-foreground">📊 Smart Insights | स्मार्ट सुझावहरू</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockRecommendations.map(rec => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>

        {/* Search and Add Product */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products | सामान खोज्नुहोस्..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={() => navigate("/add-product")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product | सामान थप्नुहोस्
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}