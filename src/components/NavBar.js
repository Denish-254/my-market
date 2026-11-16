"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const links = (
    <>
      <a href="/?type=Item" className="block py-2 md:py-0">Items</a>
      <a href="/?type=Service" className="block py-2 md:py-0">Services</a>
      <a href="/sell" className="block py-2 md:py-0">Sell</a>
      {user && <a href="/my-listings" className="block py-2 md:py-0">My listings</a>}
      {user ? (
        <button onClick={logout} className="block py-2 md:py-0">Log out</button>
      ) : (
        <a href="/login" className="block py-2 md:py-0">Log in</a>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-10 bg-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
         <img src="/logo.svg" alt="My Market logo" className="h-9 w-9" />
          <span className="text-xl font-bold text-green-700">My Market</span>
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="rounded border px-3 py-1 text-sm md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
        <div className="hidden items-center gap-5 text-sm font-medium md:flex">{links}</div>
      </div>
      {open && <div className="border-t px-4 pb-3 text-sm font-medium md:hidden">{links}</div>}
    </nav>
  );
}