'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/', 'PageController.index')
Route.get('/page/:id', 'PageController.index')

// Those routes should be only accessible
// when you are not logged in
Route.group(() => {
  Route.get('login', 'SessionController.create')
  Route.post('login', 'SessionController.store')
  Route.get('api/v1/storefront/pages', 'StoreFrontController.index')

}).middleware(['guest'])

// Those routes should be only accessible
// when you are logged in
Route.group(() => {
  Route.get('register', 'UserController.create')
  Route.post('register', 'UserController.store')
  Route.get('logout', 'SessionController.delete')

  Route.get('admin/pages/', 'PageController.showAll')
  Route.get('admin/pages/"id', 'PageController.showAll')
  Route.get('admin/pages/create', 'PageController.create')
  Route.post('admin/pages', 'PageController.store')
  Route.get('admin/pages/:id/edit', 'PageController.edit')
  Route.get('admin/pages/:id/delete', 'PageController.delete')
  Route.put('admin/pages/:id', 'PageController.update')
  Route.post('/api/v1/recognize', 'PageController.recognize')
  
}).middleware(['auth'])
