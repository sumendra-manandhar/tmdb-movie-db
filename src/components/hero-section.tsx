"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movie {
  id: number
  title: string
  backdrop_path: string
  overview: string
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL 

console.log("API_KEY:", API_KEY)
console.log("BASE_URL:", BASE_URL)

export default function HeroSection() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`)
        const data = await response.json()
        setMovies(data.results.slice(0, 5))
      } catch (error) {
        console.error("Error fetching movies:", error)
      }
    }

    fetchMovies()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
  }, [movies.length])

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  if (movies.length === 0) return null

  return (
    <div className="slider-container">
    {movies.map((movie, index) => (
      <div
        key={movie.id}
        className={`slider-item ${index === currentIndex ? "active" : ""}`}
      >
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="slider-image"
          priority
        />
        <div className="slider-gradient" />
        <div className="slider-content">
          <h1 className="slider-title">{movie.title}</h1>
          <p className="slider-description">{movie.overview}</p>
        </div>
      </div>
    ))}
  
    <button
      onClick={prevSlide}
      className="slider-button slider-prev"
    >
      <ChevronLeft className="slider-icon" />
    </button>
    <button
      onClick={nextSlide}
      className="slider-button slider-next"
    >
      <ChevronRight className="slider-icon" />
    </button>
  </div>
  
  )
}
