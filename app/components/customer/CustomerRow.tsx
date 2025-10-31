"use client";
import { Customer } from "@/app/services/customers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Phone, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

const getDebtStatusVariant = (hasDebt: boolean, totalDebt: number) => {
  if (!hasDebt || totalDebt === 0) {
    return "default";
  }
  if (totalDebt > 10000) {
    return "destructive";
  }
  return "secondary";
};
const getDebtStatusText = (hasDebt: boolean, totalDebt: number) => {
  if (!hasDebt || totalDebt === 0) {
    return "Debt Free";
  }
  if (totalDebt > 10000) {
    return "High Debt";
  }
  return "Active Debt";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CustomerRow = ({ customers }: { customers: Customer[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = customers.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Total Debt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((customer) => (
            <TableRow
              key={customer.id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() =>
                (window.location.href = `/customers/page/${customer.id}`)
              }
            >
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {customer.phone_number}
                </div>
              </TableCell>
              <TableCell className="font-semibold">
                {customer.total_debt > 0
                  ? `₦${customer.total_debt.toLocaleString()}`
                  : "₦0"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getDebtStatusVariant(
                    customer.has_debt,
                    customer.total_debt
                  )}
                >
                  {getDebtStatusText(customer.has_debt, customer.total_debt)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(customer.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add edit functionality here
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, customers.length)} of {customers.length} customers
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRow;
