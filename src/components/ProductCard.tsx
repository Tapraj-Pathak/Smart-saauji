import { useState } from "react";
import { Product, StockStatus } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Package, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ProductCardProps {
  product: Product;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const getStockStatus = (quantity: number, minStock?: number): StockStatus => {
  const threshold = minStock || 10;
  if (quantity === 0) {
    return { status: 'out', color: 'bg-destructive', label: 'Out of Stock' };
  } else if (quantity <= threshold) {
    return { status: 'low', color: 'bg-warning', label: 'Low Stock' };
  }
  return { status: 'healthy', color: 'bg-success', label: 'In Stock' };
};

export const ProductCard = ({ product, onUpdateQuantity }: ProductCardProps) => {
  const stockStatus = getStockStatus(product.quantity, product.minStock);
  const [editQty, setEditQty] = useState<number>(product.quantity);
  const isExpiringSoon = product.expiryDate && 
    new Date(product.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border overflow-hidden group">
      <div className={`h-1 ${stockStatus.color}`} />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.category && (
              <span className="text-xs text-muted-foreground">{product.category}</span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            stockStatus.status === 'out' ? 'bg-destructive/10 text-destructive' :
            stockStatus.status === 'low' ? 'bg-warning/10 text-warning' :
            'bg-success/10 text-success'
          }`}>
            {stockStatus.label}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Qty</span>
            <Input
              type="number"
              className="h-8 w-20"
              value={editQty}
              onChange={(e) => setEditQty(Math.max(0, Number(e.target.value)))}
              onFocus={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const next = Math.max(0, editQty || 0);
                  const delta = next - product.quantity;
                  if (delta !== 0) onUpdateQuantity(product.id, delta);
                }
              }}
            />
            <span className="text-muted-foreground">units</span>
            <Button
              size="sm"
              variant="outline"
              className="ml-1"
              onClick={() => {
                const next = Math.max(0, editQty || 0);
                const delta = next - product.quantity;
                if (delta !== 0) onUpdateQuantity(product.id, delta);
              }}
            >
              Save
            </Button>
          </div>
          
          {product.expiryDate && (
            <div className={`flex items-center gap-2 text-sm ${isExpiringSoon ? 'text-warning' : ''}`}>
              <Calendar className="w-4 h-4" />
              <span>Expires: {format(new Date(product.expiryDate), 'dd MMM yyyy')}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            onClick={() => onUpdateQuantity(product.id, -1)}
            disabled={product.quantity === 0}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 hover:bg-success/10 hover:text-success hover:border-success/20"
            onClick={() => onUpdateQuantity(product.id, 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};