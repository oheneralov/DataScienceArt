function PhotoCnn() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  var synth = window.speechSynthesis;
  var voices = synth.getVoices();
  var utterThis = new SpeechSynthesisUtterance();
  utterThis.voice = voices[0]

  async function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    let videoStream = null

    
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      videoStream = navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } })
      debugMsg('Android') 
      debugMsg(navigator.userAgent)
    } else {
      debugMsg('desktop')
      videoStream = navigator.mediaDevices.getUserMedia({ audio: false, video: true })
     }

     debugMsg(navigator.userAgent)
    videoStream
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', async function(ev){
      await takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  async function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      await sendPhoto2ServerAsFile(data)

    } else {
      clearphoto();
    }
  }

  async function sendPhoto2Server2 (data) {
    var formData = new FormData();
    const photo = document.getElementById('photo');
    var blob = photo.src;
    formData.append('file', blob);

    var request = new XMLHttpRequest();
    request.open('POST', '/api/v1/recognize');
    request.send(formData);
  }


  function debugMsg(msg){
    let debuggerContainer = document.getElementById('custom-debugger')
    var textnode = document.createTextNode(msg);         // Create a text node
    debuggerContainer.appendChild(textnode); 
  }

  async function sendPhoto2ServerAsFile(data) {
    const formData = new FormData();
    const src = dataURItoBlob(data)

    formData.append('file', src, 'photo.png');

    try {
      document.getElementById('custom-debugger').innerText = 'Done'
      debugMsg('Sending image to server')
       const response = await fetch('/api/v1/recognize', {
       method: 'POST',
       body: formData
       });
       const result = await response.json();

      utterThis.text = result.data.object.object_name
      utterThis.volume = 1
      utterThis.pitch = 1
      utterThis.rate = 1

      synth.speak(utterThis);

      console.log('Success', JSON.stringify(result));
       debugMsg('Success ' + JSON.stringify(result))
     } catch (error) {
      debugMsg('Error ' + error.message)
       console.error(error.message);
       }
    }

    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
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
  if (document.getElementById('video') ) {
    startup()
  }
  
};



// Set up our event listener to run the startup process
  // once loading is complete.
window.addEventListener('load', PhotoCnn, false);