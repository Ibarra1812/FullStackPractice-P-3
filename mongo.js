/* const mongoose = require('mongoose');
const password = process.argv[2];
const table = 'telefonneApp';
const Name = process.argv[3];
const number = process.argv[4];


function hasOnlySpaces(str) {
    return str.trim() === "";
}

if(hasOnlySpaces(password) || !password) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}
if (hasOnlySpaces(Name)) {
    console.log('Please provide the name and number as arguments: node mongo.js <name>');
    process.exit(1);
}
if (hasOnlySpaces(number)) {
    console.log('Please provide the number as an argument: node mongo.js <number>');
    process.exit(1);
}

const url = `mongodb+srv://fullstack:${password}@phonenumber.nqhhn3m.mongodb.net/telefonneApp?retryWrites=true&w=majority&appName=PhoneNumber`;
mongoose.set('strictQuery', false);
mongoose.connect(url).catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
    process.exit(1);
});


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});
const Person = mongoose.model('Person', personSchema);
const person = new Person({
    name: Name,
    number: number
});


if (!Name && !number) {
    Person.find({})
    .then(result => {
        console.log('Phonebook:');
        console.log('------------------');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    })
}
else if (Name && number) {
person.save()
    .then(() => {
        console.log('person saved!');
        return Person.find({});
    })
    .then(result => {
        result.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        mongoose.connection.close();
    })}; */