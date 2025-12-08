
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Tag } from "@/types/note";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  // Гарантуємо, що slug завжди масив
  const {slug}  = await params;
  const slugArray: string[] = Array.isArray(slug) ? slug : slug ? [slug] : ["all"];

  // Безпечне отримання тегу
  const tag: Tag | string = slugArray[0] === "all" ? "" : slugArray[0];

 
  const queryClient = new QueryClient();

  // Попереднє завантаження нотаток
  await queryClient.prefetchQuery({
   queryKey: ["notes", { search: "", category: tag, page: 1 }],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={tag} />
    </HydrationBoundary>
  );
}



