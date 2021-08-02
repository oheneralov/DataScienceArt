'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')

class UserSeeder {
  async run () {
    //create an admin account
    let passwd = await Hash.make('12345)
    let userPasswd = await Hash.make('12345')
    // create a super-admin account
    await Database.table('users').insert({username: 'admin', password: passwd, is_admin: 1, email: 'admin@gmail.com', first_name: 'Oleksandr', last_name: 'Heneralov'})
  
  }
}

module.exports = UserSeeder
