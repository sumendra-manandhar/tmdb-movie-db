"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
}

interface MovieSliderProps {
  title: string
  type: "now_playing" | "upcoming" | "top_rated"
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL 

export default function MovieSlider({ title, type }: MovieSliderProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${type}?api_key=${API_KEY}`,
        )
        const data = await response.json()
        setMovies(data.results)
      } catch (error) {
        console.error("Error fetching movies:", error)
      }
    }

    fetchMovies()
  }, [type])

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth
      sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative group">
        <div ref={sliderRef} className="flex overflow-x-scroll gap-4 movie-slider pb-4">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="flex-none w-[200px] movie-card">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  <span>★ {movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          disabled={!movies.length}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          disabled={!movies.length}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

