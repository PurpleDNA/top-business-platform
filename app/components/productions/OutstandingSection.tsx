import {
  getProductionOutstanding,
  getProductionPaidOutstanding,
} from "@/app/services/productions";
import { OutstandingDropdown } from "./OutstandingDropdown";

interface OutstandingSectionProps {
  productionId: string;
}

export const OutstandingSection = async ({
  productionId,
}: OutstandingSectionProps) => {
  const outstanding = (await getProductionOutstanding(productionId)) || [];
  const paidOutstanding =
    (await getProductionPaidOutstanding(productionId)) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <OutstandingDropdown title="Outstanding" data={outstanding} />
      <OutstandingDropdown title="Paid Outstanding" data={paidOutstanding} />
    </div>
  );
};
