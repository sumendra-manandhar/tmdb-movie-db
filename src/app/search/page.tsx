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


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL 

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
          `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
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
    <div className="movie-search-page">
    <Navbar />
    <div className="movie-search-container">
      <div className="search-results-header">
        <h1 className="results-title">
          {loading
            ? "Searching..."
            : movies.length > 0
            ? `Search Results for "${query}"`
            : `No results found for "${query}"`}
        </h1>
      </div>
  
      <div className="movie-grid">
        {movies.map(
          (movie) =>
            movie.poster_path && (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="movie-card">
                <div className="movie-poster">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
                  <span>★ {movie.vote_average.toFixed(1)}</span>
                </div>
              </Link>
            )
        )}
      </div>
    </div>
  </div>
  

    
  )
}

