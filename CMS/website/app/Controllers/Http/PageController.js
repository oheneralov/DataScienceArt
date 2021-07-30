'use strict'

const Page = use('App/Models/Page')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')
const FormData = require('form-data');
const axios = require('axios')
const Blob = require("cross-blob");
const fs = require('fs')
const fsPromises = fs.promises;
const Logger = use('Logger')

class PageController {
  async index ({ view, params }) {
    /**
     * Fetch all Pages inside our database.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_all
     */
    const Pages = await Page.all()

    /**
     * Render the view 'Pages.index'
     * with the Pages fetched as data.
     *
     * ref: http://adonisjs.com/docs/4.1/views
     */
    let activePage = 'Home'
    if (params.id) {
      activePage = decodeURI(params.id)

    }
    return view.render('pages.index', { 
      pages: Pages.toJSON(),
      activePage: activePage
     })
  }

  async showAll ({ view, params }) {
    /**
     * Fetch all Pages inside our database.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_all
     */
    const Pages = await Page.all()

    /**
     * Render the view 'Pages.index'
     * with the Pages fetched as data.
     *
     * ref: http://adonisjs.com/docs/4.1/views
     */
    let activePage = 'home'
    if (params.id) {
      activePage = params.id

    }
    return view.render('pages.showall', { 
      pages: Pages.toJSON(),
      activePage: activePage
     })
  }

  create ({ view }) {
    /**
     * Render the view 'Pages.create'.
     *
     * ref: http://adonisjs.com/docs/4.1/views
     */
    return view.render('pages.create')
  }

  async store ({ session, request, response }) {
    /**
     * Getting needed parameters.
     *
     * ref: http://adonisjs.com/docs/4.1/request#_only
     */
    const data = request.only(['title', 'body', 'type'])

    /**
     * Validating our data.
     *
     * ref: http://adonisjs.com/docs/4.1/validator
     */
    const validation = await validateAll(data, {
      title: 'required',
      body: 'required',
    })

    /**
     * If validation fails, early returns with validation message.
     */
    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll()

      return response.redirect('back')
    }

    /**
     * Creating a new Page into the database.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_create
     */
    await Page.create(data)

    return response.redirect('/')
  }

  async edit ({ params, view }) {
    /**
     * Finding the Page.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_findorfail
     */
    const page = await Page.findOrFail(params.id)

    return view.render('pages.edit', { page: page.toJSON() })
  }

  async update ({ params, session, request, response }) {
    /**
     * Getting needed parameters.
     *
     * ref: http://adonisjs.com/docs/4.1/request#_only
     */
    const data = request.only(['title', 'body', 'type'])

    /**
     * Validating our data.
     *
     * ref: http://adonisjs.com/docs/4.1/validator
     */
    const validation = await validateAll(data, {
      title: 'required',
      body: 'required',
    })

    /**
     * If validation fails, early returns with validation message.
     */
    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll()

      return response.redirect('back')
    }

    /**
     * Finding the Page and updating fields on it
     * before saving it to the database.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_inserts_updates
     */
    const page = await Page.findOrFail(params.id)
    page.merge(data)
    await page.save()

    return response.redirect('/')
  }

  async delete ({ params, response }) {
    /**
     * Finding the Page and deleting it
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_deletes
     */
    const page = await Page.findOrFail(params.id)
    await page.delete()

    return response.redirect('/')
  }

  async recognize({request}) {
    try{
      Logger.info('Trying to recognize')
      const dump = request.file('file', {
        types: ['application','png', 'jpeg', 'jpg', 'bpm'],
        size: '200mb'
      })

      const imagePath = Helpers.tmpPath('uploads') + '/' + dump.clientName
  
      if (dump.clientName) {
        await dump.move(Helpers.tmpPath('uploads'), {
          name: dump.clientName,
          overwrite: true
        })
      }
      console.log('1')
        if (!dump.moved()) {
          Logger.info(dump.error())
          console.log(dump.error())
        }
        
        const url = 'http://54.191.13.235/file-upload'
        Logger.info('sending the image to cnn')
        const result = await this.readFileAndSend(imagePath, url)
        Logger.info('readFileAndSend')
        await fsPromises.unlink(imagePath)
  

      return {data: result.data}
  

    } catch(e){
      Logger.info(e.message + ' , ' + e.stack)
      
    }

}

async sendImage(base64String, url){
  const formData = new FormData();
  const base64Image = base64String.split(';base64,').pop();
  const data = base64Image
  console.log('100')
  formData.append('file', data, 'photo.png');
  console.log(101)

  return axios.post(url, formData, {
  // You need to use `getHeaders()` in Node.js because Axios doesn't
  // automatically set the multipart form boundary in Node.
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
}

// convert base64 into string
atob(b64Encoded) {
  return Buffer.from(b64Encoded, 'base64').toString()
}

  dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = this.atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}

readStream(stream, encoding = "utf8") {
    
  stream.setEncoding(encoding);

  return new Promise((resolve, reject) => {
      let data = "";
      stream.on("data", chunk => data += chunk);
      stream.on("end", () => resolve(data));
      stream.on("error", error => reject(error));
  });
}

async readFileAndSend(imagePath, url) {
    const form_data = new FormData();
    form_data.append('file', fs.createReadStream(imagePath));

    const request_config = {
          method: "post",
          url: url,
          headers: form_data.getHeaders(),
          data: form_data
        };

    return axios(request_config)
         
}
}

module.exports = PageController
