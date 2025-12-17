"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MoreVertical, ShoppingCart, X, Edit, Trash2 } from "lucide-react";
import { ProductionToggle } from "./ProductionToggle";
import { ExpenseModal } from "./ExpenseModal";
import { Production } from "@/app/services/productions";
import { EditProductionModal } from "@/app/components/productions/EditProductionModal";
import { DeleteProductionDialog } from "@/app/components/productions/DeleteProductionDialog";

interface ProductionActionsProps {
  productionId: string;
  initialOpenStatus: boolean;
  production: Production;
  isSuper: boolean;
}

export const ProductionActions = ({
  productionId,
  initialOpenStatus,
  production,
  isSuper,
}: ProductionActionsProps) => {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isDesktop) {
    return (
      <>
        <div className="flex items-center gap-3">
          {/* <Link
            href={{
              pathname: "/sale/new",
              query: { production_id: productionId },
            }}
          >
            <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition">
              New Sale
            </button>
          </Link> */}
          <ExpenseModal productionId={productionId} />
          {/* <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-muted border border-border hover:bg-accent transition">
            Export
          </button> */}
          <button
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-muted border border-border hover:bg-accent transition"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 text-destructive transition"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          {isSuper && (
            <ProductionToggle
              productionId={productionId}
              initialOpenStatus={initialOpenStatus}
            />
          )}
        </div>

        <EditProductionModal
          production={production}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
        />

        <DeleteProductionDialog
          productionId={productionId}
          productionDate={formatDate(production.created_at)}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          redirectOnDelete={true}
        />
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="relative flex items-center justify-center">
            <DrawerTitle>Production Actions</DrawerTitle>
            <DrawerClose asChild>
              <X className="absolute right-4 cursor-pointer" />
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-3 flex-col flex">
            {/* <Link
              href={{
                pathname: "/sale/new",
                query: { production_id: productionId },
              }}
              onClick={() => setOpen(false)}
              className="block"
            >
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <ShoppingCart className="h-4 w-4" />
                New Sale
              </Button>
            </Link> */}
            <ExpenseModal productionId={productionId} />
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                setOpen(false);
                setEditModalOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
              Edit Production
            </Button>
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={() => {
                setOpen(false);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete Production
            </Button>
            {/* <button className="w-full inline-flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-md bg-muted border border-border hover:bg-accent transition">
              Export
            </button> */}
            {isSuper && (
              <ProductionToggle
                productionId={productionId}
                initialOpenStatus={initialOpenStatus}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <EditProductionModal
        production={production}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteProductionDialog
        productionId={productionId}
        productionDate={formatDate(production.created_at)}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        redirectOnDelete={true}
      />
    </>
  );
};
