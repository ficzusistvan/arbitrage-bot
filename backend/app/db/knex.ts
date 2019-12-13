const environment = process.env.NODE_ENV || 'development'
const config = require('../../knexfile.ts')[environment]

export = require('knex')(config)