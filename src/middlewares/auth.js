import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  if (!token || !decodedToken.userId) {
    return res.status(401).json({ error: 'invalid token' })
  }

  req.userId = decodedToken.userId

  next()
}
