import express, { json } from 'express'
import { corsMiddleware } from './src/middlewares/cors.js'
import { userRouter } from './src/routes/user.js'
import { errorHandler } from './src/middlewares/errorHandler.js'

const PORT = process.env.PORT ?? 1234

const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vinland' })
})

app.use('/users', userRouter)
app.all('*', (req, res) => {
  res.status(404).json({ error: 'url not found' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`)
})
