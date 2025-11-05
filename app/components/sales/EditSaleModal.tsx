"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSale, Sale } from "@/app/services/sales";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditSaleModalProps {
  sale: {
    id: string;
    amount: number;
    amount_paid: number;
    outstanding: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditSaleModal = ({
  sale,
  open,
  onOpenChange,
}: EditSaleModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: sale.amount.toString(),
    amount_paid: sale.amount_paid.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = Number(formData.amount);
      const amountPaid = Number(formData.amount_paid);

      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        setLoading(false);
        return;
      }

      if (isNaN(amountPaid) || amountPaid < 0) {
        toast.error("Please enter a valid amount paid");
        setLoading(false);
        return;
      }

      if (amountPaid > amount) {
        toast.error("Amount paid cannot exceed total amount");
        setLoading(false);
        return;
      }

      const payload: Partial<Sale> = {
        amount,
        amount_paid: amountPaid,
        outstanding: amount - amountPaid,
        paid: amountPaid >= amount,
      };

      const result = await updateSale(sale.id, payload);

      if (result.status === "SUCCESS") {
        toast.success("Sale updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update sale");
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Sale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Enter total amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount_paid">Amount Paid</Label>
            <Input
              id="amount_paid"
              type="number"
              value={formData.amount_paid}
              onChange={(e) =>
                setFormData({ ...formData, amount_paid: e.target.value })
              }
              placeholder="Enter amount paid"
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Outstanding:{" "}
              <span className="font-semibold">
                ₦
                {(
                  Number(formData.amount) - Number(formData.amount_paid)
                ).toLocaleString()}
              </span>
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
