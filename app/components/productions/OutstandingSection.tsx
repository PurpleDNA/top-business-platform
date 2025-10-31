import { OutstandingDropdown } from "./OutstandingDropdown";

interface OutstandingItem {
  customer_id: string;
  customer_name: string;
  outstanding: number;
  paid: boolean;
}
interface POItem {
  customer_id: string;
  customer_name: string;
  amount: number;
}

interface OutstandingSectionProps {
  outstanding: OutstandingItem[];
  paidOutstanding: POItem[];
}

export const OutstandingSection = ({
  outstanding,
  paidOutstanding,
}: OutstandingSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <OutstandingDropdown title="Outstanding" data={outstanding} />
      <OutstandingDropdown title="Paid Outstanding" data={paidOutstanding} />
    </div>
  );
};
