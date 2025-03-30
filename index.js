const http = require('http')
const express = require('express')
const app = express()
app.use(express.json())
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

let info = [{
  "date": new Date(),
  "persons": persons.length
}]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${info[0].persons} people<div/>
    <br/> 
    <div> ${info[0].date} </div>`)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
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
    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    }
    
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
  
    const person = {
      id: getRandomInt(10000),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(persons)
  })