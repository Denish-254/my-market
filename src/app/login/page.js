"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/NavBar";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("Please wait...");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return setMessage(error.message);
      if (data.session) {
        window.location.href = "/sell";
      } else {
        setMessage("Check your email to confirm your account, then log in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMessage(error.message);
      window.location.href = "/sell";
    }
  }

  const inputStyle = "w-full rounded border p-2";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-md p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {mode === "login" ? "Log in" : "Create your account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow">
          {mode === "signup" && (
            <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} required />
          <input type="password" placeholder="Password (at least 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyle} required minLength={6} />
          <button type="submit" className="w-full rounded bg-green-600 py-2 text-white">
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>
        {message && <p className="mt-4 rounded bg-green-100 p-3 text-green-800">{message}</p>}
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-sm text-green-700 underline"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </main>
    </div>
  );
}