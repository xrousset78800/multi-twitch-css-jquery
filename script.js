let authToken = "";
let clientID = "";

var scamersTotalList = [];
var bufferMessageSize = 150;

var themes = [ "default", "detached"];
var themeColors = [ "default", "dark", "light"];

function getCookie(name) {
  const value = document.cookie;
  const parts = value.split(`; `+name+`=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
}


function loadScam() {

var urlParams = new URLSearchParams(window.location.search);

var newScamer = urlParams.getAll('add');
var scamGet = urlParams.getAll('show');
var checker = [];

if(getCookie("Scamers") === undefined) {
	
} else {
	scamersTotalList = getCookie("Scamers").split(',');
	scamersTotalList = scamersTotalList.filter(function(val){
    if( val == '' || val == NaN || val == undefined || val == null ){
        return false;
    }
    return true;
});
}

if(newScamer) {
	for(var i=0; i<newScamer.length; i++) {	
		//Mono
		if(!scamersTotalList.includes(newScamer[i].toLowerCase()) && newScamer[i] !== '') {
			scamersTotalList.push(newScamer[i].toLowerCase());
			setCookie('Scamers', scamersTotalList, 60);
		} else {
			if(newScamer[i].indexOf(',') != -1){
				scamersTotalList.push(newScamer[i].split(','));
				setCookie('Scamers', scamersTotalList, 60);
			}
			console.log("already exist or empty -- skip");
		}
	}
}
	
for(var i=0; i<scamGet.length; i++) {
	jQuery("#channel-to-feed").append("<option value='"+scamGet[i]+"'>"+scamGet[i]+"</option>");
}

var result = {
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
		var player = [];
		for(var i=0; i< config.scamers.length; i++){
		jQuery(".twitch-video").append("<div data-theme-color='default' data-theme='default' class='viewer'><div class='ui-widget-content twitch-description' id='"+config.scamers[i]+"'><nav class='scroll'><div class='chatscroll'></div></nav></div><div class='twitch-embed' id='twitch-embed"+(i+1)+"'></div></div>");
		
		var options = {
			width: "100%",
			height: "100%",
			channel: config.scamers[i],
			allowfullscreen: false,
			// only needed if your site is also embedded on embed.example.com and othersite.example.com
			//parent: ["embed.example.com"]
		  };
		  
		  player[i] = new Twitch.Player("twitch-embed"+(i+1), options);
		  player[i].setVolume(0.0);

		}
		
		//player[0].setVolume(0.5);
		
		jQuery(".twitch-video .viewer").append("<div class='player-options'><span class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-minus ui-btn-icon-notext ui-btn-inline' data-down-font></span><span class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-plus ui-btn-icon-notext ui-btn-inline' data-up-font></span><select data-form-theme-color name='theme-color'></select><select data-form-theme name='theme'></select></div>");
		
		
		jQuery(themeColors).each(function(i, color){
			jQuery("[data-form-theme-color]").append("<option value='"+color+"'>Texte: "+color+"</option>");
		});
		
		jQuery(themes).each(function(i, color){
			jQuery("[data-form-theme]").append("<option value='"+color+"'>Theme: "+color+"</option>");
		});
		
		jQuery(".twitch-description").draggable({ containment: "parent" });
		
		jQuery("[data-form-theme-color]").on( "change", function(){
			jQuery(this).parent().parent().eq(0).attr("data-theme-color", this.value);
		});
		
		jQuery("[data-form-theme]").on( "change", function(){
			jQuery(this).parent().parent().eq(0).attr("data-theme", this.value);
		});
		
		
		jQuery(".twitch-description").dblclick(function() {
			jQuery(this).toggleClass("hide");
		});

		jQuery(".twitch-description").resizable({
		  containment: 'parent',
		  minWidth: 200,
		  minHeight: 80,
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
	/* Save user checked channels */
	var old = [];
	jQuery(".channels input").each(function(){
		if(jQuery(this).is(':checked')){
			old.push(jQuery(this).attr("id"));
		}
	});
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

	if(old.length > 0) {
		scamersToShowList = old;
	}

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
			"<input type='checkbox' id='"+scamer.user_login+"' tabIndex='3' name='show' value='"+scamer.user_login+"'/>"+
			"<div class='title'>"+
				"<div class='game'>"+
					"<img src='"+ thumbnail_resized+"'/>"+
					"<div class='game'>"+scamer.title +"</div>"+
				"</div>"+
				"<div class='infos'>"+scamer.viewer_count+" Victimes</div>"+
				"<div class='date'>"+duration+"</div>"+
			"</div>"+
			"<i class='online-icon'></i><label for='" + scamer.user_login + "' >" + scamer.user_name +"<small> ("+scamer.viewer_count+")</small></label>"+
			"<small class='game'><i>"+game+"</i></small>"+
			"<div data-scamer='" + scamer.user_login + "' tabIndex='4' class='remove'>x</div>"+
		"</div>"
		);
	}else{
		jQuery(".channel-form .offline-stream").prepend(""+
			"<div class='channels'>"+
				"<input type='checkbox' id='"+scamer+"' tabIndex='3' name='show' value='"+scamer+"'/>"+
				"<i class='offline-icon'></i>"+
				"<label for='" + scamer + "'>" + scamer + "</label>"+
				"<div data-scamer='" + scamer + "' tabIndex='4' class='remove'>x</div>"+
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

function scrollToBottom(channel) {

	jQuery(channel.toLowerCase()+' nav.scroll').animate({ scrollTop: jQuery(channel.toLowerCase()+' nav.scroll > div.chatscroll').height() }, 400);
    return false;
	
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


function getMessage(message, tags) {
	var msg = message;
	var url = "";
	var newSubstr = "";
	var substr = "";
	
	if(tags['emotes'] !== null){
		var size = Object.keys(tags['emotes']).length;
		var arrEmotes = Object.keys(tags['emotes']);
		var offset = 0;

		for (let i = 0; i < size; ++i) {		
			var extract = tags['emotes'][arrEmotes[i]][0].split('-');
			var url = 'https://static-cdn.jtvnw.net/emoticons/v2/'+arrEmotes[i]+'/default/dark/1.0';
			var length = extract[1] - extract[0] + 1;		
			var substr = message.slice(extract[0],extract[1]+1).slice(0, length);
			var newSubstr = "<img title='"+substr+"' width='20' height='20' src='"+url+"'>";
			
			msg = msg.replaceAll(substr, newSubstr);
		}
	}
	return msg;
}


jQuery(document).ready(function(){
	
	jQuery("[data-reset-app]").on('click', function(){
		deleteCookie('Scamers');
		window.location.replace("/multi-twitch/");
	});
	
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
			  updateStatuses(c.data, scamConf["scamers"]);
		   },
		   complete: function() {
			  // schedule the next request *only* when the current one is complete:
			  setTimeout(myPeriodicMethod, 60000);
			}
		});	
	}
	
	myPeriodicMethod();
	StartThisShit(scamConf);
	
	jQuery.ajax(
	{
	   type: 'GET',
	   url: 'https://api.twitch.tv/helix/streams',
	   headers: {
		 'Client-ID': clientID,
		 'Authorization': 'Bearer ' + authToken, 
	   },
	   success: function(c){
		  //data array is empty when queried channel is offline
		if (c.data.length > 0) {
			jQuery(".home .instructions").append("<h4>Suggestions</h4>");
			jQuery(c.data).each(function(i, val){
				jQuery(".home .instructions").append("<a class='suggest' href='/multi-twitch/?add="+val.user_login+"'>"+val.user_name+"</a>, ");
			});
		  }
	   },
	});
	
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
				if(scamConf["scamers"].length != 1){
					jQuery('.viewer').removeClass('mainViewer');
					jQuery(".viewer").css("right", "0");
				}
					break;
				
			case 37:
				//left
				var current = jQuery('.viewer.mainViewer').index();
				
				if(current == -1) current = scamConf["scamers"].length + 1;
				
				var newId = ((current-1) % scamConf["scamers"].length-1);
				
				jQuery('.viewer').removeClass('mainViewer');
				jQuery('.viewer').eq(newId).addClass('mainViewer');
				
				break;
			case 110:
				var current = jQuery('.viewer.mainViewer').index();
				/*if(current == -1) {
					break;				
				}*/
				
				jQuery(scamConf["scamers"]).each(function(i, val){
					jQuery(".viewer").eq(i).css("right", 11.11111*(i)+"%");
					
					/*if(jQuery(".viewer").eq(i).hasClass("mainViewer")) {
						console.log("insert");
						jQuery(".viewer").eq(i).insertBefore("<div class='viewer'></div>");
					}*/
				});

				jQuery('body').toggleClass('specialgrid');
				
				
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
				if(scamConf["scamers"].length != 1){
					// 1-9 (1-N)
					switch(true)
					{
						case ((value > 96) && (value <= 96+scamConf["scamers"].length)): 
							
							jQuery('.viewer').removeClass('mainViewer');
							jQuery('.viewer').eq((value-96)-1).addClass('mainViewer');
							
							break;
					}
				}
		}
		
	});
	var pauseScroll = false;
	jQuery(".scroll").hover(function(){
		pauseScroll = true;
		
	},function(){
		pauseScroll = false;
	});	
	
	
	jQuery(function () {
		var timer;
		var fadeInBuffer = false;
		jQuery(document).mousemove(function () {
			if (!fadeInBuffer) {
				if (timer) {
					clearTimeout(timer);
					timer = 0;
				}
				jQuery('html').css({
					cursor: ''
				});

			} else {
				 jQuery('.viewer').css({
					cursor: 'default'
				});
				jQuery('#go-button').css({
					opacity: 1
				});
				jQuery('.toggleShit').css({
					opacity: 1
				});
				jQuery('.twitch-description').css('border-color', '#aaaaaadd');
				
				fadeInBuffer = false;
			}


			timer = setTimeout(function () {
				 jQuery('.viewer').css({
					cursor: 'none'
				});
				 jQuery('#go-button').css({
					opacity: 0
				});
				jQuery('.toggleShit').css({
					opacity: 0
				});
				jQuery('.twitch-description').css('border-color', 'transparent');
				fadeInBuffer = true;
			}, 1500)
		});
		jQuery('.viewer').css({
			cursor: 'default'
		});
	});
	
	
	jQuery(".tuto-enjoy").hover(function(){
		jQuery('.omg').addClass('highlight');
		}, 
		function(){
			jQuery('.omg').removeClass('highlight');	
		}
	);	
	jQuery('[name=show]').removeAttr('checked');
	
	jQuery(scamConf["scamers"]).each(function(i, val){
		if(val.length !== 0){
			jQuery("input[name=show]#"+val).prop('checked', 'checked');
		}
	});	
	
	jQuery("#go-button").on('click', function() {
		if(IsFullScreenCurrently())
			GoOutFullscreen();
		else
			GoInFullscreen(jQuery("#myScamPlayer").get(0));
	});
	
	jQuery("[data-down-font]").on('click', function() {
		var lineHeight = jQuery(this).parent().parent().find('.twitch-description').css('line-height');
		var fontSize = jQuery(this).parent().parent().find('.twitch-description').css('font-size');
		
		jQuery(this).parent().parent().find('.twitch-description').css('line-height',parseInt(lineHeight, 10)-1+"px").css('font-size',parseInt(fontSize, 10)-1+"px");
	});
	
	jQuery("[data-up-font]").on('click', function() {
		var lineHeight = jQuery(this).parent().parent().find('.twitch-description').css('line-height');
		var fontSize = jQuery(this).parent().parent().find('.twitch-description').css('font-size');
		
		jQuery(this).parent().parent().find('.twitch-description').css('line-height',parseInt(lineHeight, 10)+1+"px").css('font-size',parseInt(fontSize, 10)+1+"px");
	});

	
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
		username: 'Xou____',
		password: 'oauth:'
		},
	  channels: ["xou____"]
	};
	const client2 = new tmi.client(option);
	
	
	client2.connect().catch((err) => {console.log('Connection error!', err)});

	const formScam = jQuery('form[name="spam-area"]');
	formScam.on("submit", function(e) {
		e.preventDefault();
		client2.action(jQuery('#channel-to-feed').val(), jQuery('#spam-content').val())

		.then(data => {
			console.log(`Sent "${data[1]}" to`, jQuery('#channel-to-feed').val());
		})
		.catch(err => {
			console.log('[ERR]', err);
		});
	});

*/


	client.on('message', (channel, tags, message, self) => {	
		let premium = "";
		let subscriber = "";
		let subgifts = "";
		let noaudio = "";
		let novideo = "";
		let partner = "";
		let broadcaster = "";
		let vip = "";
		let flags = [];
		
		//console.log(tags);
		if(tags.badges !== null) {
			premium = tags.badges['premium'];
			subscriber = tags.badges['subscriber'];	
			subgifts = tags.badges['sub-gifter'];
			noaudio = tags.badges['no_audio'];
			novideo = tags.badges['no_video'];
			partner = tags.badges['partner'];
			broadcaster = tags.badges['broadcaster'];
			vip = tags.badges['vip'];
		}
		if(tags.flags !== null) {
			flags = tags.flags;
		}	
		jQuery('.twitch-description'+channel.toLowerCase()+' > .scroll > div')
		  .append(""+
			  "<div class='embed-message "+tags.id+"'>" +
				"<span data-first-message='"+tags['first-msg']+"'>"+
				"<div class='sender-message'>" +
				  "<span title='Regarde sans le son' data-no-audio-"+noaudio+"></span>"+
				  "<span title='Regarde sans image' data-no-video-"+novideo+"></span>"+
				  "<span title='Sub depuis "+subscriber+" Mois' data-subscriber='"+tags['subscriber']+"'></span>"+
				  "<span title='Prime' data-prime-"+premium+"></span>"+
				  "<span title='Modo !' data-modo='"+tags['mod']+"'></span>"+
				  "<span title='Partenaire' data-partner-"+partner+"></span>"+
				  "<span title='VIP' data-vip-"+vip+"></span>"+
				  "<span title='"+subgifts+" Subgifts' data-subgifts-"+subgifts+"></span>"+
				  "<span title='Diffuseur' data-brodcaster-"+broadcaster+"></span>"+
				  
				  
				  "<span title='Flags !' data-flags='"+tags['flags']+"'>FLAGS</span>"+
				  "<span title='Turbo !' data-turbo='"+tags['turbo']+"'> TURBO </span>"+
				  "<span style='color:"+tags['color']+"' class='scamer'>"+tags['display-name']+"</span>"+
				"</div>" +
				  "<span class='message'>"+getMessage(message, tags)+"</span></span>"+
			  "</div>"
			);
			
			if(pauseScroll == false)
				scrollToBottom(channel);
			
			/* Keep 150 messages */
			if(jQuery(channel.toLowerCase()+' nav.scroll > .chatscroll > div').length == bufferMessageSize) {
				jQuery(channel.toLowerCase()+' nav.scroll > .chatscroll > div').eq(0).remove();
			}
	});
	
	client.on("connected", function (address, port) {

	});
	
});


/*

pluie d'emotes
animation switch de stream
badges + sub + flags
administration(/moderation) stuffs ?

scam roulette

??envoyer message + prédictions ??
??qualité bloqué par background transparent??

*/






