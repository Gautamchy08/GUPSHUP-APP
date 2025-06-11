import http from 'http'

import app from './app.js'

const Server = http.createServer(app)
const PORT = process.env.PORT || 3000

Server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
