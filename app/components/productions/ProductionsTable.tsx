"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Production } from "@/app/services/productions";
import { useState } from "react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProductionsTable = ({ productions }: { productions: Production[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(productions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductions = productions.slice(startIndex, endIndex);

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
              <TableHead>Date</TableHead>
              <TableHead>Quantities</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProductions.map((production) => (
              <TableRow
                key={production.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/production/page/${production.id}`)
                }
              >
                <TableCell className="font-medium">
                  {formatDate(production.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {production.quantity.orange > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-200 text-orange-900 dark:bg-orange-500/20 dark:text-orange-400"
                      >
                        O: {production.quantity.orange}
                      </Badge>
                    )}
                    {production.quantity.blue > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-200 text-blue-900 dark:bg-blue-500/20 dark:text-blue-400"
                      >
                        B: {production.quantity.blue}
                      </Badge>
                    )}
                    {production.quantity.green > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-900 dark:bg-green-500/20 dark:text-green-400"
                      >
                        G: {production.quantity.green}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  ₦{production.total.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add view functionality here if needed
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
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
            Showing {startIndex + 1} to {Math.min(endIndex, productions.length)} of {productions.length} productions
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

export default ProductionsTable;
