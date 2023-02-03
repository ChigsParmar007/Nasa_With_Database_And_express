const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL

mongoose.set('strictQuery', true)

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready...!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})
const mongoConnect = async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/NasaData', {
        // useNewUrlParser: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
        // useUnifiedTopology: true,
    })
}

module.exports = {
    mongoConnect
}