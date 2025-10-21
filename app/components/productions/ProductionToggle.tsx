"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleProdStatus } from "@/app/services/productions";
import { useRouter } from "next/navigation";
import { Lock, LockOpen, Loader2 } from "lucide-react";

interface ProductionToggleProps {
  productionId: string;
  initialOpenStatus: boolean;
}

export const ProductionToggle = ({
  productionId,
  initialOpenStatus,
}: ProductionToggleProps) => {
  const [isOpen, setIsOpen] = useState(initialOpenStatus);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    // Prevent duplicate requests
    if (isLoading || isPending) return;

    setIsLoading(true);

    try {
      const result = await toggleProdStatus(productionId);

      if (result.status === "SUCCESS") {
        // Optimistically update the UI (only if newStatus is defined)
        if (typeof result.newStatus === "boolean") {
          setIsOpen(result.newStatus);
        } else {
          console.warn(
            "toggleProdStatus returned undefined newStatus, skipping optimistic update."
          );
        }

        // Refresh the page data
        startTransition(() => {
          router.refresh();
        });
      } else {
        console.error("Toggle failed:", result.error);
        // Optionally show error toast/notification
      }
    } catch (error) {
      console.error("Unexpected error toggling production status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || isPending;

  return (
    <Button
      onClick={handleToggle}
      disabled={isDisabled}
      variant={isOpen ? "default" : "outline"}
      className={`inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md transition ${
        isOpen
          ? "bg-green-500 hover:bg-green-400 text-white"
          : "bg-neutral-900/70 border border-white/10 hover:bg-neutral-900 hover:border-white/20"
      }`}
    >
      {isDisabled ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isOpen ? (
        <LockOpen className="h-4 w-4" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
      {isOpen ? "Open" : "Closed"}
    </Button>
  );
};
