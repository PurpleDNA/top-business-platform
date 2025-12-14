import SalesCreateForm from "@/app/components/sales/SalesCreateForm";
import {
  getLast10Productions,
  getProductionById,
} from "@/app/services/productions";
import { fetchCustomerById } from "@/app/services/customers";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const page = async ({ searchParams }: Props) => {
  const searchQuery = await searchParams;
  const customer_id = searchQuery.customer_id;
  const production_id = searchQuery.production_id;
  const getL10Productions = async () => {
    return getLast10Productions();
  };
  let customer;
  let production;
  const productions = await getL10Productions();

  if (customer_id) {
    customer = await fetchCustomerById(customer_id);
  }
  if (production_id) {
    production = await getProductionById(production_id);
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%] ">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Sale🍞
        </h1>
        <SalesCreateForm
          productions={productions ?? undefined}
          customer={customer}
          production={production}
        />
      </div>
    </div>
  );
};

export default page;
