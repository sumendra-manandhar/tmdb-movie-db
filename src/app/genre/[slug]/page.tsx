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

  const url = new URL(window.location.href);
  const pathnameParts = url.pathname.split("/").filter(Boolean);
  const urlslug = pathnameParts[pathnameParts.length - 1];

  const slug = typeof params?.slug === "string" 
    ? params.slug 
    : Array.isArray(params?.slug) 
      ? params.slug[0] 
      : urlslug;

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
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=${sortBy}`
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
    <div className="genre-page">
      <Navbar />
      <div className="container ">
        <div className="header">
          <h1>{genreTitle} Movies</h1>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Latest Release</option>
            <option value="release_date.asc">Oldest Release</option>
          </select>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="movie-card">
                <div className="poster">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <h3>{movie.title}</h3>
                <div className="movie-info">
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
                  <span className="rating">{movie.vote_average.toFixed(1)}</span>
                </div>
              </Link>
            ))}
            {movies.length === 0 && !isLoading && (
              <div className="no-movies">
                <p>No movies found for this genre.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
