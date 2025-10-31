"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface OutstandingItem {
  customer_id: string;
  customer_name: string;
  outstanding?: number;
  paid?: boolean;
  amount?: number;
}

interface OutstandingDropdownProps {
  title: string;
  data: OutstandingItem[];
  itemsPerPage?: number;
}

export const OutstandingDropdown = ({
  title,
  data,
  itemsPerPage = 10,
}: OutstandingDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  // Calculate total amount
  const totalAmount = data.reduce((sum, item) => {
    const amount = item.amount || item.outstanding || 0;
    return sum + amount;
  }, 0);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card>
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? "item" : "items"}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items to display</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {currentItems.map((item, index) => (
                  <Link
                    href={`/customers/page/${item.customer_id}`}
                    key={startIndex + index}
                  >
                    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 border transition-colors cursor-pointer">
                      <span className="font-medium hover:text-primary">
                        {item.customer_name}
                      </span>
                      <span
                        className={`font-semibold ${
                          item.paid && "text-green-500"
                        }`}
                      >
                        ₦
                        {item.amount
                          ? item.amount.toLocaleString()
                          : item.outstanding?.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
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
              )}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-bold text-lg">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};
