import Image from "next/image"
import { Star, Clock, Calendar } from "lucide-react"
import Navbar from "@/components/navbar"

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL 

async function getMovieDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`,
  )
  return response.json()
}

export default async function MoviePage({
  params:asyncParams,
}: {
  params: Promise<{ id: string }>
}) {
  const params = await asyncParams;
  
  const movie = await getMovieDetails(params.id)

  return (
<div className="movie-detail-page">
  <Navbar />
  <div className="movie-detail-container">
    {/* Backdrop Image */}
    <div className="backdrop-container">
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        fill
        className="backdrop-image"
        priority
      />
      <div className="backdrop-gradient" />
    </div>

    {/* Movie Details */}
    <div className="movie-details">
      <div className="movie-info">
        {/* Poster */}
        <div className="poster-container">
          <div className="poster-image">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="info-container">
          <h1 className="movie-title">{movie.title}</h1>

          <div className="movie-meta">
            <div className="meta-item">
              <Star className="meta-icon" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="meta-item">
              <Clock className="meta-icon" />
              <span>{movie.runtime} min</span>
            </div>
            <div className="meta-item">
              <Calendar className="meta-icon" />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>

          <div className="overview-section">
            <h2 className="section-title">Overview</h2>
            <p className="overview-text">{movie.overview}</p>
          </div>

          <div className="cast-section">
            <h2 className="section-title">Cast</h2>
            <div className="cast-list">
              {movie.credits.cast.slice(0, 6).map((actor:any) => (
                <div key={actor.id} className="actor-item">
                  <div className="actor-image">
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="actor-name">{actor.name}</p>
                  <p className="actor-character">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Details</h2>
            <div className="details-grid">
              <div>
                <span className="detail-label">Status: </span>
                {movie.status}
              </div>
              <div>
                <span className="detail-label">Original Language: </span>
                {movie.original_language.toUpperCase()}
              </div>
              <div>
                <span className="detail-label">Budget: </span>${movie.budget.toLocaleString()}
              </div>
              <div>
                <span className="detail-label">Revenue: </span>${movie.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

