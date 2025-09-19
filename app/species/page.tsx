// ----IMPORT----
// UI Features
import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
// allow construction of server side supabase client that let server compoenent to read current user information
import { createServerSupabaseClient } from "@/lib/server-utils";
// for user url navigation
import { redirect } from "next/navigation";
// use to add species details and cards
import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";

// ----Server Component Definition----
export default async function SpeciesList() {
  // Create supabase server component client and read user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // page protection: only users who sing in can access the page
  if (!session) {
    redirect("/");
  }

  // Getting the user ID --> will allow for later edit/delete feature
  const sessionId = session.user.id;

  // Retrieving the rows of data from SQL using superbase 
  const { data: species } = await supabase.from("species").select("*").order("id", { ascending: false });

  // Webpage redering process --> with html code
  return (
    <>
      {/*Header creation */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog userId={sessionId} />
      </div>
      <Separator className="my-4" />

      {/*Card grid creations, one card for each row of data(one species)*/}
      <div className="flex flex-wrap justify-center">
        {species?.map((s) => (
          // ← add sessionId so that the ownership of the card can be checked
    <SpeciesCard key={s.id} species={s} sessionId={sessionId} />  ))}
      </div>
    </>
  );
}
