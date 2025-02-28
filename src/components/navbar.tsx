"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Menu, X } from "lucide-react"


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsOpen(false)
    }
  }

  const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"]

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link href="/" className="logo">
            TMBD MOVIE DB
          </Link>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search movies..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <Search className="search-icon" />
              </button>
            </form>

            <div className="genres">
              <button className="genres-button">Genres</button>
              <div className="genres-dropdown">
                <div className="genres-list">
                  {genres.map((genre) => (
                    <Link
                      key={genre}
                      href={`/genre/${genre.toLowerCase()}`}
                      className="genre-item"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="mobile-menu-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="icon" /> : <Menu className="icon" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <form onSubmit={handleSearch} className="search-form mb-4">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <Search className="search-icon" />
                </button>
              </form>
              {genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/genre/${genre.toLowerCase()}`}
                  className="genre-item"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
