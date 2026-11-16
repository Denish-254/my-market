import NavBar from "@/components/NavBar";

export const metadata = { title: "Terms and Privacy | My Market" };

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-2xl space-y-4 p-6">
        <h2 className="text-xl font-semibold">Terms of use</h2>
        <div className="space-y-3 rounded-lg bg-white p-6 shadow">
          <p>My Market is a platform where students list items and services. We do not sell anything ourselves and we are not part of any deal between buyer and seller.</p>
          <p>You agree to post only items and services that are yours to sell, that are legal in Kenya, and that are described honestly.</p>
          <p>Not allowed: stolen goods, weapons, drugs, counterfeit items, exam papers or cheating services, adult content, and anything that harms or deceives others.</p>
          <p>We may remove any listing or account that breaks these rules or is reported by other users.</p>
          <p>Buyers and sellers deal at their own risk. Please read our safety tips before meeting anyone.</p>
        </div>

        <h2 className="text-xl font-semibold">Privacy</h2>
        <div className="space-y-3 rounded-lg bg-white p-6 shadow">
          <p>When you sign up we store your name, email and password (the password is stored securely, and we cannot read it).</p>
          <p>When you post a listing, the title, price, photo, your name and your WhatsApp number are stored and shown to people who visit the site, so buyers can contact you.</p>
          <p>We do not sell your personal information. We use it only to run the marketplace.</p>
          <p>To delete a listing, use the My listings page. To delete your account or data, contact us at: vicnux1@gmail.com</p>
        </div>

        <p className="text-sm text-gray-500">Last updated: November 2026</p>
      </main>
    </div>
  );
}