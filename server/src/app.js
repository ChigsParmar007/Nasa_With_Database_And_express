const express = require("express")
const cors = require("cors")
const api = require('./routes/api')
const app = express()

app.use(express.json()) 
app.use(cors())
// app.use(cors( { origin: "http://localhost:3000" } ))

app.use('/v1', api)

module.exports = app

//http://localhost:6000/v1/planets