import Navbar from "@/components/Navbar";
import NoticeBar from "@/components/NoticeBar";
import HomePopup from "@/components/HomePopup";
import ChatWidget from "@/components/ChatWidget";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomePopup />
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-primary">
        <Navbar />
        <NoticeBar />
      </header>
      <main className="pt-[80px] md:pt-[100px]">{children}</main>

      <footer className="bg-primary text-white py-20 px-6 border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-heading font-bold mb-2">SKP SAINIK <span className="text-gold-500">PUBLIC SCHOOL</span></h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Affil. No. 2131950 | CBSE Board</p>
            <p className="text-white/60 max-w-sm mb-4">
              <a href="https://www.google.com/maps/search/?api=1&query=SKP+Sainik+Public+School+Manihari+Deoria"
                target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors" title="View on Google Maps">
                Village Manihari, Deoria, Uttar Pradesh, India.
              </a>
            </p>
            <div className="space-y-1 text-sm text-white/50">
              <p>📞 <a href="tel:9454331861" className="hover:text-gold-500 transition-colors">9454331861</a> | <a href="tel:8449790561" className="hover:text-gold-500 transition-colors">8449790561</a></p>
              <p>✉️ <a href="mailto:skpspsmanihari09@gmail.com" className="hover:text-gold-500 transition-colors">skpspsmanihari09@gmail.com</a></p>
              <p>🕐 Mon – Sat: 9:00 AM – 4:00 PM</p>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-gold-500 mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-white/70 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/principal" className="hover:text-white transition-colors">Principal&apos;s Desk</a></li>
              <li><a href="/toppers" className="hover:text-white transition-colors">Hall of Fame</a></li>
              <li><a href="/rules" className="hover:text-white transition-colors">Rules &amp; Regulations</a></li>
              <li><a href="/fees" className="hover:text-white transition-colors">Fee Structure</a></li>
              <li><a href="/admission" className="hover:text-white transition-colors">Admissions</a></li>
              <li><a href="/gallery" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="/store" className="hover:text-white transition-colors">Stationery Store</a></li>
              <li className="mt-4"><a href="/login?role=admin" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold-500 transition-all border border-white/10 px-3 py-2 rounded-lg inline-block">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-gold-500 mb-4">Student &amp; Parent</h3>
            <ul className="flex flex-col gap-2 text-white/70 text-sm">
              <li><a href="/login" className="hover:text-white transition-colors">Student Login</a></li>
              <li><a href="/pay-fees" className="hover:text-white transition-colors">Pay Fees Online</a></li>
              <li><a href="/notices" className="hover:text-white transition-colors">Circulars &amp; Notices</a></li>
              <li><a href="/calendar" className="hover:text-white transition-colors">School Calendar</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} SKP Sainik Public School, Manihari, Deoria. All rights reserved.</p>
          <p>Dedicated to academic excellence and character building since 2009.</p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919454331861?text=Hello%2C%20I%20want%20to%20enquire%20about%20admissions%20at%20SKP%20Sainik%20Public%20School."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 transition-all duration-300"
        title="Chat with us on WhatsApp"
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <ChatWidget />
    </>
  );
}
