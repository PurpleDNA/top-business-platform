"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedLabel = useMemo(() => {
    return options.find((opt) => opt.value === value)?.label || placeholder;
  }, [options, value, placeholder]);

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            " min-w-[14rem] w-max justify-between items-center font-normal px-3",
            className
          )}
        >
          {selectedLabel}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-[8rem] p-0"
        align="start"
      >
        <div className="flex items-center border-b p-3" cmdk-input-wrapper="">
          <Input
            placeholder="Search..."
            className="flex h-11 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0 p-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            // Prevent auto-focus stealing if needed, typically Input works fine here
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden py-1">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => {
                  onValueChange(option.value);
                  setOpen(false);
                  setSearchTerm("");
                }}
                className={cn(
                  "cursor-pointer",
                  value === option.value && "bg-accent text-accent-foreground"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
