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
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteCustomerDialogProps {
  customerId: string;
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectOnDelete?: boolean;
}

export const DeleteCustomerDialog = ({
  customerId,
  customerName,
  open,
  onOpenChange,
  redirectOnDelete = false,
}: DeleteCustomerDialogProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/customers/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }),
      });

      const result = await response.json();

      if (result.status === "SUCCESS") {
        toast.success("Customer deleted successfully");
        onOpenChange(false);

        if (redirectOnDelete) {
          router.push("/customers/all");
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.error || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Customer</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{customerName}</span>
            ? This action cannot be undone. All associated sales, payments, and
            data will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
