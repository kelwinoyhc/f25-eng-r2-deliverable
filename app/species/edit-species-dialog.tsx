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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Database } from "@/lib/schema";
type Species = Database["public"]["Tables"]["species"]["Row"];


const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  scientific_name: z.string().trim().min(1).transform(v => v.trim()),
  common_name: z.string().nullable().transform(v => (!v || v.trim() === "" ? null : v.trim())),
  kingdom: kingdoms,
  total_population: z.number().int().positive().min(1).nullable(),
  image: z.string().url().nullable().transform(v => (!v || v.trim() === "" ? null : v.trim())),
  description: z.string().nullable().transform(v => (!v || v.trim() === "" ? null : v.trim())),
});
type FormData = z.infer<typeof speciesSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  species: Species;
}

export default function EditSpeciesDialog({ open, onOpenChange, species }: Props) {
  const router = useRouter();

  
  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species.scientific_name ?? "",
      common_name: species.common_name ?? null,
      kingdom: species.kingdom as FormData["kingdom"],
      total_population: species.total_population ?? null,
      image: species.image ?? null,
      description: species.description ?? null,
    },
    mode: "onChange",
  });

  const onSubmit = async (input: FormData) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("species")
      .update({
        scientific_name: input.scientific_name,
        common_name: input.common_name,
        kingdom: input.kingdom,
        total_population: input.total_population,
        image: input.image,
        description: input.description,
      })
      .eq("id", species.id); 

    if (error) {
      return toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }

    onOpenChange(false);
    router.refresh();
    toast({
      title: "Species updated",
      description: `Saved changes to ${input.scientific_name}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>Update the fields and save your changes.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Cavia porcellus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="common_name"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Common Name</FormLabel>
                      <FormControl>
                        <Input value={value ?? ""} placeholder="Guinea pig" {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="kingdom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kingdom</FormLabel>
                    <Select onValueChange={(v) => field.onChange(kingdoms.parse(v))} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a kingdom" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {kingdoms.options.map((k) => (
                            <SelectItem key={k} value={k}>
                              {k}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_population"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Total population</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={value ?? ""}
                          placeholder="300000"
                          {...rest}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input value={value ?? ""} placeholder="https://..." {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea value={value ?? ""} placeholder="Add a description…" {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex">
                <Button type="submit" className="ml-1 mr-1 flex-auto">
                  Save changes
                </Button>
                <DialogClose asChild>
                  <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
