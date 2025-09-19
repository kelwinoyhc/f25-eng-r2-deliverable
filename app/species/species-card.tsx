"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import * as React from "react";                   
// For the UI button design
import { Button } from "@/components/ui/button";
// supabse data rows 
import type { Database } from "@/lib/schema";
// better image look (resize)
import Image from "next/image";
// Three dialogs: display, edit, delete
import SpeciesDetailDialog from "./species-detail-dialog";  
import EditSpeciesDialog from "./edit-species-dialog";      
import DeleteSpeciesDialog from "./delete-species-dialog";  

//
type Species = Database["public"]["Tables"]["species"]["Row"];

// receive the data row and user id
export default function SpeciesCard({ species, sessionId, }: { species: Species; sessionId: string; }) {
  //dialoge states
  const [open, setOpen] = React.useState(false); 
  const [editOpen, setEditOpen] = React.useState(false);      
  const [deleteOpen, setDeleteOpen] = React.useState(false);  
  // edit authority check
  const canEdit = species.author === sessionId;                


  return (
    // style formatting
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {/*image rendering */}
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      {/*Name, scientific name and shortened description display*/}  
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>

      {/* ----Buttons---- */}
      {/* Tree columns of button*/}
      <div className="mt-3 grid grid-cols-3 gap-2">    
        {/*Learn More button*/}         
        <Button className="w-full" variant="secondary" onClick={() => setOpen(true)}>
          Learn More
        </Button>

        {/*check if there is the authority*/}
        {canEdit ? (   
          <>
          {/* Edit&delete button*/}                                      
          <Button className="w-full" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button className="w-full" variant="destructive" onClick={() => setDeleteOpen(true)}> {/*← ADD*/}
            Delete
          </Button>
          </>
        ) : (
          <>
          {/* if no authority, disable the buttons */}
          <Button className="w-full" disabled title="Only the author can edit">
            Edit
          </Button>
          <Button className="w-full" disabled title="Only the author can delete">
            Delete
          </Button>
          </>
        )}
      </div>

      {/* dialogs */}
      <SpeciesDetailDialog open={open} onOpenChange={setOpen} species={species} />
      {canEdit && (      
        <>
          <EditSpeciesDialog open={editOpen} onOpenChange={setEditOpen} species={species} />
          <DeleteSpeciesDialog open={deleteOpen} onOpenChange={setDeleteOpen} species={species} /> {/* ← ADD */}
        </>                                        
        
      )}
    </div>
  );
}

