"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
type Species = Database["public"]["Tables"]["species"]["Row"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  species: Species;
};

export default function SpeciesDetailDialog({ open, onOpenChange, species }: Props) {
  const { scientific_name, common_name, total_population, kingdom, description, image } = species;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-baseline gap-2">
            <span className="italic">{scientific_name}</span>
            {common_name ? (
              <span className="text-muted-foreground font-normal">— {common_name}</span>
            ) : null}
          </DialogTitle>

          <DialogDescription asChild>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center rounded border px-2 py-0.5">
                {kingdom}
              </span>
              {typeof total_population === "number" ? (
                <span className="inline-flex items-center rounded border px-2 py-0.5">
                  Population: {total_population.toLocaleString()}
                </span>
              ) : null}
            </div>
          </DialogDescription>
        </DialogHeader>

        {image ? (
          
          <img src={image} alt={common_name ?? scientific_name} className="mt-2 w-full rounded-lg" />
        ) : null}

        {/* separator */}
        <div className="my-4 h-px w-full bg-border" />

        {/* scroll area */}
        <div className="max-h-[40vh] overflow-y-auto">
          {description ? (
            <p className="whitespace-pre-line leading-relaxed">{description}</p>
          ) : (
            <p className="text-muted-foreground">No description provided.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
