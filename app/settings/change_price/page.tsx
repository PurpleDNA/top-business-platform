import { fetchAllBreadPrices } from "@/app/services/bread_price";
import { isSuperAdmin } from "@/app/services/roles";
import { BreadPriceList } from "./BreadPriceList";

export default async function ChangePricePage() {
  const breadPrices = await fetchAllBreadPrices();
  const isSuper = await isSuperAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Bread Prices</h1>
        <p className="text-muted-foreground">
          Manage bread prices for orange, blue, and green varieties
        </p>
      </div>

      <BreadPriceList initialPrices={breadPrices} canManage={isSuper} />
    </div>
  );
}
