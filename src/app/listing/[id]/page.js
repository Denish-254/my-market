import ShareButton from "@/components/ShareButton";
import Gallery from "@/components/Gallery";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavBar";
import ReportButton from "@/components/ReportButton";
import { toWhatsApp } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: item } = await supabase
    .from("listings")
    .select("title, price, description, image_url, images")
    .eq("id", id)
    .single();

  if (!item) return { title: "Listing not found | My Market" };

  const image = item.images?.[0] || item.image_url;
  const title = `${item.title} - KSh ${item.price.toLocaleString()}`;
  const description = item.description || "Available on My Market";

  return {
    title: `${title} | My Market`,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
  };
}

export default async function ListingPage({ params }) {
  const { id } = await params;
  const { data: item } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();
  const images = item.images?.length ? item.images : item.image_url ? [item.image_url] : [];

  const message = `Hi, I saw ${item.title} on My Market. Is it still available?`;
  const waLink = `https://wa.me/${toWhatsApp(item.phone)}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-2xl p-4">
        <a href="/" className="text-sm text-green-700 underline">← Back to listings</a>

        <div className="mt-3 overflow-hidden rounded-lg bg-white shadow">
          <Gallery images={images} title={item.title} />

          <div className="p-5">
            <div className="flex items-center gap-2">
              <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">{item.type}</span>
              {item.sold && <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">Sold</span>}
            </div>
            <h1 className="mt-2 text-2xl font-bold">{item.title}</h1>
            <p className="mt-1 text-xl font-bold text-green-700">KSh {item.price.toLocaleString()}</p>
            <p className="mt-1 text-sm text-gray-500">Seller: {item.seller}</p>

            {item.description && (
              <p className="mt-4 whitespace-pre-line text-gray-800">{item.description}</p>
            )}

            {!item.sold && (
              <a href={waLink} target="_blank" className="mt-5 block rounded bg-green-600 py-3 text-center font-medium text-white">
                Contact seller on WhatsApp
              </a>
            )}
            
            <ShareButton title={item.title} />
            <ReportButton listingId={item.id} />
            <p className="mt-3 text-center text-xs text-gray-500">
              Meet in a public place and pay only after checking the item.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}