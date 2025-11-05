"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePayment, Payment } from "@/app/services/payments";
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

interface EditPaymentModalProps {
  payment: {
    id: string;
    amount: number;
    type: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPaymentModal = ({
  payment,
  open,
  onOpenChange,
}: EditPaymentModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(payment.amount.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amountPaid = Number(amount);

      if (isNaN(amountPaid) || amountPaid <= 0) {
        toast.error("Please enter a valid amount");
        setLoading(false);
        return;
      }

      const result = await updatePayment(payment.id, { amountPaid });

      if (result.status === "SUCCESS") {
        toast.success("Payment updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter payment amount"
              required
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Payment Type:{" "}
              <span className="font-semibold capitalize">{payment.type}</span>
            </p>
            <p className="text-xs mt-1">
              {payment.type === "after"
                ? "This payment is distributed across multiple sales"
                : "This payment is linked to a specific sale"}
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
