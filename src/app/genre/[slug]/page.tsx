"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useParams } from "next/navigation"

const genreIds: { [key: string]: number } = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  "sci-fi": 878,
  thriller: 53,
}

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  runtime?: number
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL

export default function GenrePage() {
  const params = useParams()
 const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ""

  const [movies, setMovies] = useState<Movie[]>([])
  const [sortBy, setSortBy] = useState("popularity.desc")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const genreId = genreIds[slug]
        if (!genreId) {
          console.error("Invalid genre slug:", slug)
          setIsLoading(false)
          return
        }

        const response = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=${sortBy}`,
        )
        const data = await response.json()
        setMovies(data.results)
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchMovies()
    }
  }, [slug, sortBy])

  const genreTitle = slug ? slug.replace("-", " ") : ""

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{genreTitle} Movies</h1>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Latest Release</option>
            <option value="release_date.asc">Oldest Release</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="movie-card">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
                  <span>★ {movie.vote_average.toFixed(1)}</span>
                </div>
              </Link>
            ))}
            {movies.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-400">No movies found for this genre.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

