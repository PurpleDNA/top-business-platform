import { BreadCalculatorComponent } from "@/app/components/calculator/BreadCalculatorComponent";
import { getBreadPriceMultipliers } from "@/app/services/bread_price";

export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const multipliers = await getBreadPriceMultipliers();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bread Calculator
          </h1>
          <p className="text-muted-foreground">
            Quickly calculate bread prices without creating a sale
          </p>
        </div>

        <BreadCalculatorComponent multipliers={multipliers} />
      </div>
    </div>
  );
}
