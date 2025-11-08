"use client";

import { useState } from "react";
import { BreadPrice, deleteBreadPrice } from "@/app/services/bread_price";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, LoaderCircle } from "lucide-react";
import { EditBreadPriceModal } from "./EditBreadPriceModal";
import { toast } from "sonner";

interface Props {
  id: number;
  price: number;
  color: string;
  onUpdate: (updatedPrice: BreadPrice) => void;
  onDelete: (deletedId: number) => void;
}

export const BreadPriceCard = ({
  id,
  price,
  onUpdate,
  onDelete,
  color,
}: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this price entry?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteBreadPrice(id);
      toast.success("Price entry deleted successfully");
      onDelete(id);
    } catch (error) {
      console.error("Error deleting price:", error);
      toast.error("Failed to delete price entry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Price Entry</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                disabled={isDeleting}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div
              className={`flex justify-between items-center p-3 rounded-md bg-${color}-200 dark:bg-${color}-900/20`}
            >
              <span className="font-medium">{color}</span>
              <span className="font-bold">{price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditBreadPriceModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        price={price}
        color={color}
        id={id}
        onSuccess={(updatedPrice) => {
          onUpdate(updatedPrice);
          setIsEditModalOpen(false);
        }}
      />
    </>
  );
};
