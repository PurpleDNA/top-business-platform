// import { SalesChart } from "./components/dashboard/SalesChart";
import { MetricsCard } from "./components/dashboard/MetricsCard";
import { CustomersTable } from "./components/dashboard/CustomersTable";
import { ProductionsTable } from "./components/dashboard/ProductionsTable";
import { QuickActions } from "./components/dashboard/QuickActions";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Factory,
  Users,
  UserPlus,
} from "lucide-react";
import { getTotalBusinessOutstanding } from "./services/outstanding";
import Hero from "./components/dashboard/Hero";
import { getCustomerCount } from "./services/customers";
import { getLatestProduction } from "./services/productions";
import { ProductionCard } from "./components/dashboard/ProductionCard";
import { Production } from "./services/productions";
import { formatDate } from "./services/utils";
import { getBreadPriceMultipliers } from "./services/bread_price";
import { getUser } from "./services/roles";

const Index = async () => {
  const profile = await getUser();
  const totalOutstanding = await getTotalBusinessOutstanding();
  console.log(totalOutstanding);
  const customerCount = await getCustomerCount();
  const latestProduction = (await getLatestProduction()) as Production;
  const multipliers = await getBreadPriceMultipliers();
  const breadTypes = Object.keys(multipliers);

  // Dynamically build value object from bread types (quantity + old_bread)
  const productionValue = breadTypes.reduce((acc, breadType) => {
    const quantity = latestProduction?.quantity?.[breadType] || 0;
    const oldBread = latestProduction?.old_bread?.[breadType] || 0;
    acc[breadType] = String(quantity + oldBread);
    return acc;
  }, {} as Record<string, string>);

  const date =
    (latestProduction?.created_at &&
      formatDate(latestProduction?.created_at)) ||
    0;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <Hero profile={profile}/>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricsCard
            title="Total Customer Debt"
            value={`₦${totalOutstanding}`}
            change="+12% from last week"
            changeType="negative"
            icon={DollarSign}
            description="Outstanding customer payments"
          />

          <ProductionCard
            title={`Latest Production - ${date}`}
            value={productionValue}
            multipliers={multipliers}
            total={`₦${latestProduction?.total}`}
            icon={Factory}
            description="Manufacturing output"
          />
        </div>

        {/* Charts and Tables Section */}
        <div className="lg:col-span-3 space-y-6 lg:px-6">
          <ProductionsTable />
          <CustomersTable />
        </div>
      </main>
    </div>
  );
};

export default Index;
