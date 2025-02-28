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
    <div className="min-h-screen">
      <Navbar />
      <div className="relative">
        {/* Backdrop Image */}
        <div className="relative h-[60vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        {/* Movie Details */}
        <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-none w-64">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

              <div className="flex gap-6 text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300">{movie.overview}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {movie.credits.cast.slice(0, 6).map((actor: any) => (
                    <div key={actor.id} className="flex-none w-24">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                          alt={actor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium line-clamp-1">{actor.name}</p>
                      <p className="text-sm text-gray-400 line-clamp-1">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Status: </span>
                    {movie.status}
                  </div>
                  <div>
                    <span className="text-gray-400">Original Language: </span>
                    {movie.original_language.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-gray-400">Budget: </span>${movie.budget.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-gray-400">Revenue: </span>${movie.revenue.toLocaleString()}
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

