// Update with your config settings.

module.exports = {

  development: {
    client: "sqlite3",
    connection: {
      filename: "./arbiter_dev.sqlite3"
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './app/db/migrations'
    },
    seeds: {
      directory: './app/db/seeds/dev'
    },
    useNullAsDefault: true,
    pool: {
      idleTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      propagateCreateError: true // <- default is true, set to false
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "./arbiter_test.sqlite3"
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './app/db/migrations'
    },
    seeds: {
      directory: './app/db/seeds/test'
    },
    useNullAsDefault: true
  },

  production: {
    client: "sqlite3",
    connection: {
      filename: "./arbiter_prod.sqlite3"
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './app/db/migrations'
    },
    seeds: {
      directory: './app/db/seeds/prod'
    },
    useNullAsDefault: true
  }
};
