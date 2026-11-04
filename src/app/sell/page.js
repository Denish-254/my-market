"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SellPage() {
  const empty = { title: "", price: "", type: "Item", seller: "", phone: "" };
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Posting...");
    const { error } = await supabase.from("listings").insert({
      title: form.title,
      price: Number(form.price),
      type: form.type,
      seller: form.seller,
      phone: form.phone,
    });
    if (error) {
      setStatus("Something went wrong: " + error.message);
    } else {
      setStatus("Listing posted! Check the home page.");
      setForm(empty);
    }
  }

  const inputStyle = "w-full rounded border p-2";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <a href="/" className="text-2xl font-bold text-green-600">My Market</a>
        <a href="/" className="text-sm font-medium">Back to home</a>
      </nav>

      <main className="mx-auto max-w-md p-6">
        <h2 className="mb-4 text-xl font-semibold">Sell an item or offer a service</h2>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow">
          <input name="title" placeholder="What are you selling?" value={form.title} onChange={handleChange} className={inputStyle} required />
          <input name="price" type="number" placeholder="Price (KSh)" value={form.price} onChange={handleChange} className={inputStyle} required />
          <select name="type" value={form.type} onChange={handleChange} className={inputStyle}>
            <option>Item</option>
            <option>Service</option>
          </select>
          <input name="seller" placeholder="Your name and year (e.g. Brian, Year 3)" value={form.seller} onChange={handleChange} className={inputStyle} required />
          <input name="phone" placeholder="WhatsApp number (2547...)" value={form.phone} onChange={handleChange} className={inputStyle} required />
          <button type="submit" className="w-full rounded bg-green-600 py-2 text-white">
            Post listing
          </button>
        </form>

        {status && <p className="mt-4 rounded bg-green-100 p-3 text-green-800">{status}</p>}
      </main>
    </div>
  );
}