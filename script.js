let authToken = "";
let clientID = "";

var scamersTotalList = [
	'Xou____', 
	'Zed_B', 
	'emizdar', 
	'patayencroute', 
	'amouranth', 
	'mistermv', 
	'zgolene', 
	'slackos_tv'
	];


function loadScam() {
var urlParams = new URLSearchParams(window.location.search);
var scamGet = urlParams.getAll('scamer');
var showChat = urlParams.get('active_chat');
var chat_position = urlParams.get('embed_chat_position');

var result = {
	'showChat': {'status': showChat, 'position': chat_position},
	'scamers': scamGet
}
   console.log(result);
  return result;
}

function StartThisShit(scamers, showChat) {
	if(scamers.length == 1) {
		jQuery(".page-title").append(scamers[0] + " scam");
		jQuery(document).prop('title', scamers[0] + " scam");
	} else {
		jQuery(".page-title").append("Multi scam");
		jQuery(document).prop('title', "Multi scam ("+ scamers.join(', ')+")");
	}

	jQuery("body").addClass("viewer"+scamers.length+"video", );
	
	jQuery("input[name=active_chat][value='"+showChat+"']").prop("checked",true);

	if(scamers.length == 1) {
		jQuery("body").addClass(scamers[0]);
	}	
	jQuery("input[name=active_chat][value='"+showChat['status']+"']").prop("checked",true);
	
	jQuery("body").addClass("viewer"+scamers.length+"video");
	
		var layout="video-with-chat";
		if(showChat !== "true") {
			layout="video";
		}

		for(var i=0; i<scamers.length; i++){
		jQuery(".twitch-video").append("<div class='viewer'><div class='twitch-description' id='"+scamers[i].toLowerCase()+"'><div></div></div><div class='twitch-embed'  id='twitch-embed"+(i+1)+"'></div></div>");
		
		  new Twitch.Embed("twitch-embed"+(i+1), {
			width: "100%",
			height: "100%",
			layout: layout,
			channel: scamers[i]
		  });	 
		}
		
		jQuery(".viewer > div").each(function(viewer){
			jQuery(viewer).addClass(viewer);
		});

		return true;
}

function updateStatuses(response, scamersToShowList) {	
	jQuery(scamersTotalList).each(function(scam, value){
            var scamer = value;
		let flag = false;
		
		jQuery(response).each(function(val, user){
			//console.log(scamer);
			//console.log(user.user_login);
			//console.log(user.user_name);
			
			
			//console.log(user.user_login);
			//console.log(user.user_login);
			
			
		      if(user.user_login == scamer || user.user_name == scamer || user.user_name.toLowerCase() == scamer || user.user_login.toLowerCase() == scamer){
				getBroadcast(user.user_id);
                        updateScammerStatus(true, user); 
			      flag = true;
			}	
		});
		if(flag == false) {
			updateScammerStatus(false, scamer);
		}
		
		jQuery(scamersToShowList).each(function(){
			jQuery('.channel-form '+this.toLowerCase()).attr("checked", "checked");
		});			
	});
}

function updateScammerStatus(online, scamer) {
	if(online === true){
		var duration = timeDiffCalc(new Date(scamer.started_at), new Date());
		var thumbnail_resized = scamer.thumbnail_url.replace(/{width}|{height}/gi, 60);
		var game = scamer.game_name;

		jQuery(".channel-form .online-stream").prepend("<div class='channels'><input type='checkbox' id='"+scamer.user_login+"' name='scamer' value='"+scamer.user_login+"'/><div class='title'><img src='"+ thumbnail_resized+"'/>"+ scamer.title +"<div class='infos'>"+scamer.viewer_count+" Victimes</div><div class='date'>"+duration+"</div></div><i class='online-icon'></i><label for='"+scamer.user_login+"' >" + scamer.user_name + "</label><small class='game'><i>"+game+"</i></small></div>");
	}else{
		jQuery(".channel-form .offline-stream").prepend("<div class='channels'><input type='checkbox' id='"+scamer.toLowerCase()+"' name='scamer' value='"+scamer.toLowerCase()+"'/><i class='offline-icon'></i><label for='"+scamer.toLowerCase()+"'>" + scamer + "</label></div>");
	}
}

function timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    let difference = '';
    if (days > 0) {
      difference += (days === 1) ? `${days}j` : `${days}j`;
    }
    difference += (hours === 0 || hours === 1) ? `${hours}h` : `${hours}h`;
    difference += (minutes === 0 || hours === 1) ? `${minutes}m` : `${minutes}m`; 
    return difference;
}

function getBroadcast(scamerId) {

jQuery.ajax(
{
   type: 'GET',
   url: 'https://api.twitch.tv/helix/users?id=' + scamerId,
   headers: {
     'Client-ID': clientID,
     'Authorization': 'Bearer ' + authToken
   },
   success: function(c){
      if (c.data.length > 0) {
		//getBroadcasterRewards(c.data[0]);
		//getBroadcasterCheermotes(c.data[0]);
      } else {
		console.log("bId erreur");
      }
   }

});

}


function getBroadcasterCheermotes(scamerBroadcast) {
jQuery.ajax(
{
   type: 'GET',
   url: 'https://api.twitch.tv/helix/bits/cheermotes?broadcaster_id=' + scamerBroadcast["id"],
   headers: {
     'Client-ID': clientID,
     'Authorization': 'Bearer ' + authToken
   },
   success: function(c){
      if (c.data.length > 0) {
		console.log(c.data);
      } else {

      }
   },
   error: function(c){

   }

});

}



function getBroadcasterRewards(scamerBroadcast) {
jQuery.ajax(
{
   type: 'GET',
   url: 'https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=' + scamerBroadcast["id"],
   headers: {
     'Client-ID': clientID,
     'Authorization': 'Bearer ' + authToken
   },
   success: function(c){
      if (c.data.length > 0) {
		console.log("rewards OK");
		console.log(c.data);
      } else {
            console.log("rewards NOK (no rewards)");
            console.log(c.data["error"]);
      }
   },
   error: function(c){
        console.log("rewards NOK (rights)");
        console.log(c.responseJSON.message);
   }

});

}


/* Get into full screen */
function GoInFullscreen(element) {
	if(element.requestFullscreen)
		element.requestFullscreen();
	else if(element.mozRequestFullScreen)
		element.mozRequestFullScreen();
	else if(element.webkitRequestFullscreen)
		element.webkitRequestFullscreen();
	else if(element.msRequestFullscreen)
		element.msRequestFullscreen();
}
/* Get out of full screen */
function GoOutFullscreen() {
	if(document.exitFullscreen)
		document.exitFullscreen();
	else if(document.mozCancelFullScreen)
		document.mozCancelFullScreen();
	else if(document.webkitExitFullscreen)
		document.webkitExitFullscreen();
	else if(document.msExitFullscreen)
		document.msExitFullscreen();
}

/* Is currently in full screen or not */
function IsFullScreenCurrently() {
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	// If no element is in full-screen
	if(full_screen_element === null)
		return false;
	else
		return true;
}

jQuery(document).ready(function(){
	var scamConf = loadScam();

	var urlscammers = "";

	scamersTotalList.forEach(function(scam) {
	   urlscammers = urlscammers + "user_login=" + scam + "&";
	});	
	
	jQuery.ajax(
	{
	   type: 'GET',
	   url: 'https://api.twitch.tv/helix/streams?' + urlscammers,
	   headers: {
		 'Client-ID': clientID,
		 'Authorization': 'Bearer ' + authToken, 
	   },
	   success: function(c){
		  //data array is empty when queried channel is offline
		if (c.data.length > 0) {
			console.log(c.data);
		  }
		  console.log(scamConf);
		  updateStatuses(c.data, scamConf['scamers']);
	   }
	});
	
	if(scamConf['scamers'].length == 0) {
		//No get
		scamConf['scamers'][0] = "Zed_B";		
	}
	
	if((scamConf['showChat']['status'] === 'embed') || (scamConf['showChat']['status'] === null)){
		//Embed or not get (default embed)
		jQuery('.channel-form [value=embed]').prop('selected', true);
		jQuery('.channel-form select#embed_chat_position').removeAttr('disabled');
	} else {
		//Not Embed and not get (default embed)
		jQuery('.channel-form select#embed_chat_position').prop('disabled', 'disabled');
		//jQuery('.channel-form [value='+scamConf['showChat']['status']+']').prop('selected', true);
	}
	
	StartThisShit(scamConf['scamers'], scamConf['showChat']);
	
	jQuery("#embed_chat_position").on('select', function(){
		if(jQuery(this).value == "embed") {
			console.log();
			console.log();
			jQuery('.channel-form select#embed_chat_position').prop('disabled', false);
		} else {
			console.log();
			console.log();
			
		}
	});		
	
	
	jQuery("h1.toggleShit").click(function(){
		jQuery(this).toggleClass("hide");
		jQuery(".status").toggle(300, "linear");
	});	
	
	jQuery("#go-button").on('click', function() {
		if(IsFullScreenCurrently())
			GoOutFullscreen();
		else
			GoInFullscreen(jQuery("#myScamPlayer").get(0));
	});

	jQuery(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
		if(IsFullScreenCurrently()) {

		}
		else {

		}
	});
	if(scamConf['showChat']['status'] == 'embed') {		
		const client = new tmi.Client({
			channels: scamConf['scamers']
		});

		client.connect();
		client.on('message', (channel, tags, message, self) => {			
			
		  jQuery('.twitch-description'+channel+' > div')
			  .append("<div class='embed-message "+tags["id"]+"'><span class='time'>"+tags["display-name"]+"<br>"+tags["first-msg"]+"<br>"+tags["flags"]+"<br>"+tags["subscriber"]+"<br>"+tags["turbo"]+"</span><span style='color:"+tags["color"]+"' class='scamer'>"+tags["display-name"]+"</span><span class='message'>"+message+"</span></div>");
			
				if(tags["badges"] !== null) {
					jQuery('.twitch-description'+tags["id"]+' > .embed-message > .time').append("<span class='premium'>"+(tags["badges"]["premium"])+"</span>");
					jQuery('.twitch-description'+tags["id"]+' > .embed-message > .time').append("<span class='subscriber'>"+(tags["badges"]["subscriber"])+"</span>");		
				}
				//jQuery('.twitch-description'+channel+' > div').position().top += 20;
		});
		
		client.on("connected", function (address, port) {
			jQuery(scamConf['scamers']).each(function(i, scamerViewer){
				jQuery('.twitch-description'+scamerViewer).addClass(scamConf['showChat']['position']);
			});
		});
	}
	
});



/*

Todo : 

fix default with no get











*/






