"use client";

import { useState } from "react";
import { BreadPrice, createBreadPrice } from "@/app/services/bread_price";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newPrice: BreadPrice) => void;
}

export const AddBreadPriceModal = ({ open, onOpenChange, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orange: "",
    blue: "",
    green: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orange || Number(formData.orange) <= 0) {
      newErrors.orange = "Orange price must be greater than 0";
    }
    if (!formData.blue || Number(formData.blue) <= 0) {
      newErrors.blue = "Blue price must be greater than 0";
    }
    if (!formData.green || Number(formData.green) <= 0) {
      newErrors.green = "Green price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBreadPrice({
        orange: Number(formData.orange),
        blue: Number(formData.blue),
        green: Number(formData.green),
      });

      toast.success("Bread price added successfully");
      onSuccess(result.data);

      // Reset form
      setFormData({ orange: "", blue: "", green: "" });
      setErrors({});
    } catch (error) {
      console.error("Error creating bread price:", error);
      toast.error("Failed to add bread price");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ orange: "", blue: "", green: "" });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Bread Price</DialogTitle>
          <DialogDescription>
            Set prices for all bread varieties. All prices are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="orange" className="text-sm font-medium mb-2 block">
                Orange Bread Price
              </label>
              <Input
                id="orange"
                type="number"
                placeholder="Enter price"
                value={formData.orange}
                onChange={(e) => handleChange("orange", e.target.value)}
                className="no-spinners"
                disabled={isSubmitting}
              />
              {errors.orange && (
                <p className="text-xs text-destructive mt-1">{errors.orange}</p>
              )}
            </div>

            <div>
              <label htmlFor="blue" className="text-sm font-medium mb-2 block">
                Blue Bread Price
              </label>
              <Input
                id="blue"
                type="number"
                placeholder="Enter price"
                value={formData.blue}
                onChange={(e) => handleChange("blue", e.target.value)}
                className="no-spinners"
                disabled={isSubmitting}
              />
              {errors.blue && (
                <p className="text-xs text-destructive mt-1">{errors.blue}</p>
              )}
            </div>

            <div>
              <label htmlFor="green" className="text-sm font-medium mb-2 block">
                Green Bread Price
              </label>
              <Input
                id="green"
                type="number"
                placeholder="Enter price"
                value={formData.green}
                onChange={(e) => handleChange("green", e.target.value)}
                className="no-spinners"
                disabled={isSubmitting}
              />
              {errors.green && (
                <p className="text-xs text-destructive mt-1">{errors.green}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Price"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
