export default function Footer() {
  return (
    <footer className="mt-8 border-t bg-white px-6 py-4 text-center text-sm text-gray-500">
      <p>Meet buyers in public places on campus. Never pay before you see the item.</p>
      <div className="mt-2 flex justify-center gap-4">
        <a href="/safety" className="underline">Safety tips</a>
        <a href="/legal" className="underline">Terms and Privacy</a>
      </div>
    </footer>
  );
}