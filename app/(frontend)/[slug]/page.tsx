import { getPayload } from "payload";
import config from "@payload-config";
import { PageRenderer } from "@/components/PageRenderer";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    draft: preview === "true",
  });

  const page = docs[0];
  if (!page) return <main className="p-8">Página no encontrada.</main>;

  return <PageRenderer page={page} />;
}
