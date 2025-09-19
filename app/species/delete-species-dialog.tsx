"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function DeleteSpeciesDialog({
  open,
  onOpenChange,
  species,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  species: Species;
}) {
  const router = useRouter();

  const onDelete = async () => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("species")
      .delete()
      .eq("id", species.id);

    if (error) {
      return toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }

    onOpenChange(false);
    router.refresh();
    toast({
      title: "Species deleted",
      description: `${species.scientific_name} has been removed.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete species?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold italic">
              {species.scientific_name}
            </span>{" "}
            from the database.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              void onDelete();
            }}
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
