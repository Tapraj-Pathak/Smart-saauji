import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { ArrowLeft, Download, TrendingUp, TrendingDown } from "lucide-react";

const demandSupplyData = [
  { name: "Wai Wai", demand: 300, supply: 250 },
  { name: "Cooking Oil", demand: 150, supply: 80 },
  { name: "Biscuits", demand: 100, supply: 120 },
  { name: "Soap", demand: 200, supply: 180 },
  { name: "Rice", demand: 400, supply: 350 },
  { name: "Dal", demand: 250, supply: 260 }
];

const monthlyTrend = [
  { month: "Baisakh", sales: 45000 },
  { month: "Jestha", sales: 52000 },
  { month: "Ashar", sales: 48000 },
  { month: "Shrawan", sales: 61000 },
  { month: "Bhadra", sales: 58000 },
  { month: "Ashwin", sales: 72000 }
];

const categoryDistribution = [
  { name: "Food & Beverages", value: 35, color: "hsl(243, 80%, 62%)" },
  { name: "Personal Care", value: 25, color: "hsl(158, 64%, 42%)" },
  { name: "Household", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Snacks", value: 12, color: "hsl(0, 84%, 60%)" },
  { name: "Others", value: 8, color: "hsl(210, 40%, 70%)" }
];

export default function Analytics() {
  const navigate = useNavigate();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = () => {
    setExportLoading(true);
    // Simulate export
    setTimeout(() => {
      setExportLoading(false);
      // In real app, trigger download
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="hover:bg-accent"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Logo />
            </div>
            
            <Button
              onClick={handleExport}
              disabled={exportLoading}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Download className="w-4 h-4 mr-2" />
              {exportLoading ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">📊 Demand & Supply Analytics | माग र आपूर्ति विश्लेषण</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Demand Met | औसत माग पूरा
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">87%</span>
                <span className="flex items-center text-sm text-success">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stock Efficiency | स्टक दक्षता
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">72%</span>
                <span className="flex items-center text-sm text-destructive">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -3%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Festival Readiness | चाड तयारी
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">Ready</span>
                <span className="text-sm text-muted-foreground">Dashain in 15 days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demand vs Supply */}
          <Card>
            <CardHeader>
              <CardTitle>Demand vs Supply | माग र आपूर्ति</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demandSupplyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demand" fill="hsl(243, 80%, 62%)" />
                  <Bar dataKey="supply" fill="hsl(158, 64%, 42%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Trend | मासिक बिक्री प्रवृत्ति (NPR)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(243, 80%, 62%)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(243, 80%, 62%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Product Category Distribution | उत्पाद वर्ग वितरण</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Festival Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Festival Impact Analysis | चाड प्रभाव विश्लेषण</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Dashain</span>
                    <span className="text-sm font-medium">+45%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Tihar</span>
                    <span className="text-sm font-medium">+38%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-emerald" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Teej</span>
                    <span className="text-sm font-medium">+28%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-warning" style={{ width: '56%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Holi</span>
                    <span className="text-sm font-medium">+22%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-danger" style={{ width: '44%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📢 Analytics-Based Recommendations | विश्लेषण आधारित सिफारिसहरू</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-medium text-sm">Strong Performance</p>
                  <p className="text-sm text-muted-foreground">
                    Your inventory turnover rate is above average. Keep maintaining current stock levels for Wai Wai and Rice.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-medium text-sm">Stock Opportunity</p>
                  <p className="text-sm text-muted-foreground">
                    Cooking Oil demand exceeds supply by 47%. Consider increasing stock before the upcoming festival season.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-medium text-sm">Festival Insight</p>
                  <p className="text-sm text-muted-foreground">
                    Based on last year's data, expect 45% increase in sweet & snack sales during Dashain. Plan inventory accordingly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}