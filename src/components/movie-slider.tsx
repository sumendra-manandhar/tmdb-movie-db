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
    <div className="movie-slider-container">
    <h2 className="movie-slider-title">{title}</h2>
    <div className="movie-slider-wrapper">
      <div ref={sliderRef} className="movie-slider">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="movie-card">
            <div className="movie-poster">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="movie-image"
              />
            </div>
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-details">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>★ {movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <button
        onClick={() => scroll("left")}
        className="scroll-button left"
        disabled={!movies.length}
      >
        <ChevronLeft className="icon" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="scroll-button right"
        disabled={!movies.length}
      >
        <ChevronRight className="icon" />
      </button>
    </div>
  </div>
  )
}

