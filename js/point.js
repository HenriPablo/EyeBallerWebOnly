/**
 * Created by tomekpilot on 2/28/15.
 *
 * 03-27-2015: added codePen at http://codepen.io/henripablo/pen/bNZERp
 */


var tl2 = new TweenMax.to(document.getElementById('point'), 1.5, {
	//x:0,
	y: 0,
	//repeat: 1,
	//onRepeat: eyeBaller.playSound,
	yoyo: true,
	repeatDelay: 0,
	ease: Power0.easeNone,
	paused: true
});


var eyeBaller = {

	resetAnimation : function( orientation ){
		console.clear();
		console.log("orientation : " + orientation );
		console.log( "last trajectory angle:" + eyeBaller.settings.lastTrajectoryAngle );
		console.log( "profile:" + eyeBaller.ui.profile );

		eyeBaller.ui.orientation = orientation;

		// Gets if the tween is paused
		var isPaused = tl2.paused();
		var leftPosition = 0;

		tl2.pause( );
		eyeBaller.ui.positionPwa();


		var newRoatationAngle = 0;
		var newTop = eyeBaller.settings.ebHeight() / 2;

		if( eyeBaller.ui.profile == 1 ){
			newRoatationAngle = -( eyeBaller.settings.crossAngle());
			newTop = eyeBaller.settings.ebHeight();
		}

		if( eyeBaller.ui.profile == 2){
			newRoatationAngle = eyeBaller.settings.crossAngle();
			newTop = 0;
		}


		//if( eyeBaller.settings.lastTrajectoryAngle !== 0 ){
		//	newRoatationAngle = eyeBaller.settings.crossAngle();
		//	eyeBaller.settings.lastTrajectoryAngle = newRoatationAngle;
		//}

		if( eyeBaller.settings.lastTrajectoryAngle !== 0 ){

			if( eyeBaller.settings.lastTrajectoryAngle < 0){

				leftPosition = -(eyeBaller.ui.pwa.position().left / 2 );
				//newTop = eyeBaller.settings.ebHeight() ;

			} else if( eyeBaller.settings.lastTrajectoryAngle > 0 ){
				leftPosition = (eyeBaller.ui.pwa.position().left / 2 );
				//newTop = 0;;
			}
		}

		var newWidth = function(){
			if( newRoatationAngle !== 0){
				return eyeBaller.settings.crossLength() - 10;
			} else {
				return  $(window).width() - 10;
			}
		};
		console.log("newWidth: " + newWidth() );

		var goToPosition = eyeBaller.ui.pwa.width() - eyeBaller.ui.point.width();
		if( eyeBaller.settings.lastTrajectoryAngle !== 0){
			//goToPosition = eyeBaller.settings.crossAngle;
		}



		// Set everything up in a timeline

		tl2 = new TimelineMax({ repeat: eyeBaller.settings.soundCnt, onRepeat: eyeBaller.playSound, yoyo: true })
			.set( eyeBaller.ui.pwa, { width:  newWidth() })
			.set( eyeBaller.ui.pwa, { /* left: leftPosition */ transform: 'translate3d(0, 0, 0)' })
			.set( eyeBaller.ui.pwa, {left: leftPosition, top: newTop,  rotation : newRoatationAngle , transformOrigin:"left top" } )

			.set( eyeBaller.ui.point, { x: 0  ,transform: 'translate3d(0, 0, 0)' })
			.clear() /* Empties the timeline */
			.paused(isPaused) /* Pauses the timeline based on its previous paused state */
			.to( eyeBaller.ui.point, eyeBaller.settings.getCurrentDuration, { x: newWidth(),  ease: Power0.easeNone });

	},

	/* alternate playing beeps on odd / even count
	 *   ODD :
	 *       play head moved to far right
	 *      play right sound
	 *   EVEN :
	 *       play head moved back to the far left
	 *      play left sound
	 * */
	playSound: function () {
		//alert( eyeBaller.settings.mediaPath + "     eyeBaller.settings.soundOn: " + eyeBaller.settings.soundOn );

		if (eyeBaller.settings.soundOn) {
			if (eyeBaller.settings.app) {

				if (eyeBaller.resources.audio.left === undefined) {
					//alert('initializing media on Android')
					eyeBaller.resources.audio.left = new Media(eyeBaller.settings.mediaPath + 'left-sputnik.ogg', /*onSuccess*/ function () { /*alert('audio success')*/
					}, /*onError*/ function () { /*alert('audio Media error')*/
					});
					eyeBaller.resources.audio.right = new Media(eyeBaller.settings.mediaPath + 'right-sputnik.ogg', /*onSuccess*/ function () { /*alert('audio success')*/
					}, /*onError*/ function () { /*alert('audio Media error')*/
					});
				}
			}

			if (eyeBaller.settings.soundCnt % 2 == 0) {
				eyeBaller.resources.audio.left.play();
			} else {
				eyeBaller.resources.audio.right.play();
			}
		}
		eyeBaller.settings.soundCnt = eyeBaller.settings.soundCnt - 1;

		// totoal duration is number of seconds animation will last

		var tt = tl2.totalDuration() - tl2.totalTime();

		var hrs = Math.floor(tt / (60 * 60 ));
		var min = Math.floor(tt / 60);
		var sec = tt - min * 60;

		//console.log("total time: " + tl2.totalTime() );
		eyeBaller.settings.currentTime.text(eyeBaller.pad(hrs) + ":" + eyeBaller.pad(min) + ":" + eyeBaller.pad(Math.floor(sec)));
		eyeBaller.settings.cntDisplay.text(eyeBaller.settings.soundCnt);
	},

	ui : {
		pwa  : $('.pointWorkArea'),

		positionPwa : function(){
			eyeBaller.ui.pwa.css({
				'top' : eyeBaller.settings.ebHeight() / 2
			});
		},
		point : $("#point"),
		pointLeftPosition : function(){
			var sidea = eyeBaller.ui.point.width();
			var sideb = eyeBaller.ui.point.width();

			var sidec = (sidea * sidea) + (sideb * sideb);
			//console.log( "sidec: " + sidec);
			sidec = Math.sqrt(sidec);

			/*
			console.log( "Math.sqrt(sidec): " + sidec );
			console.log( "eyeBaller.rounder( sidec ): " + eyeBaller.rounder( sidec ) );
			console.log( "eyeBaller.ui.point.width() / 2: " + (eyeBaller.ui.point.width() / 2 )  )
			console.log( "eyeBaller.rounder( sidec ) - eyeBaller.ui.point.width() / 2: " + ( eyeBaller.rounder( sidec ) - (eyeBaller.ui.point.width() / 2 )) );
			console.log( "pointLeftPosition:: sideb: " + sideb + "  sidea: " + sidea );
			console.log("test: " + (  eyeBaller.rounder(  Math.sqrt( ( (10 * 10) + (10 * 10) ) ) )  ));
			*/
			return eyeBaller.rounder( sidec ) - ( eyeBaller.ui.point.width() / 2);

		},

		/* by default initial profile is horizonal level
		0 == level
		1 == up
		2 == down;
		up
		*/
		profile : 0,

		/* orientation will be set the first time it changes */
		orientation : ""
	},

	settings: {

		/* work area ui */

		ebHeight : function(){
			//console.log( "ebHeight called");
			return ( $(window).height() - document.getElementById('controls').scrollHeight ) - ( $('#point').height() / 2  );
		},
		ebWidth : function () {
			//console.log( "ebWidth called")
			return $(window).width();
		},

		crossAngle : function(){
			atanx = Math.atan( eyeBaller.settings.ebHeight() / eyeBaller.settings.ebWidth() ); // (result in radians)
			anglex = atanx * 180 / Math.PI; // converted to degrees
			return eyeBaller.rounder( anglex );
		},

		lastTrajectoryAngle : 0,

		crossLength : function(){
			var sidec = (eyeBaller.settings.ebWidth() * eyeBaller.settings.ebWidth() ) + (eyeBaller.settings.ebHeight() * eyeBaller.settings.ebHeight());
			return eyeBaller.rounder( Math.sqrt(sidec) );
		},


		running: false,
		keepGoing: true,
		currentDuration: 2,
		get getCurrentDuration(){
			return this.currentDuration;
		},
		set setCurrentDuration( v ){
			this.currentDuration = v;
		},

		y: 0,

		app: false,
		soundOn: false,
		startY: 0,
		topLeft : 0,
		middleLeft : 0,
		bottomLeft : 0,
		mediaPath: "",

		soundCnt: 0,
		cntDisplay: $('#currentCount'),
		currentTime: $('#currentTime'),
		currentDurationTxt : $('#currentSpeed'),

		runningTimeMin: 0,
		runningTimeSec: 0,


		get x(){
			//console.log( "getX: " + ( $(window).width() - 20 ) );
			return $(window).width() - 20 ;
		},
		get repeat(){
			//console.log( "repeat: " + 900 )
			return 900;
		}

	}, /* END SETTINGS */

	getX : function(){
		alert( this.settings.x)
		return this.settings.x
	},


	start : function(){
		eyeBaller.settings.running = true;
		tl2.play();
	},
	stop : function(){
		eyeBaller.settings.running = false;
		eyeBaller.settings.dead = true;
		tl2.kill();
	},
	pause : function () {
		eyeBaller.settings.running = false;
		tl2.pause();
	},
	resume : function(){
		eyeBaller.settings.running = true;
		tl2.resume();
	},
	reStart : function(){
		if( eyeBaller.settings.dead ) {
			tl2.play();
		} else {
			tl2.duration(eyeBaller.settings.currentDuration);
			tl2.restart(false, true);
		}
		eyeBaller.settings.running = true;
	},

	preventSleep : function(){
		if( eyeBaller.settings.app){
			window.plugins.insomnia.keepAwake();
		}
	},

	changeProfile : function( trajectoryAngle ){
		//alert( trajectoryAngle )
		// Gets if the tween is paused
		var isPaused = tl2.paused();
		var leftPosition = 0;
		var newTop = eyeBaller.settings.ebHeight()  / 2;

		eyeBaller.settings.ebHeight();
		eyeBaller.settings.ebWidth();

		if( trajectoryAngle == 0 ){
			eyeBaller.ui.profile = 0

		} else if( trajectoryAngle < 0 ){
			eyeBaller.ui.profile = 1;
			newTop = eyeBaller.settings.ebHeight();

		} else {
			eyeBaller.ui.profile = 2;
			newTop = 0;
		}
		//console.log( "eyeBaller.settings.ebHeight(): " + eyeBaller.settings.ebHeight() );
		//console.log( "eyeBaller.settings.ebWidth(): " + eyeBaller.settings.ebWidth())
		var angle = trajectoryAngle;

		var pointLeftPosition = function(){
			if( eyeBaller.ui.profile !== 0){
				return (eyeBaller.ui.pointLeftPosition() / 2 );
			} else {
				return 0;
			}
		}

		console.log("pointLeftPosition: " + eyeBaller.ui.pointLeftPosition());

		console.log( 'calculated angle: ' + eyeBaller.settings.crossAngle() );

		if( trajectoryAngle !== 0 ){
			leftPosition = -eyeBaller.ui.pwa.position().left;
			if( trajectoryAngle < 0) {
				//angle = (eyeBaller.settings.crossAngle()) * -1;
			} else {
				//angle = eyeBaller.settings.crossAngle();
			}

		}

		var newWidth = function(){
			if( trajectoryAngle !== 0){
				return eyeBaller.settings.crossLength();
			} else {
				return  $(window).width();
			}
		};

		console.log( "trajectoryAngle: " + angle );

		eyeBaller.settings.lastTrajectoryAngle = angle;

		// Set everything up in a timeline
		tl2.pause( );
		tl2 = new TimelineMax({ repeat: eyeBaller.settings.soundCnt, onRepeat: eyeBaller.playSound, yoyo: true })
			.set( eyeBaller.ui.pwa, { width: newWidth(), top : newTop,  rotation : angle,  transformOrigin:"left top"  })
			.set( eyeBaller.ui.pwa, { left: leftPosition })
			.set( eyeBaller.ui.point, { x: 0, left: pointLeftPosition(), transform: 'translate3d(0, 0, 0)' })
			.clear() /* Empties the timeline */
			.paused(isPaused) /* Pauses the timeline based on its previous paused state */
			.to( eyeBaller.ui.point, eyeBaller.settings.getCurrentDuration, { x: newWidth(), ease: Power0.easeNone });
	},

	profile0 : function () {
		eyeBaller.changeProfile( 0 );
	},

	profile1 : function(){
		eyeBaller.changeProfile( (eyeBaller.settings.crossAngle()) * -1);
	},

	profile2 : function(){
		eyeBaller.changeProfile( eyeBaller.settings.crossAngle() );
	},

	allowSleep : function(){
		if( eyeBaller.settings.app){
			window.plugins.insomnia.allowSleepAgain()
		}
	},

	resources : {
		audio : {}
	},

	init: function () {

		eyeBaller.ui.positionPwa();

		/* solve for slant distance:
		 http://www.nayuki.io/res/triangle-solver-javascript/triangle-solver.js
		 http://www.pagetutor.com/trigcalc/trig.html
		 */

		var sideb = eyeBaller.settings.ebWidth();
		var sidea = eyeBaller.settings.ebHeight();

		// solve for side c
		var sidec = (sidea * sidea) + (sideb * sideb);
		sidec = Math.sqrt(sidec);

		// solve for angle x
		tanx = sidea / sideb;
		atanx = Math.atan(tanx); // (result in radians)
		anglex = atanx * 180 / Math.PI; // converted to degrees

		//eyeBaller.settings.crossAngle = eyeBaller.rounder( anglex );
		//eyeBaller.settings.crossLength = eyeBaller.rounder( sidec );


		/* set path to media files - Android or Webpage app */
		if (eyeBaller.settings.app) {
			// PhoneGap application
			eyeBaller.settings.mediaPath = "/android_asset/www/js/";
		} else {
			// Web page
			eyeBaller.settings.mediaPath = "js/";
		}

		$('#onOffIndicator').click(function () {
			if ($(this).hasClass('soundOn')) {
				$(this).removeClass('soundOn').addClass('soundOff');
				eyeBaller.settings.soundOn = false;
			} else {
				$(this).removeClass('soundOff').addClass('soundOn');
				eyeBaller.settings.soundOn = true;
			}
		});

		$('#start').click( eyeBaller.start );

		$('#stop').click( eyeBaller.stop );

		$('#profile0').click( eyeBaller.profile0 );
		$('svg#profile1').click( eyeBaller.profile1 );
		$('#profile2').click( eyeBaller.profile2 );

		$('.allowSleep').click( eyeBaller.allowSleep );


		/* change colors on profile squares */
		$('.profileSqr').click( function(){

			$('.profileSqr').each( function(){
				$( this ).attr('class','profileSqr');
			});

			$(this).attr('class', 'profileSqr selectedProfile');
		});

		$('#pause').click( eyeBaller.pause );
		$('#resume').click( eyeBaller.resume );
		$('#restart').click( eyeBaller.reStart );

		$('#currentSpeed').text( eyeBaller.settings.getCurrentDuration );
		$('#currentCount').text( eyeBaller.settings.repeat );

		$('.upOrDown').click(function () {
				if( $(this).hasClass('increaseSpeed')) {
					eyeBaller.settings.setCurrentDuration = Math.round( (eyeBaller.settings.getCurrentDuration + 0.1) * 10 ) / 10;
					eyeBaller.settings.currentDurationTxt.text( eyeBaller.settings.getCurrentDuration );
				} else {
					eyeBaller.settings.setCurrentDuration = Math.round( (eyeBaller.settings.getCurrentDuration - 0.1) * 10 ) / 10;
					eyeBaller.settings.currentDurationTxt.text( eyeBaller.settings.getCurrentDuration );
				}

			tl2.pause();
			var z = tl2.progress();
			tl2.duration( eyeBaller.settings.getCurrentDuration );
			tl2.progress(z).play();

		});

		$('.preventSleep').click( eyeBaller.preventSleep );
		$('.allowSleep').click( eyeBaller.allowSleep );


		if( !tl2.isActive() ) {
			eyeBaller.settings.soundCnt = eyeBaller.settings.repeat;
			tl2.updateTo({

				x: eyeBaller.settings.x,
				onRepeat: eyeBaller.playSound

			})
				.repeat(eyeBaller.settings.repeat)
				.duration(eyeBaller.settings.getCurrentDuration);
		}

		/* START AUDIO RELATED */
		if( eyeBaller.settings.app) {
			//alert("trying to set Media, path: " + eyeBaller.settings.mediaPath + 'left-sputnik.ogg' );
			//eyeBaller.resources.audio.left = new Media(eyeBaller.settings.mediaPath + 'left-sputnik.ogg', /*onSuccess*/ function(){ alert('audio success')}, /*onError*/ function(){ alert('audio Media error')});
			//eyeBaller.resources.audio.right = new Media(eyeBaller.settings.mediaPath + 'right-sputnik.ogg', /*onSuccess*/ function(){ alert('audio success')}, /*onError*/ function(){ alert('audio Media error')}  );

		} else {
			eyeBaller.resources.audio.left = new Audio(eyeBaller.settings.mediaPath + 'left-sputnik.ogg' );
			eyeBaller.resources.audio.right = new Audio(eyeBaller.settings.mediaPath + 'right-sputnik.ogg' );
		}


		/* END AUDIO RELATED */

	}, /* end init */

	pad : function( val ){
		var padVal = 0;
		if( val < 10 ){
			padVal = "0" + val.toString();

		} else if( val == 0 ){
			padVal = "00"
		}
		else{
			padVal = val;
		}
			return padVal;
	},

	rounder : function(result)
	{
		var roundmultiplier = 100;

		if (roundmultiplier == 0)
		{
			rounded = result;
			return rounded;
		}
		else
		{
			rounded = Math.round(result * roundmultiplier);
			rounded = rounded / roundmultiplier;
			return rounded;
		}
	}
};

$(document).ready(function () {
//alert( eyeBaller.resources.audio.left )
	//console.log( "doc ready orientation: " + window.orientation );
	if (window.cordova) {
		//alert( window.location.pathname )
		eyeBaller.settings.app = true;
		eyeBaller.settings.setCurrentDuration = 1 ;
		eyeBaller.init();
	} else {
		eyeBaller.settings.setCurrentDuration = 1 ;
		eyeBaller.init();
	}

	$(window).on("orientationchange",function( e ){
		//alert("The orientation has changed!");
		eyeBaller.resetAnimation( e.orientation );
	});


	$(document).keydown(function (e) {
		if (e.keyCode == '32') {
			//console.log('space');
			if (eyeBaller.settings.running === true) {
				eyeBaller.settings.running = false;
				tl2.pause();
			} else {
				eyeBaller.settings.running = true;
				tl2.resume();
			}
		}
	});
});