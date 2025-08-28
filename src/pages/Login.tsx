import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { Building2, CreditCard, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    panNumber: "",
    shopName: "",
    name: ""
  });

  const API_BASE = (import.meta as any)?.env?.VITE_API_URL || "http://localhost:4000/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      if (!isLogin) {
        const pan = (formData.panNumber || '').toUpperCase().trim();
        const panRegex = /^[A-Z0-9]{8,12}$/;
        if (!panRegex.test(pan)) {
          throw new Error("Invalid PAN format. Use 8-12 letters/numbers.");
        }
      }

      const endpoint = isLogin ? 
        `${API_BASE}/auth/login` : 
        `${API_BASE}/auth/register`;

      const payload = isLogin ? {
        email: formData.email,
        password: formData.password
      } : {
        name: formData.name || formData.shopName || formData.email,
        email: formData.email,
        password: formData.password,
        role: 'owner',
        panNumber: formData.panNumber
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Authentication failed');
      }
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      toast({
        title: isLogin ? 'Welcome back!' : 'Account created!',
        description: `Logged in as ${data?.user?.email || formData.email}`
      });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Authentication failed', description: err.message || 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Enter your credentials to access your inventory" 
                : "Register your shop with Smart Saauji"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="shopName"
                        placeholder="Enter your shop name"
                        className="pl-10"
                        value={formData.shopName}
                        onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="panNumber"
                    placeholder="Enter your PAN number"
                    className="pl-10"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-6">
          🏪 Trusted by 1000+ Nepali retailers across the country
        </p>
      </div>
    </div>
  );
}