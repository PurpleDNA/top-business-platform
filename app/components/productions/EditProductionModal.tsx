"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Production, updateProduction } from "@/app/services/productions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditProductionModalProps {
  production: Production;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Modal = ({
  production,
  open,
  onOpenChange,
}: EditProductionModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity_orange: production.quantity.orange.toString(),
    quantity_blue: production.quantity.blue.toString(),
    quantity_green: production.quantity.green.toString(),
    old_bread_orange: production.old_bread.orange.toString(),
    old_bread_blue: production.old_bread.blue.toString(),
    old_bread_green: production.old_bread.green.toString(),
    cash: production.cash.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculate quantity
      const quantity = {
        orange: Number(formData.quantity_orange),
        blue: Number(formData.quantity_blue),
        green: Number(formData.quantity_green),
      };

      // Calculate old_bread
      const old_bread = {
        orange: Number(formData.old_bread_orange),
        blue: Number(formData.old_bread_blue),
        green: Number(formData.old_bread_green),
      };

      // Calculate remaining_bread: sum of quantity and old_bread for each color
      const remaining_bread = {
        orange: quantity.orange + old_bread.orange,
        blue: quantity.blue + old_bread.blue,
        green: quantity.green + old_bread.green,
      };

      const payload = {
        quantity,
        old_bread,
        remaining_bread,
        cash: Number(formData.cash),
      };

      const result = await updateProduction(production.id, payload);

      if (result.status === "SUCCESS") {
        toast.success("Production updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update production");
      }
    } catch (error) {
      console.error("Error updating production:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Production</DialogTitle>
          <DialogDescription>
            Update production quantities, old bread, and cash collected.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Quantity Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Production Quantity</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="quantity_orange" className="text-xs">
                    Orange
                  </Label>
                  <Input
                    id="quantity_orange"
                    type="number"
                    value={formData.quantity_orange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_orange: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity_blue" className="text-xs">
                    Blue
                  </Label>
                  <Input
                    id="quantity_blue"
                    type="number"
                    value={formData.quantity_blue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_blue: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity_green" className="text-xs">
                    Green
                  </Label>
                  <Input
                    id="quantity_green"
                    type="number"
                    value={formData.quantity_green}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity_green: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Old Bread Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Old Bread</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="old_bread_orange" className="text-xs">
                    Orange
                  </Label>
                  <Input
                    id="old_bread_orange"
                    type="number"
                    value={formData.old_bread_orange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        old_bread_orange: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="old_bread_blue" className="text-xs">
                    Blue
                  </Label>
                  <Input
                    id="old_bread_blue"
                    type="number"
                    value={formData.old_bread_blue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        old_bread_blue: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="old_bread_green" className="text-xs">
                    Green
                  </Label>
                  <Input
                    id="old_bread_green"
                    type="number"
                    value={formData.old_bread_green}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        old_bread_green: e.target.value,
                      })
                    }
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Cash Section */}
            <div className="grid gap-2">
              <Label htmlFor="cash">Cash Collected (₦)</Label>
              <Input
                id="cash"
                type="number"
                value={formData.cash}
                onChange={(e) =>
                  setFormData({ ...formData, cash: e.target.value })
                }
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
