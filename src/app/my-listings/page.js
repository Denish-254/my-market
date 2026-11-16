"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavBar";

export default function MyListingsPage() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
      if (userData.user) {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false });
        if (error) setMessage(error.message);
        else setListings(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function toggleSold(item) {
    const { error } = await supabase
      .from("listings")
      .update({ sold: !item.sold })
      .eq("id", item.id);
    if (error) return setMessage(error.message);
    setListings(listings.map((l) => (l.id === item.id ? { ...l, sold: !l.sold } : l)));
  }

  async function removeListing(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    const { error } = await supabase.from("listings").delete().eq("id", item.id);
    if (error) return setMessage(error.message);
    setListings(listings.filter((l) => l.id !== item.id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold">My listings</h2>

        {message && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{message}</p>}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !user ? (
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="mb-3">Please log in to see your listings.</p>
            <a href="/login" className="block rounded bg-green-600 py-2 text-center text-white">
              Log in
            </a>
          </div>
        ) : listings.length === 0 ? (
          <p className="text-gray-500">
            You haven't posted anything yet. <a href="/sell" className="text-green-700 underline">Post your first listing</a>
          </p>
        ) : (
          <div className="space-y-3">
            {listings.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg bg-white p-3 shadow">
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="h-24 w-24 rounded object-cover" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.sold && (
                      <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">Sold</span>
                    )}
                  </div>
                  <p className="text-sm font-bold">KSh {item.price.toLocaleString()}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => toggleSold(item)}
                      className="rounded border px-3 py-1 text-sm"
                    >
                      {item.sold ? "Mark as available" : "Mark as sold"}
                    </button>
                    <button
                      onClick={() => removeListing(item)}
                      className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}