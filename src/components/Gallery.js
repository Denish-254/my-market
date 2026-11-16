"use client";

import { useState } from "react";

export default function Gallery({ images, title }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
        No photo
      </div>
    );
  }

  return (
    <div>
      <img
        src={images[active]}
        alt={title}
        className="max-h-96 w-full bg-gray-100 object-contain"
      />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                i === active ? "border-green-600" : "border-transparent"
              }`}
            >
              <img src={url} alt={`${title} photo ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}