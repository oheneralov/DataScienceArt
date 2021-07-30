# Adonis CMS Demo :triangular_ruler:

This repo contains an example application of the Adonis CMS. You must checkout the source code or the API docs on official website to learn more.

<br />
<hr />
<br />

## What's in the box?

1. Authentication System
2. Blogging System
3. API Testing
4. Browser Testing
5. Assets management

## What's the roadmap?

1. Passwordless authentication
2. Frontend framework to increase the UX
3. ACL
4. WYSIWYG editor
5. File uploaded with processing (image)


## How to run

- Run `npm install` to install all dependencies
- Make a copy of `.env.example` rename it to `.env`
- Run `adonis key:generate` to generate the secret key
- Run `adonis migration:run` to setup the database
- Run `npm run build:dev` to build static assets (preferably in another terminal tab/window)
- Run `adonis serve --dev` to run the application
- Recopy database after restarting docker-compose

<div class="contentarea">
	<h1>
		Electronic eyes
	</h1>
  <div class="camera">
    <video id="video">Video stream not available.</video>
    <button id="startbutton">Take photo</button> 
  </div>
  <canvas id="canvas">
  </canvas>
  <div class="output">
    <img id="photo" alt="The screen capture will appear in this box." src=""> 
  </div>
</div>





