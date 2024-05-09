const express = require('express')
const app = express()

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

app.use(express.json())

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
    response.json(persons)
})

const generateId = () => {
    const maxId = 100000;
    return Math.floor(Math.random() * maxId);
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        console.log('x')
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})