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
            <h2 className="text-2xl font-heading font-bold mb-6">SKP SAINIK <span className="text-gold-500">PUBLIC SCHOOL</span></h2>
            <p className="text-white/60 max-w-sm mb-6">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=SKP+Sainik+Public+School+Manihari+Deoria" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gold-500 transition-colors"
                title="View on Google Maps"
              >
                Manihari Village, Uttar Pradesh, India.
              </a>
              <br />
              Dedicated to academic excellence and character building.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-gold-500 mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-white/70">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/fees" className="hover:text-white transition-colors">Fees Structure</a></li>
              <li><a href="/admission" className="hover:text-white transition-colors">Admissions</a></li>
              <li><a href="/gallery" className="hover:text-white transition-colors">Gallery</a></li>
              <li className="mt-4"><a href="/login?role=admin" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-gold-500 transition-all border border-white/10 px-3 py-2 rounded-lg inline-block">Admin Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-gold-500 mb-4">Contact</h3>
            <p className="text-white/70">
              Email: <a href="mailto:skpspsmanihari09@gmail.com" className="hover:text-gold-500 transition-colors">skpspsmanihari09@gmail.com</a> <br />
              Phone: <a href="tel:9454331861" className="hover:text-gold-500 transition-colors">9454331861</a>, <a href="tel:8449790561" className="hover:text-gold-500 transition-colors">8449790561</a>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} SKP SAINIK PUBLIC SCHOOL. All rights reserved.
        </div>
      </footer>
      <ChatWidget />
    </>
  );
}
