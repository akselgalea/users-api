import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:4200/',
  'http://localhost:5271'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (!origin || acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
