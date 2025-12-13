"use client";

import { useState } from "react";
import { BreadPrice } from "@/app/services/bread_price";
import { BreadPriceCard } from "./BreadPriceCard";
import { AddBreadPriceModal } from "./AddBreadPriceModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  initialPrices: BreadPrice[];
}

export const BreadPriceList = ({ initialPrices, canManage }: { initialPrices: BreadPrice[], canManage: boolean }) => {
  const [prices, setPrices] = useState<BreadPrice[]>(initialPrices);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handlePriceAdded = (newPrice: BreadPrice) => {
    setPrices([newPrice, ...prices]);
    setIsAddModalOpen(false);
  };

  const handlePriceUpdated = (updatedPrice: BreadPrice) => {
    setPrices(
      prices.map((price) =>
        price.id === updatedPrice.id ? updatedPrice : price
      )
    );
  };

  const handlePriceDeleted = (deletedId: number) => {
    setPrices(prices.filter((price) => price.id !== deletedId));
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {prices.length} price {prices.length === 1 ? "entry" : "entries"}
        </p>
        
        {canManage && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Price
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prices.map((price) => (
          <BreadPriceCard
            key={price.id}
            id={price.id}
            price={price.price}
            color={price.color}
            onUpdate={handlePriceUpdated}
            onDelete={handlePriceDeleted}
            readOnly={!canManage} 
          />
        ))}
      </div>

      {prices.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No bread prices yet</p>
          {canManage && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Price
            </Button>
          )}
        </div>
      )}

      <AddBreadPriceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handlePriceAdded}
      />
    </div>
  );
};
