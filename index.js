require('dotenv').config() // Load environment variables from .env file
//this is imported before importing notes.js to make sure that the environment variables are loaded before the database connection is made
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note') // Import the Note model from models/note.js

// Connect to MongoDB using the MONGO_URI environment variable
const mongoUrl = process.env.MONGO_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())// Enable CORS for all routes, allowing cross-origin requests 
// This is important for frontend to access the backend API beacause they are on different ports

app.use(express.static('dist')) // Serve static files from the dist directory
// This is the directory where the minified files of frontend are located, whith this connect frontend to backend

let notes = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger) // Middleware to log requests
app.use(express.json()) // Middleware to parse JSON bodies

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
})


/* const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
} */

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote) // savedNote is the note that was saved in the database
    //and it is returned as a JSON with the method toJSON that is defined in the note.js file
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT //process.env.PORT is used for a port number in production, and 3001 is used for development
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
