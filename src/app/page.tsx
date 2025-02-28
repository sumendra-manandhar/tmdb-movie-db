import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
  <Navbar/>
  <HeroSection />
    </main>
  );
}
