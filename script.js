let authToken = "";
let clientID = "";

var scamersTotalList = [
	'xou____', 
	'zed_b', 
	'emizdar', 
	'patayencroute',
	'amouranth', 
	'mistermv', 
	'aminematue', 
	'etoiles', 
	'mlle_sunny', 
	'jeanmassiet'
	];


function loadScam() {

var urlParams = new URLSearchParams(window.location.search);
var scamGet = urlParams.getAll('scamer');
var showChat = urlParams.get('active_chat');
var chat_position = urlParams.get('embed_chat_position');
/*
var full_scam_now = urlParams.get('full_scam_after_reload');

	Pas possible de full screen sans action utilisateur

	*/
	
var checker = [];
	
if(scamGet.length == 0) {
	scamGet[0] = "zed_b";
} else {
	jQuery(scamGet).each(function(i, val){
		if(val.length !== 0){
			scamersTotalList.indexOf(scamGet[i]) === -1 ? scamersTotalList.push(scamGet[i]) : console.log("scamer exist") ;
			checker.push(val);
		}
	});
}
for(var i=0; i<checker.length; i++) {
	jQuery("#channel-to-feed").append("<option value='"+checker[i]+"'>"+checker[i]+"</option>");
}

if(!showChat) {
	var player = "embed";
} else {
	var player = showChat;
}
jQuery('[name="active_chat"]').removeAttr('checked');
jQuery("input[name=active_chat][value=" + player + "]").prop('checked', true);

if(!chat_position && showChat == "embed") {
	chat_position = "top-right";
}

jQuery("#embed_chat_position").prop("selected", false);
jQuery("#embed_chat_position [value='"+chat_position+"']").prop("selected", true);

var result = {
	'showChat': {'player': player, 'position': chat_position},
	'scamers': checker,
	'full_scam': false
}

  return result;
}

function StartThisShit(config) {
	if(config.scamers.length == 1) {
		jQuery(".page-title").append(config.scamers[0] + " scam");
		jQuery(document).prop('title', config.scamers[0] + " scam");
		jQuery("body").addClass(config.scamers[0]);
	} else {
		jQuery(".page-title").append("Multi scam");
		jQuery(document).prop('title', "Multi scam ("+ config.scamers.join(', ')+")");
	}

	jQuery("body").addClass("viewer"+config.scamers.length+"video", );
	
		var layout="video";
		if(config.showChat.player == 'playertwitch') {
			layout="video-with-chat";
		}

		for(var i=0; i< config.scamers.length; i++){
		jQuery(".twitch-video").append("<div class='viewer'><div class='twitch-description' id='"+config.scamers[i]+"'><nav class='scroll'><div class='chatscroll'></div></nav></div><div class='twitch-embed'  id='twitch-embed"+(i+1)+"'></div></div>");
		
		  new Twitch.Embed("twitch-embed"+(i+1), {
			width: "100%",
			height: "100%",
			layout: layout,
			channel: config.scamers[i]
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
			
		      if(user.user_login.toLowerCase() == scamer.toLowerCase() || user.user_name.toLowerCase() == scamer.toLowerCase()){
				getBroadcast(user.user_id);
                  updateScammerStatus(true, user); 
			      flag = true;
			}	
		});
		if(flag === false) {
			updateScammerStatus(false, scamer);
		}
	});

	for(var i = 0; i<scamersToShowList.length;i++) {
		if(scamersToShowList[i].indexOf("#") != -1) {
			jQuery('input'+scamersToShowList[i]).prop("checked", true);
		} else {
			jQuery('input#'+scamersToShowList[i]).prop("checked", true);
		}
	}
	
	return true;
}

function updateScammerStatus(online, scamer) {
	//User is an online object
	if(typeof scamer === 'object' && !Array.isArray(scamer) && scamer !== null){
		var duration = timeDiffCalc(new Date(scamer.started_at), new Date());
		var thumbnail_resized = scamer.thumbnail_url.replace(/{width}|{height}/gi, 60);
		var game = scamer.game_name;

		jQuery(".channel-form .online-stream").prepend(""+
		"<div class='channels'>"+
			"<input type='checkbox' id='"+scamer.user_login+"' name='scamer' value='"+scamer.user_login+"'/>"+
			"<div class='title'>"+
				"<img src='"+ thumbnail_resized+"'/>"+ scamer.title +" "+
				"<div class='infos'>"+scamer.viewer_count+" Victimes</div>"+
				"<div class='date'>"+duration+"</div>"+
			"</div>"+
			"<i class='online-icon'></i><label for='" + scamer.user_login + "' >" + scamer.user_name + "</label>"+
			"<small class='game'><i>"+game+"</i></small>"+
		"</div>"
		);
	}else{
		jQuery(".channel-form .offline-stream").prepend(""+
			"<div class='channels'>"+
				"<input type='checkbox' id='"+scamer+"' name='scamer' value='"+scamer.toLowerCase()+"'/>"+
				"<i class='offline-icon'></i>"+
				"<label for='" + scamer + "'>" + scamer + "</label>"+
			"</div>"
		);
	}
		return true;
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

      } else {
		console.log("bId erreur");
      }
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
function setCookie(name, value, options = {}) {

  options = {
    path: '/',
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}
function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

jQuery(document).ready(function(){
	var scamConf = loadScam();
setCookie('user', 'John', {secure: true, 'max-age': 3600});
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
		  updateStatuses(c.data, scamConf["scamers"]);
	   }
	});
	
	StartThisShit(scamConf);
	
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

	//setCookie('Scamers', scamConf["scamers"], {secure: true, 'max-age': 2147483647});
/*
	Pas possible de full screen sans action utilisateur
	if(scamConf.full_scam) {
		if(IsFullScreenCurrently())
			GoOutFullscreen();
		else
			GoInFullscreen(jQuery("#myScamPlayer").get(0));
	}
	*/
	
	
	jQuery(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function() {
		if(IsFullScreenCurrently()) {

		}
		else {

		}
	});
	if(scamConf['showChat']['player'] == 'embed') {		
		const client = new tmi.Client({
			channels: scamConf['scamers']
		});

		client.connect();
		client.on('message', (channel, tags, message, self) => {						
			
		  jQuery('.twitch-description'+channel.toLowerCase()+' > .scroll > div')
			  .append(""+
				  "<div class='embed-message "+tags.id+"'>" +
						"<div class='time'>"+
							"<p>display-name: "+tags['display-name']+"</p>"+
							"<p>first-msg: "+tags['first-msg']+"</p>"+
							"<p>flags: "+tags['flags']+"</p>"+
							"<p>modo: "+tags['mod']+"</p>"+
							"<p>subscriber: "+tags['subscriber']+"</p>"+
							"<p>turbo: "+tags['turbo']+"</p>"+
						"</div>"+
					  "<span style='color:"+tags['color']+"' class='scamer'>"+tags['display-name']+"</span>"+
					  "<span class='message'>"+message+"</span>"+
				  "</div>"
				);
			
				if(tags.badges !== null) {
					jQuery('.twitch-description'+tags.id+' > .embed-message > .time').append(""+
						"<span class='premium'>"+(tags.badges.premium)+"</span>"
					);
					jQuery('.twitch-description'+tags.id+' > .embed-message > .time').append(""+
						"<span class='subscriber'>"+(tags.badges.subscriber)+"</span>"
					);		
				}

				jQuery(channel.toLowerCase()+' > nav.scroll').scrollTop(jQuery(channel.toLowerCase()+' > nav.scroll > div.chatscroll').height());
				
				if(jQuery(channel.toLowerCase()+' > nav.scroll > .chatscroll > div').length == 150) {
					jQuery(channel.toLowerCase()+' > nav.scroll > .chatscroll > div').eq(0).remove();
				}
			/*	
				jQuery(channel.toLowerCase()).animate( {
					scrollTop: jQuery(channel.toLowerCase()+' div').height()
				}, 
				300
			);*/
		});
		
		client.on("connected", function (address, port) {
			jQuery(scamConf['scamers']).each(function(i, scamerViewer){
				jQuery('.twitch-description'+scamerViewer).addClass(scamConf['showChat']['position']);
			});
		});
	}
	
});

/*

-------envoyer message dans l'embed chat-----

(modifier qualité pour tous (formulaire))

choisir ses chats embed

redo scrollToBottom chat 

finir position du player

Scammer list en SESSION

css 7viewer + description + position

*/






