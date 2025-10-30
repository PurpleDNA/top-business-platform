"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";
import { Production } from "@/app/services/productions";
import Link from "next/link";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const RecentProductionsTable = ({
  productions,
}: {
  productions: Production[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="hidden lg:table-cell">Orange</TableHead>
          <TableHead className="hidden lg:table-cell">Blue</TableHead>
          <TableHead className="hidden lg:table-cell">Green</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productions.map((production) => (
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
            <TableCell className="text-muted-foreground hidden lg:table-cell">
              {production.quantity.orange.toLocaleString()}
            </TableCell>
            <TableCell className="text-muted-foreground hidden lg:table-cell">
              {production.quantity.blue.toLocaleString()}
            </TableCell>
            <TableCell className="text-muted-foreground hidden lg:table-cell">
              {production.quantity.green.toLocaleString()}
            </TableCell>
            <TableCell className="font-semibold">
              ₦{production.total.toLocaleString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem asChild>
                    <Link href={`/production/page/${production.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Production
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentProductionsTable;
