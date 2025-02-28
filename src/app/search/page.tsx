"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
}

export default function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return

      setLoading(true)
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=0fe1ced818dd55a4e2bbcf0bc5f47a5e&query=${encodeURIComponent(
            query,
          )}`,
        )
        const data = await response.json()
        setMovies(data.results)
      } catch (error) {
        console.error("Error searching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    searchMovies()
  }, [query])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {loading
              ? "Searching..."
              : movies.length > 0
                ? `Search Results for "${query}"`
                : `No results found for "${query}"`}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map(
            (movie) =>
              movie.poster_path && (
                <Link key={movie.id} href={`/movie/${movie.id}`} className="movie-card">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
                    <span>★ {movie.vote_average.toFixed(1)}</span>
                  </div>
                </Link>
              ),
          )}
        </div>
      </div>
    </div>
  )
}

