'use strict'

const Schema = use('Schema')

class PageSchema extends Schema {
  up () {
    this.create('Pages', (table) => {
      table.increments()
      table.timestamps()
      table.string('title')
      table.text('body')
      table.text('type')
      table.integer('user_id').unsigned()
    })
  }

  down () {
    this.drop('Pages')
  }
}

module.exports = PageSchema
