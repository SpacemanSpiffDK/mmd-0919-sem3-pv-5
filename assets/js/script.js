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
    
    // You can add your own classname to the modal - in this way you can style different modals independently
    modal.addClass('vjs-dahg-fancy-modal');
    
    // When the modal closes, resume playback.
    modal.on('modalclose', function() { // .on(event, ...)     is an eventlistener used with video.js
        video1.play();
  });
});

videojs('video2', options);
// The complex way
const video2 = videojs('video2');
const ModalDialog = videojs.getComponent('ModalDialog');

const modalContent = document.createElement("h1");
modalContent.className = "myClassName";
modalContent.innerHTML = "This is a test";

const modal = new ModalDialog(video2, {
    // add the content of the modalContent variable as content
    content: modalContent,
    // We don't want this modal to go away when it closes.
  temporary: false
});

video2.addChild(modal);

video2.on('pause', function() {
  modal.open();
});

video2.on('play', function() {
  modal.close();
});