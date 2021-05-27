const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(allowCors)
server.use(queryParser())

//Definir URL base para todas as rotas
const { getDailyTrends, getRealTimeTrends, getInterestByRegion } = require('./metodos')
server.get('/api/dailytrends', getDailyTrends)
server.get('/api/realtimetrends', getRealTimeTrends)
server.get('/api/interestbyregiontrends', getInterestByRegion)

server.listen(process.env.PORT || 3002)

module.exports = server