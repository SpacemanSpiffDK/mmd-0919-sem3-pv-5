// JS by Dan Høegh
// UCN MMD 2020

const options = {
    "controls": true, 
    "autoplay": false, 
    "preload": "auto", 
    "muted": false
};

videojs('video1', options);
// The simple way
const video1 = videojs('video1');
video1.on('pause', function() { // .on(event, ...)     is an eventlistener used with video.js
    
    // Modals are temporary by default. They dispose themselves when they are
    // closed; so, we can create a new one each time the player is paused and
    // not worry about leaving extra nodes hanging around.
    
    var modal = video1.createModal('This is a modal!');
    // TASK: --------------------- 
    // try swapping out the text string with an HTML element (.createElement) 
    
    // You can add your own classname to the modal - in this way you can style different modals independently
    modal.addClass('vjs-dahg-fancy-modal');
    
    // When the modal closes, resume playback.
    modal.on('modalclose', function() { // .on(event, ...)     is an eventlistener used with video.js
        video1.play();
  });
});

videojs('video2', options);
// The complex (an more configurable way) way
const video2 = videojs('video2');
const ModalDialog = videojs.getComponent('ModalDialog');

// Creating an HTML element for injection into the modal
const modalContent = document.createElement("h1");  // create an element (h1)
modalContent.className = "myClassName";             // add a class to it
modalContent.innerHTML = "This is a test";          // add some content to the element

// Create the modal
const modal = new ModalDialog(video2, {
    // Options can be added in JSON format - CONFIGURABILITY!
    content: modalContent,  // add the modalContent variable as content
    temporary: false        // We don't want this modal to go away when it closes
                            // It will be hidden and NOT deleted from HTML DOM when closed
                            // This can be practical if you don't want the content to be forgotten
});

// Adds the modal to the video, but doesn't open it
video2.addChild(modal);

// Opens the modal on pause
video2.on('pause', function() {
  modal.open();
});

// Closes the modal on play
video2.on('play', function() {
  modal.close();
});