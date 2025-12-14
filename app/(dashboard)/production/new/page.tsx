import ProductionFrom from "@/app/components/production/ProductionCreateFrom";
import { getBreadPriceMultipliers } from "@/app/services/bread_price";

const page = async () => {
  const multipliers = await getBreadPriceMultipliers();

  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%] ">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Production🍞
        </h1>
        <ProductionFrom multipliers={multipliers} />
      </div>
    </div>
  );
};

export default page;
