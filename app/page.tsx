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

const Index = async () => {
  const totalOutstanding = await getTotalBusinessOutstanding();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6 space-y-6">
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

          <MetricsCard
            title="Today's Production"
            value="2,847 units"
            change="+5% from yesterday"
            changeType="positive"
            icon={Factory}
            description="Manufacturing output"
          />

          <MetricsCard
            title="Active Customers"
            value="1,286"
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
