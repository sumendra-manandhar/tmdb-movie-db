"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useSearchParams } from "next/navigation"

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
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([])
  const [sortBy, setSortBy] = useState("popularity.desc")



  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const genreId = genreIds[searchParams.get('slug') as string]
        const response = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=${sortBy}`,
        )
        const data = await response.json()
        setMovies(data.results)
      } catch (error) {
        console.error("Error fetching movies:", error)
      }
    }

    fetchMovies()
  }, [searchParams.get('slug') as string, sortBy])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{searchParams.get('slug')?.replace("-", " ")} Movies</h1>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
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
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>★ {movie.vote_average.toFixed(1)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

