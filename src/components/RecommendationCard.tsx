import { Card, CardContent } from "@/components/ui/card";
import { Recommendation } from "@/types/inventory";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'stock-up':
      return TrendingUp;
    case 'reduce':
      return TrendingDown;
    case 'seasonal':
      return Calendar;
    default:
      return TrendingUp;
  }
};

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const Icon = getIcon(recommendation.type);
  const urgencyColors = {
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-success/10 text-success border-success/20'
  };

  return (
    <Card className={`border ${urgencyColors[recommendation.urgency]} hover:shadow-md transition-all duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            recommendation.urgency === 'high' ? 'bg-destructive/20' :
            recommendation.urgency === 'medium' ? 'bg-warning/20' :
            'bg-success/20'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">{recommendation.product}</h4>
            <p className="text-xs text-muted-foreground">{recommendation.message} / सुझाव</p>
            {recommendation.festival && (
              <span className="inline-block mt-2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                🎉 {recommendation.festival} / पर्व
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};