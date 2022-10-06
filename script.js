let authToken = "";
let clientID = "";

var scamersTotalList = [];
var bufferMessageSize = 150;


function getCookie(name) {
  const value = document.cookie;
  const parts = value.split(`; `+name+`=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
}


function loadScam() {

var urlParams = new URLSearchParams(window.location.search);

var showChat = urlParams.get('active_chat');
var newScamer = urlParams.getAll('newScamer');
var scamGet = urlParams.getAll('scamer');
var checker = [];

if(getCookie("Scamers") === undefined) {
} else {
	scamersTotalList = getCookie("Scamers").split(',');
}

if(newScamer) {
	for(var i=0; i<newScamer.length; i++) {	
		if(!scamersTotalList.includes(newScamer[i].toLowerCase()) && newScamer[i] !== '') {
			scamersTotalList.push(newScamer[i].toLowerCase());
			setCookie('Scamers', scamersTotalList, 60);
		} else {
			console.log("already exist or empty -- skip");
		}
	}
}
	
for(var i=0; i<scamersTotalList.length; i++) {
	jQuery("#channel-to-feed").append("<option value='"+scamersTotalList[i]+"'>"+scamersTotalList[i]+"</option>");
}

if(!showChat) {
	var player = "embed";
} else {
	var player = showChat;
}
jQuery('[name="active_chat"]').removeAttr('checked');
jQuery("input[name=active_chat][value=" + player + "]").prop('checked', true);

var result = {
	'showChat': {'player': player},
	'scamers': scamGet,
	'full_scam': false
}

  return result;
}

function StartThisShit(config) {
	if(config.scamers.length == 1) {
		jQuery(".page-title").append(config.scamers[0] + " player");
		jQuery(document).prop('title', config.scamers[0] + " player");
		jQuery("body").addClass(config.scamers[0]);
		var muted = false;
	} else {
		jQuery(".page-title").append("Multi player");
		jQuery(document).prop('title', "Multi player ("+ config.scamers.join(', ')+")");
		var muted = true;
	}

	jQuery("body").addClass("viewer"+config.scamers.length+"video", );

		for(var i=0; i< config.scamers.length; i++){
		jQuery(".twitch-video").append("<div class='viewer'><div class='ui-widget-content twitch-description' id='"+config.scamers[i]+"'><nav class='scroll'><div class='chatscroll'></div></nav></div><div class='twitch-embed'  id='twitch-embed"+(i+1)+"'></div></div>");
		
		  new Twitch.Embed("twitch-embed"+(i+1), {
			width: "100%",
			height: "100%",
			layout: "video",
			allowfullscreen: false,
			muted: muted,
			channel: config.scamers[i]
		  });	 
		}
		
		jQuery(".twitch-description").draggable({ containment: "parent" });
		jQuery(".twitch-description").dblclick(function() {
			jQuery(this).toggleClass("hide");
		});

		jQuery(".twitch-description").resizable({
		  containment: 'parent',
		  minWidth: 200,
		  minHeight: 200,
		  //maxWidth: 800,
		  classes: {
		  },
		  
		  handles: "n, e, s, w, ne, se, sw, nw",
		  start: function( event, ui ) {
			  jQuery(this).parent().css("pointer-events", "none");
		  },
		  stop: function( event, ui ) {
			  jQuery(this).parent().css("pointer-events", "initial");
		  }
		});	

		jQuery(".viewer > div").each(function(viewer){
			jQuery(viewer).addClass(viewer);
		});
		
	return true;
}

function updateStatuses(response, scamersToShowList) {	
	jQuery(".channels").remove();
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
			"<i class='online-icon'></i><label for='" + scamer.user_login + "' >" + scamer.user_name +"<small> ("+scamer.viewer_count+")</small></label>"+
			"<small class='game'><i>"+game+"</i></small>"+
			"<div data-scamer='" + scamer.user_login + "' class='remove'>x</div>"+
		"</div>"
		);
	}else{
		jQuery(".channel-form .offline-stream").prepend(""+
			"<div class='channels'>"+
				"<input type='checkbox' id='"+scamer+"' name='scamer' value='"+scamer+"'/>"+
				"<i class='offline-icon'></i>"+
				"<label for='" + scamer + "'>" + scamer + "</label>"+
				"<div data-scamer='" + scamer + "' class='remove'>x</div>"+
			"</div>"
		);
	}
	
	jQuery('.channels .remove').on('click', function() {		
		var scamer = jQuery(this).data("scamer");
		jQuery(this).parent(".channels").remove();
		var scamersTotalList = getCookie("Scamers").split(',');
		
		const index = scamersTotalList.indexOf(scamer);
		if (index > -1) {
		  scamersTotalList.splice(index, 1);
		}
		
		setCookie('Scamers', scamersTotalList.join(","), 60);
		return true;
	});
	
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




function GoInFullscreen(element) {
	if(element.requestFullscreen)
		element.requestFullscreen();
	else if(element.mozRequestFullScreen)
		element.mozRequestFullScreen();
	else if(element.webkitRequestFullscreen)
		element.webkitRequestFullscreen();
	else if(element.msRequestFullscreen)
		element.msRequestFullscreen();
	
	jQuery(element).addClass("fullscreen");
}

function GoOutFullscreen() {
	if(document.exitFullscreen)
		document.exitFullscreen();
	else if(document.mozCancelFullScreen)
		document.mozCancelFullScreen();
	else if(document.webkitExitFullscreen)
		document.webkitExitFullscreen();
	else if(document.msExitFullscreen)
		document.msExitFullscreen();
	jQuery("#myScamPlayer").removeClass("fullscreen");
}

function IsFullScreenCurrently() {
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	// If no element is in full-screen
	if(full_screen_element === null)
		return false;
	else
		return true;
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

jQuery(document).ready(function(){
	var scamConf = loadScam();
	var urlscammers = "";

	scamersTotalList.forEach(function(scam) {
	   urlscammers = urlscammers + "user_login=" + scam + "&";
	});	
	
	function myPeriodicMethod() {
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
		   },
		   complete: function() {
			  // schedule the next request *only* when the current one is complete:
			  setTimeout(myPeriodicMethod, 30000);
			}
		});	
	}

	myPeriodicMethod();
	StartThisShit(scamConf);
	
	
	jQuery("h1.toggleShit").click(function(){
		jQuery(this).toggleClass("hide");
		jQuery(".status").toggle(300, "linear");
	});		
	
	jQuery(document).keydown(function(e) {
	    var value = e.which;	
		
		switch (value) {
			case 32:
				//space
				if(IsFullScreenCurrently())
					GoOutFullscreen();
				else
					GoInFullscreen(jQuery("#myScamPlayer").get(0));
				break;
			case 17:
				//ctrl
				jQuery("h1.toggleShit").toggleClass("hide");
				jQuery(".status").toggle(300, "linear");
				break;

			case 96: 
				// 0 
				jQuery('.viewer').removeClass('mainViewer');
				break;
				
			case 37:
				//left
				var current = jQuery('.viewer.mainViewer').index();
				
				if(current == -1) current = scamConf["scamers"].length + 1;
				
				var newId = ((current-1) % scamConf["scamers"].length-1);
				
				jQuery('.viewer').removeClass('mainViewer');
				jQuery('.viewer').eq(newId).addClass('mainViewer');
				
				break;
			case 39:
				//right
				var current = jQuery('.viewer.mainViewer').index();	

				if(current == -1) current = scamConf["scamers"].length;				
				
				var newId = ((current+1) % scamConf["scamers"].length-1);
				
				jQuery('.viewer').removeClass('mainViewer');
				jQuery('.viewer').eq(newId).addClass('mainViewer');
				break;
				
			default:
				// 1-9 (1-N)
				switch(true)
				{
					case ((value > 96) && (value <= 96+scamConf["scamers"].length)): 
						
						jQuery('.viewer').removeClass('mainViewer');
						jQuery('.viewer').eq((value-96)-1).addClass('mainViewer');
						
						break;
				}
		}
		
	});
	
	
	
	
	jQuery(".tuto-add").hover(function(){
		jQuery('input[name=newScamer]').addClass('highlight');
		}, 
		function(){
			jQuery('input[name=newScamer]').removeClass('highlight');	
		}
	);	
	
	jQuery(".tuto-select").hover(function(){
		jQuery('.online-stream, .offline-stream').addClass('highlight');
		}, 
		function(){
			jQuery('.online-stream, .offline-stream').removeClass('highlight');	
		}
	);	
	jQuery(".tuto-enjoy").hover(function(){
		jQuery('.omg').addClass('highlight');
		}, 
		function(){
			jQuery('.omg').removeClass('highlight');	
		}
	);	
	jQuery('[name=scamer]').removeAttr('checked');
	
	jQuery(scamConf["scamers"]).each(function(i, val){
		if(val.length !== 0){
			jQuery("input[name=scamer]#"+val).prop('checked', 'checked');
		}
	});	
	
	jQuery("#go-button").on('click', function() {
		if(IsFullScreenCurrently())
			GoOutFullscreen();
		else
			GoInFullscreen(jQuery("#myScamPlayer").get(0));
	});
	
	if(scamConf['showChat']['player'] == 'embed') {
	
		const client = new tmi.Client({
			channels: scamConf['scamers']
		});
		client.connect();
		
/*		
		
		const option = {
		  options: {
			debug: true
		  },
		  connection: {
			cluster: "aws",
			reconnect: true
		  },
		  identity: {
			username: 'scamerbot',
			password: 'oauth:'
			},
		  channels: ["xou____"]
		};
		const client2 = new tmi.client(option);
		
		const formScam = jQuery('form[name="spam-area"]');
		
		client2.connect().catch((err) => {console.log('Connection error!', err)});

		formScam.on("submit", function(e) {
			e.preventDefault();
			client2.action(jQuery('#channel-to-feed').val(), jQuery('#spam-content').val())
			.then(data => {
				//console.log(`Sent "${data[1]}" to`, jQuery('#channel-to-feed').val());
			})
			.catch(err => {
				//console.log('[ERR]', err);
			});
		});
	
*/	

		client.on('message', (channel, tags, message, self) => {	
			let premium = "";
			let subscriber = "";
			let subgifts = "";
			console.log(message);
			console.log(tags);
			if(tags.badges !== null) {
				premium = tags.badges.premium;
				subscriber = tags.badges.subscriber;	
				subgifts = tags.badges.sub-gifter;	
			}
		    jQuery('.twitch-description'+channel.toLowerCase()+' > .scroll > div')
			  .append(""+
				  "<div class='embed-message "+tags.id+"'>" +
					"<div class='sender-message'>" +
					  "<span data-first-message='"+tags['first-msg']+"'>OMG ! Premier message !<br></span>"+
					  "<span title='OMG ! Flags !' data-flags='"+tags['flags']+"'>"+tags['flags']+"</span>"+
					  "<span title='OMG ! Modo !' data-modo='"+tags['mod']+"'> MODO: </span>"+
					  "<span title='OMG ! Turbo !' data-turbo='"+tags['turbo']+"'>TURBO</span>"+
					  "<span title='OMG ! Sub !' data-subscriber='"+tags['subscriber']+"'> SUB </span>"+
					  "<span style='color:"+tags['color']+"' class='scamer'>"+tags['display-name']+"</span>"+
					"</div>" +
					  "<span class='message'>: "+tags['flags']+" -- "+subgifts+" -- "+premium+" -- "+subscriber+" -- "+message+"</span>"+
				  "</div>"
				);

				jQuery(channel.toLowerCase()+' > nav.scroll').scrollTop(jQuery(channel.toLowerCase()+' > nav.scroll > div.chatscroll').height());
				
				if(jQuery(channel.toLowerCase()+' > nav.scroll > .chatscroll > div').length == bufferMessageSize) {
					jQuery(channel.toLowerCase()+' > nav.scroll > .chatscroll > div').eq(0).remove();
				}
		});
		
		client.on("connected", function (address, port) {

		});
	}
	
});


/*
envoyer message
reset list button
Options par chat (afficher, police)
stop autoscroll on chat hover
icones sub + modo + first + flags
(Bouton soft reload (keep fullscreen))
autocomplete addNewscamer https://dev.twitch.tv/docs/api/reference#search-channels
smileys in chat
*/






