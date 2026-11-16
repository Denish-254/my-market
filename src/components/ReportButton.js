"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportButton({ listingId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Scam or fake listing");
  const [msg, setMsg] = useState("");

  async function submit() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      window.location.href = "/login";
      return;
    }
    const { error } = await supabase.from("reports").insert({ listing_id: listingId, reason });
    if (error) {
      setMsg(error.code === "23505" ? "You already reported this listing." : "Could not send report.");
    } else {
      setMsg("Thanks, we'll review it.");
    }
    setOpen(false);
  }

  return (
    <div className="mt-2 text-center">
      {msg ? (
        <p className="text-xs text-gray-500">{msg}</p>
      ) : open ? (
        <div className="space-y-2">
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded border p-1 text-sm">
            <option>Scam or fake listing</option>
            <option>Prohibited item or service</option>
            <option>Offensive content</option>
            <option>Wrong category or spam</option>
          </select>
          <div className="flex gap-2">
            <button onClick={submit} className="flex-1 rounded bg-red-600 py-1 text-sm text-white">Send report</button>
            <button onClick={() => setOpen(false)} className="flex-1 rounded border py-1 text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="text-xs text-gray-500 underline">Report listing</button>
      )}
    </div>
  );
}