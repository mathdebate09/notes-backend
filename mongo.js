const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://learnjayssingh:${password}@clusterphonebook.7yq6jvr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterPhoneBook`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

// Adds number from CLI using node.mongo.js yourPassword "Some Name" 029-3333-4434
if (process.argv.length === 5) {
    const newNumber = new Phonebook({
        name: process.argv[3],
        number: process.argv[4],
    })

    newNumber.save()
        .then(() => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            mongoose.connection.close()
        })
}

// Prints list of added numbers
if (process.argv.length === 3) {
    Phonebook.find({}).then(persons => {
        console.log('phonebook :')
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}