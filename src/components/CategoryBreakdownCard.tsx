import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CategoryData } from "@/utils/categoryAnalytics";

interface CategoryBreakdownCardProps {
  data: CategoryData[];
}

export const CategoryBreakdownCard = ({ data }: CategoryBreakdownCardProps) => {
  const maxCount = Math.max(...data.map((c) => c.totalCount), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Ticket Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {category.category}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {category.closedCount} closed
                  </Badge>
                  <Badge variant="outline">
                    {category.openCount} open
                  </Badge>
                  <span className="text-sm font-semibold text-muted-foreground ml-2">
                    {category.totalCount} total
                  </span>
                </div>
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${(category.totalCount / maxCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
