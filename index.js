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

let persons =[]

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(requestLogger)

app.get('/info', async (request, response) => {
  try {
    const count = await Person.estimatedDocumentCount();
    //Model.estimatedDocumentCount() is a method that provides an estimate of the number of documents in a collection without actually counting them.
    response.send(`<div>Phonebook has info for ${count} people<div/>
    <br/> 
    <div>${new Date()}</div>`);
  } catch (error) {
    response.status(500).send({ error: 'Failed to fetch data' });
  }
});

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person);
  });
});

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })
  
  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
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
  app.use(errorHandler)
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })