import express, { json } from 'express'
import { corsMiddleware } from './src/middlewares/cors.js'
import { userRouter } from './src/routes/user.js'

const PORT = process.env.PORT ?? 1234

const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vinland' })
})

app.use('/users', userRouter)

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`)
})
