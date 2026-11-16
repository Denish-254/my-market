import NavBar from "@/components/NavBar";

export const metadata = { title: "Safety tips | My Market" };

export default function SafetyPage() {
  const tips = [
    "Meet in busy, public places on campus, like the library, cafeteria or main gate. Never in a hostel room or isolated spot.",
    "Go with a friend, and tell someone where you are going.",
    "Inspect the item properly before paying. Test electronics, check serial numbers and ask for the original receipt if there is one.",
    "Never pay a deposit or send money before you see the item or service.",
    "Be careful with prices that look too good to be true. They usually are.",
    "Use M-Pesa on the spot, after you have checked the item. Check the message you receive and do not accept screenshots as proof.",
    "Never share your PIN, password or M-Pesa codes with anyone, including people claiming to be from My Market.",
    "Use the Report button on any listing that looks fake, offensive or unsafe.",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-2xl p-6">
        <h2 className="mb-4 text-xl font-semibold">Safety tips</h2>
        <ul className="list-disc space-y-3 rounded-lg bg-white p-6 pl-10 shadow">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}