'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.timestamps()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('is_admin', 2).notNullable()
      table.string('first_name', 60).notNullable()
      table.string('last_name', 60).notNullable()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
