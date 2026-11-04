import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const { type } = await searchParams;

  let query = supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (type === "Item" || type === "Service") {
    query = query.eq("type", type);
  }

  const { data: listings, error } = await query;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <a href="/" className="text-2xl font-bold text-green-600">My Market</a>
        <div className="flex gap-4 text-sm font-medium">
         <a href="/?type=Item">Items</a>
         <a href="/?type=Service">Services</a>
         <a href="/sell">Sell</a>
        </div>
      </nav>

      <main className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Latest on campus</h2>

        {error && <p className="text-red-600">Could not load listings: {error.message}</p>}
        {listings && listings.length === 0 && (
          <p className="text-gray-500">No listings yet. Be the first to sell something!</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings?.map((item) => (
            <div key={item.id} className="rounded-lg bg-white p-4 shadow">
              <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                {item.type}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="font-bold">KSh {item.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{item.seller}</p>
              <a
                href={`https://wa.me/${item.phone}?text=${encodeURIComponent(`Hi, I saw ${item.title} on My Market. Is it still available?`)}`}
                target="_blank"
                className="mt-3 block w-full rounded bg-green-600 py-2 text-center text-white"
              >
                Contact seller
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}