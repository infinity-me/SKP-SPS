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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="col-span-1 lg:col-span-2">
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

          {/* Connect With Us */}
          <div>
            <h3 className="font-heading font-semibold text-gold-500 mb-4">Connect With Us</h3>
            <div className="flex flex-col gap-3">
              <a href="https://youtube.com/@sps_manihari?si=ZZ1-0mweYj9OgFcQ" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 flex items-center justify-center group-hover:bg-red-600 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-400 group-hover:text-white transition-colors">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">YouTube Channel</span>
              </a>

              <a href="https://www.facebook.com/share/1Am8M5m43n/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">Facebook Page</span>
              </a>

              <a href="https://whatsapp.com/channel/0029Vb828N4FHWq2z3g4Sh2m" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-green-600/20 flex items-center justify-center group-hover:bg-[#25D366] transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400 group-hover:text-white transition-colors">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">WhatsApp Channel</span>
              </a>

              <a href="https://www.google.com/maps/search/?api=1&query=SKP+Sainik+Public+School+Manihari+Deoria" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">Find on Maps</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} SKP Sainik Public School, Manihari, Deoria. All rights reserved.</p>
          <p>Dedicated to academic excellence and character building since 2009.</p>
        </div>
      </footer>




      <ChatWidget />
    </>
  );
}
