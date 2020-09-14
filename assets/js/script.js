// JS by Dan Høegh
// UCN MMD 2020

const options = {
	"controls": true,
	"autoplay": false,
	"preload": "auto",
	"muted": false
};

// The simple way
// The simple way
// The simple way

videojs('video1', options);

const video1 = videojs('video1');
video1.on('pause', () => { // .on(event, ...)     is an eventlistener used with video.js

	// Modals are temporary by default. They dispose themselves when they are closed so,
	// we can create a new one each time the player is paused and not worry about leaving extra nodes hanging around.

	let modal = video1.createModal('This is a modal!');
	
	// You can add your own classname to the modal - in this way you can style different modals independently
	modal.addClass('vjs-dahg-fancy-modal');

	// When the modal closes, resume playback.
	modal.on('modalclose', () => { // .on(event, ...)     is an eventlistener used with video.js, first seen (by me) in jQuery
		video1.play();
	});
});




// The complex (and more configurable way) way
// The complex (and more configurable way) way
// The complex (and more configurable way) way

videojs('video2', options);

const video2 = videojs('video2');
const modalDialog = videojs.getComponent('ModalDialog'); // use "getComponent" to create a modalDialog class 

// Creating an HTML element for injection into the modal - this can be done with "the simple way" too
const modalContent = document.createElement("h1");  // create an element (h1)
modalContent.className = "myClassName";             // add a class to it
modalContent.innerHTML = "This is a test";          // add some content to the element

// Create the modal
const modal = new modalDialog(video2, {
	// Options can be added in JSON format - CONFIGURABILITY!
	// see the options here: https://docs.videojs.com/modaldialog
	// PP-SLIDE: look through the options and use of that page ^^

	content: modalContent,  	// add the modalContent variable as content
	temporary: false        	// We don't want this modal to go away when it closes
								// It will be hidden and NOT deleted from HTML DOM when closed
								// This can be practical if you don't want the content to be forgotten
});

// Adds the modal to the video, but doesn't open it
video2.addChild(modal);

// Opens the modal on pause
video2.on('pause', () => {
	modal.open();
});

// Closes the modal on play
video2.on('play', () => {
	modal.close();
});


// Show overlay based on a simple timer
// Show overlay based on a simple timer
// Show overlay based on a simple timer

// setup an interval that checks if modal should be triggered
let video2timer = setInterval(() => {
	// .currentTime() is a method in video.js, which refers to the video.js video object, 
	// not the HTML DOM video element, where you would get time without parentheses: document.querySelector('#video2').currentTime       <= note: no () at the end here
	if (video2.currentTime() > 2) {
		clearInterval(video2timer); 					// stop time-based loop
		let modal2 = video2.createModal(modalContent); 	// using modalcontent from the previous example
		modal2.on('modalclose', () => {
			video2.play();
		});
	}
}, 200);




// Show multiple sequential overlays based on a JSON array
// one video only


// We prepare the content for the different modals before we setup a sequence in modalsData
const modalContent1 = document.createElement("h1");  	// create an element (h1)
modalContent1.innerHTML = "Modal Content 1";          	// add some content to the element

const modalContent2 = document.createElement("h2");  	// create an element (h1)
modalContent2.innerHTML = "Modal Content 2";          	// add some content to the element


// These are datasets for the modals we want to show, content-HTML DOM element from above and a time stamp
let modalsData = [
	{
		time: 7,
		content: modalContent1
	},
	{
		time: 3,
		content: modalContent2
	},
	{
		time: 10,
		content: modalContent1
	}
];

const fps = 15;																			// set frames per second for the modal engine
const msInterval = parseInt(1000/fps);													// calculate how many milliseconds it takes to get desired frames per second

let modalsEngine;																		// declare the modalsEngine variable that we're gonna need for the engine interval loop

let video = {
	modals: {
		engineOn: false,																// initialize the "modals engine is currently runnig"-flag to false, 'cause it aint runnin'
		init: (elmVideo) => {															// new function video.modals.init() to initialize the video for our modalsData
			modalsData.sort((a, b) => (a.time > b.time) ? 1 : -1); 						// sort modal sequence by time, ascending - this changes the array! (modalsData gets rewritten) (Just to satisfy my OCD)
			if (modalsData && elmVideo){												// if modalsData and elmVideo exists
				elmVideo.on('play', () => {												// video on play event
					video.modals.onPlay(elmVideo);										// run the onPlay() function - pass the videojs video element as a parameter
				});
				elmVideo.on('pause', () => {											// video on pause event
					video.modals.onPause();												// run the onPause() function
				});
			}
		},
		on: (elmVideo) => {																// new function video.modals.on() - passing the videoplayer element from videojs as a parameter
			video.modals.engineOn = true;												// set the "modals engine is currently runnig"-flag to true, 'cause were starting it now
			modalsEngine = setInterval(() => {											// setup an interval that repeats until stopped
				const currentTime = elmVideo.currentTime();								// Get current time from the video
				modalsData.forEach(modal => { 											// loop though modals in modalsData
					if (modal.completed != true && modal.time <= currentTime){ 			// if the current modal hasn't been show before and it's time
					modal.completed = true; 											// make sure to tell modalsData that this modal has been show
						elmVideo.createModal(modal.content); 							// draw modal on screen
						elmVideo.on('modalclose', () => {								// video modal on close event
							elmVideo.play();											// Play the video when modal is closed
						});
					}
				});
			}, msInterval);																// time between interval loops
		},
		onPlay: (elmVideo) => {															// new function video.modals.onPlay() - passing the videoplayer element from videojs as a parameter
			// disable all modals before currentTime (otherwise all modals before "now" will all appear at once)
			const currentTime = elmVideo.currentTime();									// Get current time from the video
			modalsData.forEach(modal => {												// loop though modals in modalsData
				modal.completed = modal.time <= currentTime; 							// set modal.completed to true if the modal is before currentTime otherwise set to false
			});
			video.modals.on(elmVideo);													// turn the 'modals engine' back on, pass the videojs video element as a parameter
		},
		onPause: () => {																// new function video.modals.onPause() to turn off engine if it is turned on
			if (video.modals.engineOn){													// if 'engine running'-flag is true
				video.modals.off();														// turn off the engine
			}
		},
		off: () => {																	// new function video.modals.off() - turns off the interval and set enigine runningflag to false
			video.modals.engineOn = false;												// set the "modals engine is currently runnig"-flag to false, 'cause were stopping it now
			clearInterval(modalsEngine);												// stop the "modals engine" interval
		}
	}
}


videojs('video3', options);			// start video3 using the videojs function

const video3 = videojs('video3');	// put the video videojs element in a variable for easy delivery to video.modals.init() as a parameter
video.modals.init(video3);			// start the modals script, passing the videojs video element as a parameter