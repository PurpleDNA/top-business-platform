import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductionCardProps {
  title: string;
  value: { orange: string; blue: string; green: string };
  total: string;
  icon: LucideIcon;
  description?: string;
}

export const ProductionCard = ({
  title,
  value,
  total,
  icon: Icon,
  description,
}: ProductionCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3">
          <div className="text-2xl font-bold  mb-1 text-orange-500">
            {value.orange}
          </div>
          <div className="text-2xl font-bold  mb-1 text-blue-500">
            {value.blue}
          </div>
          <div className="text-2xl font-bold mb-1 text-green-500">
            {value.green}
          </div>
        </div>
        {total && <p className={cn("text-base")}>Total: {total}</p>}

        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
