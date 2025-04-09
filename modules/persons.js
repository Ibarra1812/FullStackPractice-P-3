const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength: 3,
    required: true,
  },

  number: {
    type: String,
    required: true,
    validate: [
      {
        validator: v => v.length >= 8,
        message: 'Mínimo 8 caracteres'
      },
      {
        validator: v => /^\d{2,3}-\d+$/.test(v),
        message: 'Formato NN-NNNN o NNN-NNN...'
      }
    ]
  }
/* ALTERNATIVA CON UN SOLO VALIDADOR
    validator: function(v) {
      // Verificar ambas condiciones en un solo validador
      return (
        v.length >= 8 && // Condición 1: Longitud mínima
        /^\d{2,3}-\d+$/.test(v) // Condición 2: Formato XXXX-XXXX
      );
    }, */
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)