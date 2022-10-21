let authToken = "";
let clientID = "";
var basePath = ""


var scamersTotalList = [];
var bufferMessageSize = 150;
var tickRefreshMs = 120000;

var themes = [ "default", "detached" ];
var themeColors = [ "default", "dark", "dark-opacity", "light", "light-opacity"];



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
		var key = newScamer[i].toLowerCase();
		
		if(!scamersTotalList.includes(newScamer[i].toLowerCase()) && newScamer[i] !== '') {
			scamersTotalList.push(newScamer[i].toLowerCase());
			setCookie('Scamers', scamersTotalList, 6000);
		} else {
			console.log("already exist or empty -- skip");
		}
	}
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
	} else {
		jQuery(".page-title").append("Multi twitch");
		if(config.scamers.length == 0) {
			jQuery(document).prop('title', "Multi twitch");
		}else {
			jQuery(document).prop('title', "Multi twitch ("+ config.scamers.join(', ')+")");
		}
	}


	jQuery("body").addClass("viewer"+config.scamers.length+"video", );
		var player = [];
		for(var i=0; i< config.scamers.length; i++){
		jQuery(".twitch-video").append("<div data-theme-color='default' data-theme='default' class='viewer'><div class='ui-widget-content twitch-description' id='"+config.scamers[i].substr(1)+"'><nav class='scroll'><div class='chatscroll'></div></nav></div><div class='twitch-embed' id='twitch-embed"+(i+1)+"'></div></div>");
		
		var options = {
			width: "100%",
			height: "100%",
			channel: config.scamers[i].substr(1),
			allowfullscreen: false,
			muted: (config.scamers.length > 1)
			// only needed if your site is also embedded on embed.example.com and othersite.example.com
			//parent: ["embed.example.com"]
		  };
		  
		  player[i] = new Twitch.Player("twitch-embed"+(i+1), options);
		}
		
		jQuery(".twitch-video .viewer").append("<div class='player-options'><span class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-minus ui-btn-icon-notext ui-btn-inline' data-down-font></span><span class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-plus ui-btn-icon-notext ui-btn-inline' data-up-font></span><select data-form-theme-color name='theme-color'></select><select data-form-theme name='theme'></select></div>");
		
		jQuery(themeColors).each(function(i, color){
			jQuery("[data-form-theme-color]").append("<option value='"+color+"'>Theme: "+color+"</option>");
		});
		
		jQuery(themes).each(function(i, color){
			jQuery("[data-form-theme]").append("<option value='"+color+"'>Disposition: "+color+"</option>");
		});
		
		jQuery(".twitch-description").draggable({ containment: "document" });
		
		jQuery("[data-form-theme-color]").on( "change", function(){
			jQuery(this).parent().parent().eq(0).attr("data-theme-color", this.value);
		});
		
		jQuery("[data-form-theme]").on( "change", function(){
			jQuery(this).parent().parent().eq(0).attr("data-theme", this.value);
		});
		
		
		jQuery(".twitch-description").dblclick(function() {
			jQuery(this).toggleClass("hide");
		});
		
		jQuery(".twitch-embed").dblclick(function() {
			if(IsFullScreenCurrently())
					GoOutFullscreen();
				else
					GoInFullscreen(jQuery("#myScamPlayer").get(0));
		});

		
		jQuery(".twitch-description").resizable({
		  containment: 'document',
		  minWidth: 200,
		  minHeight: 21,
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
			jQuery('input#'+scamersToShowList[i]).parent('.channels').addClass('selected');
		} else {
			jQuery('input#'+scamersToShowList[i]).prop("checked", true);
			jQuery('input#'+scamersToShowList[i]).parent('.channels').addClass('selected');
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
				"<div class='gamehover'>"+
					"<img src='"+ thumbnail_resized+"'/>"+
					"<div class='gametitle'>"+scamer.title +"</div>"+
				"</div>"+
				"<div class='infos'>"+scamer.viewer_count+"</div>"+
				"<div class='date'>"+duration+"</div>"+
			"</div>"+
			"<i class='online-icon'></i><label for='" + scamer.user_login + "' >" + scamer.user_name +"<small> ("+scamer.viewer_count+")</small></label>"+
			"<small class='game'>"+game+"</small>"+
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
	
	jQuery('.channels input').on('change', function(e){
		if(jQuery(this).is(':checked')) {
			jQuery(this).parent('.channels').addClass("selected");
		} else {
			jQuery(this).parent('.channels').removeClass("selected");
		}
		e.preventDefault();
	});
	
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

function removeToken(){
	deleteCookie("tokenMultiTwitch");
	window.location.reload();
}

function loadClient(config){
	
	var url = window.location.href;
	var size = url.indexOf('#')
	var params = url.substring(size + 1);
	var urlParams = new URLSearchParams(params);
	var access_token = urlParams.get('access_token');
	// checkstate >>> 
	
	var name = "";
	
	if (access_token) {
		setCookie('tokenMultiTwitch', access_token, 2);
	} else {
		access_token = getCookie('tokenMultiTwitch');
	}

	jQuery.ajax(
	{
	   type: 'GET',
	   url: 'https://id.twitch.tv/oauth2/validate',
	   async: false,
	   headers: {
		 'Authorization': 'Bearer '+ access_token, 
	   },
	   success: function(c){
			console.log("log ok");
			//console.log(c);
			name = c["login"];
				const option = {
				  connection: {
					cluster: "aws",
					reconnect: true
				  },
				  identity: {
					username: name,
					password: 'oauth:'+access_token,
					},
				  channels: config["scamers"]
				};
				
				client = new tmi.client(option);		
				client.connect();
				
				client.on('connected', function(){
					for(var i=0; i<config["scamers"].length; i++) {
						jQuery('.twitch-description'+config['scamers'][i]).append(""+
							"<form action='' name='spam-area'>"+
								"<input autocomplete='off' type='text' name='"+config["scamers"][i].substr(1)+"' id='spam-content' value='' placeholder='Envoyer un message' />"+
								"<input name='send' type='submit' value='Go' />"+
							"</form>");
					}
					
					const formScam = jQuery('form[name=spam-area]');
					formScam.on("submit", function(e) {
						e.preventDefault();
						
						client.say(jQuery(this).find('input[type=text]').attr('name'), jQuery(this).find('input[type=text]').val())

						.then(data => {
							jQuery(this).find('input[type=text]').val('');
						})
						.catch(err => {
							console.log('[ERR]', err);
						});
					});
				});
				
				jQuery('.postmessage').append("<a class='authbtn' onclick='removeToken();'><h2>Logout</h2></a>");					
	   },
	   error: function(event){
			name = null;
			console.log("log nok");
			const option = {
			  channels: config["scamers"]
			};
			client = new tmi.client(option);
			client.connect();
			jQuery('.postmessage').append("<a class='authbtn' href='https://id.twitch.tv/oauth2/authorize?response_type=token&force_verify=true&client_id="+clientID+"&redirect_uri=https://xouindaplace.fr/multi-twitch/&scope=chat%3Aread+chat%3Aedit&state=random'><h2>Login</h2><span>(active le chat sur les streams)</span></a>");
	   },
	   complete: function(e){
			//console.log(client);
			
			var pauseScroll = false;
			jQuery(".twitch-description").hover(function(){
				pauseScroll = true;
				
			},function(){
				pauseScroll = false;
			});
			
			client.on('message', (channel, tags, message, self) => {
				let premium = "";
				let subscriber = "";
				let subgifts = "";
				let noaudio = "";
				let novideo = "";
				let partner = "";
				let broadcaster = "";
				let vip = "";
				
				//console.log(tags);
				if(tags.badges !== null ) {
					premium = tags.badges['premium'];
					subscriber = tags.badges['subscriber'];	
					subgifts = tags.badges['sub-gifter'];
					noaudio = tags.badges['no_audio'];
					novideo = tags.badges['no_video'];
					partner = tags.badges['partner'];
					broadcaster = tags.badges['broadcaster'];
					vip = tags.badges['vip'];
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
						  
						  "<span title='Turbo "+tags['turbo']+"' data-turbo='"+tags['turbo']+"'> TURBO </span>"+
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

function getCookie(name) {
  const value = document.cookie;
  const parts = value.split(`; `+name+`=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
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
	jQuery(channel.toLowerCase()+' nav.scroll').animate({ scrollTop: jQuery(channel.toLowerCase()+' nav.scroll > div.chatscroll').height() }, 50);
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
			var newSubstr = "<img title='"+substr+"' src='"+url+"'>";
			
			msg = msg.replaceAll(substr, newSubstr);
		}
	}
	if(tags['flags'] !== null && tags['flags'] !== undefined){
		var flag = tags['flags'].split(':');
		var extract = flag[0].split('-');
		var length = extract[1] - extract[0] + 1;
		var substr = message.slice(extract[0],extract[1]+1).slice(0, length);
		var newSubstr = "<u title='"+flag[1]+"'>"+substr+"</u>";
		
		msg = msg.replaceAll(substr, newSubstr);
	}	
	
	return msg;
}


jQuery(document).ready(function(){	
	var scamConf = loadScam();
	loadClient(scamConf);
	
	var urlscammers = "";

	scamersTotalList.forEach(function(scam) {
	   urlscammers = urlscammers + "user_login=" + scam + "&";
	});	
	
	
	function importFollowers(login) {
		
		jQuery.ajax(
		{
		   type: 'GET',
		   url: 'https://api.twitch.tv/helix/users?login=' + login,
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			    var id = c.data[0].id;
				jQuery.ajax(
				{
				   type: 'GET',
				   url: 'https://api.twitch.tv/helix/users/follows?first=100&from_id=' + id,
				   headers: {
					 'Client-ID': clientID,
					 'Authorization': 'Bearer ' + authToken, 
				   },
				   success: function(c){
					  var follows = [];
					  for(var i=0; i<c.data.length; i++) {
						 follows[i]=c.data[i].to_login;
					  }
					  deleteCookie('Scamers');
					  setCookie('Scamers', follows, 6000);
					  window.location.replace(basePath)
				   },

				});	
		   },

		});		
	}
	
	function myPeriodicMethod() {
		var scamConf = loadScam();	
		console.log(scamConf);
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
			  setTimeout(myPeriodicMethod, tickRefreshMs);
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
			jQuery(".hometext .suggestion").append("<h4>Importez les chaines de votre twitch : </h4><input id='import' type='text' placeholder='Votre login twitch + enter'>");
			jQuery(".hometext .suggestion").append("<h4>Ou parmis les chaines suivantes :</h4>");
			jQuery(c.data).each(function(i, val){
				//var thumbnail_resized = val.thumbnail_url.replace(/{width}|{height}/gi, 60);
				jQuery(".hometext .suggestion").append("<div class='streams'><a title='"+val.title+"' class='suggest' href='"+basePath+"?add="+val.user_login+"'>"+val.user_name+"<small> ("+val.viewer_count+")</small><br><small>"+val.game_name+"</small></a></div>");
			});
			
			var input = document.getElementById("import");
			input.addEventListener("keypress", function(event) {
			  if (event.key === "Enter") {
				event.preventDefault();
				// Trigger the button element with a click
				importFollowers(input.value);
			  }
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
			case 17:
				//ctrl
				jQuery("h1.toggleShit").toggleClass("hide");
				jQuery(".status").toggle(100, "linear");
				break;

			case 96: 
				// 0 
				    if(jQuery('body').attr('data-layout') == 'studio') {
						jQuery('body').removeClass('specialgrid');
					}
					jQuery('body').attr('data-layout', 'grid');				
					var current = jQuery('.viewer.mainViewer').index();
					if(current == -1){
						jQuery('.viewer').eq(0).addClass('mainViewer');
					} else {
						if(scamConf["scamers"].length != 1){
							jQuery('.viewer').removeClass('mainViewer');
							jQuery(".viewer").css("right", "0");
						}
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
				//Point 
				if(jQuery('body').attr('data-layout') !== 'studio'){
					jQuery('body').attr('data-layout', 'studio');
					
					var current = jQuery('.viewer.mainViewer').index();
					/*if(current == -1) {
						break;				
					}*/
					
					jQuery(".mainViewer .twitch-description").css("left", "initial");
					jQuery(scamConf["scamers"]).each(function(i, val){
						jQuery(".viewer").eq(i).css("right", 11.11111*(i)+"%");
						
						/*if(jQuery(".viewer").eq(i).hasClass("mainViewer")) {
							console.log("insert");
							jQuery(".viewer").eq(i).insertBefore("<div class='viewer'></div>");
						}*/
					});

					jQuery('body').toggleClass('specialgrid');
				}
				
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
					cursor: 'pointer'
				});
				jQuery('.player-options, .toggleShit').css({
					opacity: 1
				});
				jQuery('.twitch-description').css('border-color', '#aaaaaadd');
				
				fadeInBuffer = false;
			}


			timer = setTimeout(function () {
				 jQuery('.viewer').css({
					cursor: 'none'
				});		
				jQuery('.toggleShit, .player-options').css({
					opacity: 0
				});
				jQuery('.twitch-description').css('border-color', 'transparent');
				fadeInBuffer = true;
			}, 1500)
		});
		jQuery('.viewer').css({
			cursor: 'pointer'
		});
	});
	
	jQuery("[data-reset-app]").on('click', function(){
		deleteCookie('Scamers');
		window.location.replace(basePath);
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
});


/*

sauvegarder options par chaine dans le cookie

pluie d'emotes + option

animation switch de stream 

badges + TURBO 

on resize replace chat

améliorer la home globalement

prédictions



??administration(/moderation) stuffs ?
??scam roulette??
https://dev.to/codesphere/how-to-create-a-twitch-chat-game-with-javascript-deg
??qualité bloqué par background transparent??

*/






