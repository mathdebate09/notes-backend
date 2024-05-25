const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()

const Phonebook = require('./models/phonebook')
const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('post_data', function (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    } else {
        return '';
    }
});

const requestLogger = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.post_data(req, res)
    ].join(' ')
});

app.use(requestLogger);

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.get('/info', (request, response) => {
    const date = new Date();
    const optionsShort = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    const optionsLong = {
        timeZoneName: 'long'
    };

    const formatterShort = new Intl.DateTimeFormat('en-US', optionsShort);
    const formatterLong = new Intl.DateTimeFormat('en-US', optionsLong);
    let formattedDateShort = formatterShort.format(date);
    let formattedDateLong = formatterLong.format(date);
    // Remove commas
    formattedDateShort = formattedDateShort.replace(/,/g, '');
    formattedDateLong = formattedDateLong.replace(/,/g, '');

    formattedDateLong = formattedDateLong.split(' ').slice(1).join(' ');

    const formattedDate = `${formattedDateShort} (${formattedDateLong})`;
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${formattedDate}</p>`);
})

app.get('/', (request, response) => {
    response.send('nothing here :)')
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(persons => {
        response.json(persons)
      })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const person = new Phonebook ({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
      })
})

app.get('/api/persons/:id', (request, response) => {
    Phonebook.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})