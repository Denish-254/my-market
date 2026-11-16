"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavBar";

const MAX_PHOTOS = 5;

async function resizeImage(file, maxSize = 1000) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
}

export default function SellPage() {
  const empty = { title: "", price: "", type: "Item", seller: "", phone: "", description: "" };
  const [form, setForm] = useState(empty);
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecking(false);
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFiles(e) {
    const chosen = Array.from(e.target.files);
    const room = MAX_PHOTOS - photos.length;
    const added = chosen.slice(0, room).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos([...photos, ...added]);
    setStatus(chosen.length > room ? `You can add up to ${MAX_PHOTOS} photos.` : "");
    e.target.value = "";
  }

  function removePhoto(index) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Posting...");

    const urls = [];
    for (let i = 0; i < photos.length; i++) {
      setStatus(`Uploading photo ${i + 1} of ${photos.length}...`);
      const blob = await resizeImage(photos[i].file);
      const path = `${user.id}/${Date.now()}-${i}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) {
        return setStatus("Photo upload failed: " + uploadError.message);
      }
      urls.push(supabase.storage.from("listing-images").getPublicUrl(path).data.publicUrl);
    }

    const { error } = await supabase.from("listings").insert({
      title: form.title,
      price: Number(form.price),
      type: form.type,
      seller: form.seller,
      phone: form.phone,
      description: form.description,
      image_url: urls[0] || null,
      images: urls,
    });

    if (error) {
      setStatus("Something went wrong: " + error.message);
    } else {
      setStatus("Listing posted! Check the home page.");
      setForm(empty);
      setPhotos([]);
    }
  }

  const inputStyle = "w-full rounded border p-2";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-md p-6">
        <h2 className="mb-4 text-xl font-semibold">Sell an item or offer a service</h2>

        {checking ? (
          <p className="text-gray-500">Loading...</p>
        ) : !user ? (
          <div className="rounded-lg bg-white p-4 shadow">
            <p className="mb-3">Please log in to post a listing.</p>
            <a href="/login" className="block rounded bg-green-600 py-2 text-center text-white">
              Log in or sign up
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow">
            <input name="title" placeholder="What are you selling?" value={form.title} onChange={handleChange} className={inputStyle} required />
            <textarea name="description" placeholder="Describe it: condition, size, where to meet..." value={form.description} onChange={handleChange} className={inputStyle} rows={3} />
            <input name="price" type="number" placeholder="Price (KSh)" value={form.price} onChange={handleChange} className={inputStyle} required />
            <select name="type" value={form.type} onChange={handleChange} className={inputStyle}>
              <option>Item</option>
              <option>Service</option>
            </select>
            <input name="seller" placeholder="Your name and year (e.g. Brian, Year 3)" value={form.seller} onChange={handleChange} className={inputStyle} required />
            <input name="phone" placeholder="WhatsApp number (07... or 2547...)" value={form.phone} onChange={handleChange} className={inputStyle} required />

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Photos ({photos.length}/{MAX_PHOTOS}). The first one is the cover.
              </label>
              <p className="mb-2 text-xs text-gray-500">
                Tip: show the front, back, sides, ports and any damage.
              </p>

              {photos.length > 0 && (
                <div className="mb-2 grid grid-cols-3 gap-2">
                  {photos.map((p, i) => (
                    <div key={p.preview} className="relative">
                      <img src={p.preview} alt={`Photo ${i + 1}`} className="h-24 w-full rounded object-cover" />
                      {i === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-green-600 px-1 text-xs text-white">Cover</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute right-1 top-1 h-6 w-6 rounded-full bg-red-600 text-sm text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length < MAX_PHOTOS && (
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="w-full text-sm" />
              )}
            </div>

            <button type="submit" className="w-full rounded bg-green-600 py-2 text-white">
              Post listing
            </button>
          </form>
        )}

        {status && <p className="mt-4 rounded bg-green-100 p-3 text-green-800">{status}</p>}
      </main>
    </div>
  );
}