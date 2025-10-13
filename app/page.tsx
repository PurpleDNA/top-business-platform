// import { SalesChart } from "./components/dashboard/SalesChart";
import { MetricsCard } from "./components/dashboard/MetricsCard";
import { CustomersTable } from "./components/dashboard/CustomersTable";
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

const Index = async () => {
  const totalOutstanding = await getTotalBusinessOutstanding();
  const customerCount = await getCustomerCount();
  const latestProduction = (await getLatestProduction()) as Production[];
  const date = formatDate(latestProduction[0]?.created_at);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <Hero />
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

          <MetricsCard
            title="Weekly Sales"
            value="$127,400"
            change="+18% from last week"
            changeType="positive"
            icon={TrendingUp}
            description="Revenue this week"
          />

          <ProductionCard
            title={`Latest Production - ${date}`}
            value={{
              orange: String(latestProduction[0]?.quantity?.orange),
              blue: String(latestProduction[0]?.quantity?.blue),
              green: String(latestProduction[0]?.quantity?.green),
            }}
            total={`₦${latestProduction[0]?.total}`}
            icon={Factory}
            description="Manufacturing output"
          />

          <MetricsCard
            title="Active Customers"
            value={String(customerCount)}
            change="+23 this week"
            changeType="positive"
            icon={Users}
            description="Current customer base"
          />

          <MetricsCard
            title="New Customers"
            value="47"
            change="+8 today"
            changeType="positive"
            icon={UserPlus}
            description="Recently added customers"
          />

          <MetricsCard
            title="Overdue Payments"
            value="$12,450"
            change="-$2,100 this week"
            changeType="positive"
            icon={TrendingDown}
            description="Pending collections"
          />
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* <SalesChart /> */}
            <CustomersTable />
          </div>

          <div className="space-y-6 cursor-pointer">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
