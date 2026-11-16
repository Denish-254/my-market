import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavBar";
import ReportButton from "@/components/ReportButton";
import { toWhatsApp } from "@/lib/phone";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const { type, q, sort } = await searchParams;

  let query = supabase.from("listings").select("*").eq("sold", false);

  if (type === "Item" || type === "Service") {
    query = query.eq("type", type);
  }
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: listings, error } = await query;

  const pill = (active) =>
    `rounded-full px-4 py-1 text-sm font-medium ${
      active ? "bg-green-600 text-white" : "bg-white text-gray-700 shadow"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <section className="bg-green-600 px-4 py-8 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold sm:text-3xl">Buy, sell and find services on campus</h1>
          <p className="mt-1 text-green-100">From students, for students.</p>
          <form action="/" className="mt-4 flex flex-col gap-2 sm:flex-row">
            {type && <input type="hidden" name="type" value={type} />}
            <input
              name="q"
              defaultValue={q || ""}
              placeholder="Search items and services..."
              className="flex-1 rounded p-3 text-gray-900"
            />
            <select name="sort" defaultValue={sort || "newest"} className="rounded p-3 text-gray-900">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
            <button type="submit" className="rounded bg-gray-900 px-5 py-3 font-medium text-white">
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-5xl p-4">
        <div className="mb-4 flex gap-2">
          <a href="/" className={pill(!type)}>All</a>
          <a href="/?type=Item" className={pill(type === "Item")}>Items</a>
          <a href="/?type=Service" className={pill(type === "Service")}>Services</a>
        </div>

        {error && <p className="text-red-600">Could not load listings: {error.message}</p>}
        {listings && listings.length === 0 && (
          <p className="text-gray-500">
            {q ? `No results for "${q}".` : "No listings yet. Be the first to sell something!"}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings?.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg bg-white shadow">
              <a href={`/listing/${item.id}`}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
                    No photo
                  </div>
                )}
              </a>
              <div className="p-4">
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">{item.type}</span>
                <a href={`/listing/${item.id}`}>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                </a>
                <p className="font-bold text-green-700">KSh {item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{item.seller}</p>
                <a
                  href={`https://wa.me/${toWhatsApp(item.phone)}?text=${encodeURIComponent(`Hi, I saw ${item.title} on My Market. Is it still available?`)}`}
                  target="_blank"
                  className="mt-3 block w-full rounded bg-green-600 py-2 text-center text-white"
                >
                  Contact seller
                </a>
                <ReportButton listingId={item.id} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}