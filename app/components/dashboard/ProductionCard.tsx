import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Color map for Tailwind static class names
const getTextColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    orange: "text-orange-500",
    blue: "text-blue-500",
    green: "text-green-500",
    white: "text-slate-500",
    brown: "text-amber-700",
    pink: "text-pink-500",
  };
  return colorMap[color.toLowerCase()] || "text-gray-500";
};

interface ProductionCardProps {
  title: string;
  value: Record<string, string>;
  multipliers: Record<string, number>;
  total: string;
  icon: LucideIcon;
  description?: string;
}

export const ProductionCard = ({
  title,
  value,
  multipliers,
  total,
  icon: Icon,
  description,
}: ProductionCardProps) => {
  const breadTypes = Object.keys(multipliers);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-3`}>
          {breadTypes.map((breadType) => (
            <div
              key={breadType}
              className={`text-2xl font-bold mb-1 ${getTextColorClass(
                breadType
              )} ${Number(value[breadType]) > 0 ? "" : "hidden"}`}
            >
              {value[breadType] || 0}
            </div>
          ))}
        </div>
        {total && <p className={cn("text-base")}>Total: {total}</p>}

        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
