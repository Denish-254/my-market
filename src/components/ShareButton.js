"use client";

export default function ShareButton({ title }) {
  function share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`, "_blank");
    }
  }

  return (
    <button onClick={share} className="mt-2 block w-full rounded border py-2 text-center text-sm">
      Share this listing
    </button>
  );
}