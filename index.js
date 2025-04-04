require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/persons')
app.use(cors())


app.use(express.json())
app.use(express.static('dist'))
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(requestLogger)

let persons = []

let info = [{
  "date": new Date(),
  "persons": persons.length
}]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
    response.json(person)
    })
  })

  app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${info[0].persons} people<div/>
    <br/> 
    <div> ${info[0].date} </div>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  /* const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  } */
   /*  const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    } */

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      if (body.name) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
      if (body.number) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    if( persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })



/*   EXAMPLE: only log error responses
morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}) */
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })