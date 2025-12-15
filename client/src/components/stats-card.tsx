import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  testId?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, testId }: StatsCardProps) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold" data-testid={`${testId}-value`}>{value}</span>
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {trend.isPositive ? "+" : ""}{trend.value}% from last week
              </span>
            )}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
