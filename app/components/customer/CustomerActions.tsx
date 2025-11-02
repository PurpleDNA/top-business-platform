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
import {
  MoreVertical,
  DollarSign,
  ShoppingCart,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { Customer } from "@/app/services/customers";
import { EditCustomerModal } from "@/app/components/customer/EditCustomerModal";
import { DeleteCustomerDialog } from "@/app/components/customer/DeleteCustomerDialog";

interface CustomerActionsProps {
  customerId: string;
  customer: Customer;
}

export const CustomerActions = ({
  customerId,
  customer,
}: CustomerActionsProps) => {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-muted border border-border hover:bg-accent transition">
            Export
          </button>
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
          <Link
            href={{ pathname: "/sale/new", query: { customer_id: customerId } }}
          >
            <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition">
              New Sale
            </button>
          </Link>
          <Link
            href={{
              pathname: "/payment/new",
              query: { customer_id: customerId },
            }}
          >
            <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition">
              New Payment
            </button>
          </Link>
        </div>

        <EditCustomerModal
          customer={customer}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
        />

        <DeleteCustomerDialog
          customerId={customerId}
          customerName={customer.name}
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
            <DrawerTitle>Customer Actions</DrawerTitle>
            <DrawerClose asChild>
              <X className="absolute right-4 cursor-pointer" />
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-3">
            <Link
              href={{
                pathname: "/sale/new",
                query: { customer_id: customerId },
              }}
              onClick={() => setOpen(false)}
              className="block"
            >
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <ShoppingCart className="h-4 w-4" />
                New Sale
              </Button>
            </Link>
            <Link
              href={{
                pathname: "/payment/new",
                query: { customer_id: customerId },
              }}
              onClick={() => setOpen(false)}
              className="block"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
                <DollarSign className="h-4 w-4" />
                New Payment
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                setOpen(false);
                setEditModalOpen(true);
              }}
            >
              <Edit className="h-4 w-4" />
              Edit Customer
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
              Delete Customer
            </Button>
            <button className="w-full inline-flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-md bg-muted border border-border hover:bg-accent transition">
              Export
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      <EditCustomerModal
        customer={customer}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <DeleteCustomerDialog
        customerId={customerId}
        customerName={customer.name}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        redirectOnDelete={true}
      />
    </>
  );
};
