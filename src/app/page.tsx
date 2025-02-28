import HeroSection from "@/components/hero-section";
import MovieSlider from "@/components/movie-slider";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
  <Navbar/>
  <HeroSection />
  <div className="px-4 space-y-8 pb-8">
        <MovieSlider title="Now Playing" type="now_playing" />
        <MovieSlider title="Upcoming Movies" type="upcoming" />
        <MovieSlider title="Top Rated" type="top_rated" />
      </div>
    </main>
  );
}
