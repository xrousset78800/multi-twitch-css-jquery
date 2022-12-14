let authToken = "";
let clientID = "";
var basePath = "https://mytwitchplayer.fr/";


var totalList = [];
var totalListInfos = [];
var configObject = [];
var players = [];

var bufferMessageSize = 150;
var tickRefreshMs = 60000;
var emotesChannels = [];
var badgesChannels = [];
var themes = [ "default", "border", "detached" ];
var themeColors = [ "default", "dark", "dark-opacity", "light", "light-opacity"];


function loadScam() {

	var urlParams = new URLSearchParams(window.location.search);

	var newScamer = urlParams.getAll('add');
	var scamGet = urlParams.getAll('show');

	if(getCookie("JsonTwitchConfig") === undefined) {
		
	} else {
		configObject = getCookie("JsonTwitchConfig");
	}

	if(newScamer) {
		var toObject = [];
		var jsonString = [];

		if(configObject.length != 0) {
			var parse = JSON.parse(configObject);
			
			for(l=0;l<parse.length;l++) {
				var oldChannel = { 
					'name': parse[l].name,
					'size': parse[l].size,
					'color': parse[l].color,
					'theme': parse[l].theme,
				}
				
				totalList.push(oldChannel);
				toObject.push(oldChannel);
				jsonString.push(oldChannel);
				//console.log("OLD channel"+ parse[l].name);
			}
		}

		for(var i=0; i<newScamer.length; i++) {
			var alreadyExist = false;
			for(l=0;l<jsonString.length;l++) {
				if(jsonString[l].name == newScamer[i].toLowerCase()){
					console.log('dejà dans la liste');
					alreadyExist = true;
				}
			}
			if(alreadyExist === false && newScamer[i].toLowerCase() != ""){
				jQuery.ajax(
				{
				   type: 'GET',
				   url: 'https://api.twitch.tv/helix/users?login=' + newScamer[i],
				   headers: {
					 'Client-ID': clientID,
					 'Authorization': 'Bearer ' + authToken, 
				   },
				   success: function(c){
					   console.log(c.data[0].login);
						var newChannel = { 
							'name': c.data[0].login,
							'size': 15,
							'color': 'default',
							'theme': 'default',
						}
						
						totalList.push(newChannel);
						toObject.push(newChannel);
						setCookie('JsonTwitchConfig', JSON.stringify(toObject), 6000);
				   },
				   error: function(c) {
						//console.log("l'utilisateur n'existe pas sur twitch");
				   }
				});				
				//console.log("JSON add "+ newScamer[i]);			
			}
		}
	}

	var result = {
		'scamers': scamGet
	}

	return result;
}

function StartThisShit(config) {
	if(config.scamers.length == 1) {
		jQuery(document).prop('title', 'Simple twitch (' + config.scamers[0].substr(1)+")");
		jQuery("body").addClass(config.scamers[0]);
	} else {
		if(config.scamers.length == 0) {
			jQuery(document).prop('title', "Multi twitch");
		}else {
			jQuery(document).prop('title', "Multi twitch ("+ config.scamers.join(', ')+")");
		}
	}

	jQuery("body").addClass("viewer"+config.scamers.length+"video", );
	
	for(var i=0; i< config.scamers.length; i++){
		
		var key = config.scamers[i];
		let matchConf = totalList.find(o => o.name === key.substr(1));
		
		jQuery(".twitch-video").append("<div id='player-"+config.scamers[i].substr(1)+"' data-streamer='"+config.scamers[i].substr(1)+"' data-font-size='"+matchConf.size+"' data-theme-color='"+matchConf.color+"' data-theme='"+matchConf.theme+"' class='viewer'><div class='ui-widget-content twitch-description' id='"+config.scamers[i].substr(1)+"'><nav class='scroll'><div class='chatscroll'></div></nav></div><div class='twitch-embed' id='twitch-embed"+(i+1)+"'></div></div>");
		
		var options = {
			width: "100%",
			height: "100%",
			channel: config.scamers[i].substr(1),
			allowfullscreen: false,
			// only needed if your site is also embedded on embed.example.com and othersite.example.com
			//parent: ["embed.example.com"]
		};
		  
		var player = new Twitch.Player("twitch-embed"+(i+1), options);
		
		player.addEventListener(Twitch.Embed.VIDEO_READY, function() {
		  player.play();
		  player.setMuted(false);
		  player.setVolume(0.5);
		});
		
		players[config.scamers[i].substr(1)] = player;
		  
		jQuery('#player-'+config.scamers[i].substr(1)).append("<div class='player-options'><span data-down-font>-</span><span  data-up-font>+</span><select data-form-theme-color name='theme-color'></select><select data-form-theme name='theme'></select><div class='playPause' data-play='true'></div><div data-mute='false' class='muteBtn'><span></span></div><div class='volume'></div></div>");
		
		jQuery(themeColors).each(function(v, color){
			var selected = "";
			
			if(color == matchConf.color) {
				selected = "selected='selected' ";
			}
			
			jQuery('#player-'+config.scamers[i].substr(1)+" [data-form-theme-color]").append("<option "+selected+"value='"+color+"'>Theme: "+color+"</option>");
		});
	
		jQuery(themes).each(function(v, theme){
			var selected = "";
			
			if(theme == matchConf.theme) {
				selected = "selected='selected' ";
			}			
			jQuery('#player-'+config.scamers[i].substr(1)+" [data-form-theme]").append("<option "+selected+"value='"+theme+"'>Disposition: "+theme+"</option>");
		});
		
		jQuery(config.scamers[i]+'.twitch-description').css('line-height',parseInt(matchConf.size+3, 10)-1+"px").css('font-size',parseInt(matchConf.size, 10)-1+"px");
	}
	
	jQuery(".twitch-description").draggable({ containment: "document", 
		  stop: function( event, ui ) {
		   jQuery(this).css("left",parseInt($(this).css("left")) / (jQuery(this).parent().width() / 100)+"%");
		   jQuery(this).css("top",parseInt($(this).css("top")) / (jQuery(this).parent().height() / 100)+"%");
		  }
	});
		
	jQuery(".twitch-description").dblclick(function(e) {
		jQuery(this).toggleClass("hide");
		e.preventDefault();
		e.stopPropagation();
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
		  event.preventDefault();
		  event.stopPropagation();
	  }
	});	
			
	jQuery(".viewer > div").each(function(viewer){
		jQuery(viewer).addClass(viewer);
	});
	
	return true;
}

function updateStatuses(response, scamersToShowList, firstIteration) {
	/* Save user checked channels */
	var old = [];
	
	jQuery(".channels input").each(function(){
		if(jQuery(this).is(':checked')){
			old.push(jQuery(this).attr("id"));
		}
	});
	jQuery(".channels").remove();
	
	jQuery(totalList).each(function(scam, value){
            var scamer = value.name;
		let flag = false;	
		let matchConfInfos = totalListInfos.find(o => o.login === scamer);
		
		jQuery(response).each(function(val, user){
		      if(user.user_login.toLowerCase() == scamer.toLowerCase() || user.user_name.toLowerCase() == scamer.toLowerCase()){
				//getBroadcast(user.user_id);
                  updateScammerStatus(true, user, matchConfInfos); 
			      flag = true;
			}
		});
		if(flag === false) {
			updateScammerStatus(false, scamer, matchConfInfos);
		}
	});
	

	if(firstIteration){
		for(var i = 0; i<scamersToShowList.length;i++) {
			jQuery('input'+scamersToShowList[i]).prop("checked", true);
			jQuery('input'+scamersToShowList[i]).parent('.channels').addClass('selected');
		}	
		jQuery(".channel-form [data-counter]").val("Voir "+jQuery(".channels.selected").length);

	} else {	
		for(var i = 0; i<old.length;i++) {
			jQuery('input#'+old[i]).prop("checked", true);
			jQuery('input#'+old[i]).parent('.channels').addClass('selected');
		}	
	}
	
	for(var i = 0; i<scamersToShowList.length;i++) {
		jQuery('input'+scamersToShowList[i]).parent('.channels').addClass('active');
	}	
	return true;
}

function updateScammerStatus(online, scamer, userInfos) {

	if (userInfos && userInfos.profile_image_url != "") {
		var icon_channel = userInfos.profile_image_url;
	} else {
		var icon_channel = "assets/img/modo.png";
	}

	//User is an online object
	if(typeof scamer === 'object' && !Array.isArray(scamer) && scamer !== null){
		var duration = timeDiffCalc(new Date(scamer.started_at), new Date());
		var thumbnail_resized = scamer.thumbnail_url.replace(/{width}|{height}/gi, 60);
		var game = scamer.game_name;
		
		jQuery(".channel-form .online-stream").prepend(""+
		"<div class='channels'>"+
			"<input type='checkbox' id='"+scamer.user_login+"' tabIndex='3' name='show' value='"+scamer.user_login+"'/>"+
			"<div class='title'>"+
				"<div>"+
					"<img src='"+ thumbnail_resized+"'/>"+
					"<div class='gamehover'>"+
						"<div class='gametitle'>"+scamer.title +"</div>"+
						"<div class='infos'>"+scamer.viewer_count+"</div>"+
						"<div class='date'>"+duration+"</div>"+	
					"</div>"+
				"</div>"+
			"</div>"+
			"<img width='30' height='30' class='channel-icon' src='"+ icon_channel+"'/>"+
			"<i class='online-icon'></i><label for='" + scamer.user_login + "' >" + scamer.user_name +"<small> ("+scamer.viewer_count+")</small></label>"+
			"<small class='game'>"+game+"</small>"+
			"<div data-scamer='" + scamer.user_login + "' tabIndex='4' class='remove'>x</div>"+
		"</div>"
		);
	}else{
		//console.log(userInfos);
		jQuery(".channel-form .offline-stream").prepend(""+
			"<div class='channels'>"+
				"<input type='checkbox' id='"+scamer+"' tabIndex='3' name='show' value='"+scamer+"'/>"+
				"<img width='30' height='30' class='channel-icon' src='"+ icon_channel +"'/>"+
				"<i class='offline-icon'></i>"+
				"<label for='" + scamer + "'>" + scamer + "</label>"+
				"<div data-scamer='" + scamer + "' tabIndex='4' class='remove'>x</div>"+
			"</div>"
		);
	}

	jQuery('.channels input').on('change', function(e){
		
		if(jQuery(this).is(':checked')) {
			if(jQuery(".channels.selected").length == 9) {
				return false;
			}
			jQuery(this).parent('.channels').addClass("selected");
			
		} else {
			jQuery(this).parent('.channels').removeClass("selected");
		}
		jQuery(".channel-form [data-counter]").val("Voir "+jQuery(".channels.selected").length);
		
		e.preventDefault();
	});	
	
	
	jQuery('.channels .remove').on('click', function(e) {
		e.preventDefault();
		var scamer = jQuery(this).data("scamer");		
		jQuery(this).parent(".channels").remove();
		
		updateJsonCookieremoveByname("JsonTwitchConfig", scamer);
	});

	return true;
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
		window.location.replace(getCookie('urlRedirect'));
	} else {
		access_token = getCookie('tokenMultiTwitch');
		setCookie('urlRedirect', url, 2);
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
			name = c["login"];
				const option = {
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
								"<input name='send' type='submit' value='' />"+
							"</form>");
					}
					
					const formScam = jQuery('form[name=spam-area]');
					formScam.on("click", function(e) {	
						jQuery(this).find('input[type=text]').removeAttr('placeholder');
					});
					
					formScam.on("submit", function(e) {						
						e.stopPropagation();
						e.preventDefault();
						client.say(jQuery(this).find('input[type=text]').attr('name'), jQuery(this).find('input[type=text]').val())

						.then(data => {
							jQuery(this).find('input[type=text]').val('');
							jQuery(this).find('input[type=text]').attr('placeholder', 'Envoyer un message');
						})
						.catch(err => {
							console.log('[ERR]', err);
						});
					});
				});
				
				jQuery('.postmessage').prepend("<a class='authbtn' onclick='removeToken();'><p>Logged as "+name+"</p><h2>Logout</h2></a>");					
	   },
	   error: function(event){
			name = null;
			console.log("log nok");
			const option = {
			  channels: config["scamers"]
			};
			client = new tmi.client(option);
			client.connect();
			jQuery('.postmessage').prepend("<a class='authbtn' href='https://id.twitch.tv/oauth2/authorize?response_type=token&force_verify=true&client_id="+clientID+"&redirect_uri="+basePath+"&scope=chat%3Aread+chat%3Aedit&state=c3ab8aa609ea11e793ae92361f002671'><h2 title='Active le chat sur les streams'>Login Twitch</h2></a>");
	   },
	   complete: function(e){
			//console.log(client);
				
		}
	});
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
	
	if(tags['emotes'] !== null && tags['emotes'] !== undefined){
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

function first(userLogin) {

	return jQuery.ajax(
	{
	   type: 'GET',
	   url: 'https://api.twitch.tv/helix/streams?user_login=' + userLogin,
	   headers: {
		 'Client-ID': clientID,
		 'Authorization': 'Bearer ' + authToken, 
	   },
	   success: function(c){
		  //console.log(c);
	   },	   
	})
}

function second(data, textStatus, jqXHR) {

   return jQuery.ajax(
		{
		   type: 'GET',
		   url: 'https://api.twitch.tv/helix/chat/emotes?broadcaster_id='+data.data[0]['user_id'],
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			  emotesChannels[data.data[0]['user_name'].toLowerCase()] = c.data;
		   },
		}
	);
}
function third(data, textStatus, jqXHR) {
	
   return jQuery.ajax(
		{
		   type: 'GET',
		   url: 'https://api.twitch.tv/helix/chat/badges?broadcaster_id='+data.data[0]['user_id'],
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			  badgesChannels[data.data[0]['user_name'].toLowerCase()] = c.data;
		   },
		}
	);
}

function loadEmotes(streams) {
	var url = "";
	var id = null;
	
	streams.forEach(function(scam) {
	   userLogin = scam.substr(1);
	   first(userLogin).then(second);
	   first(userLogin).then(third);
	});
	console.log(emotesChannels);
	console.log(badgesChannels);
}

function stopPropagation(id, event) {
    jQuery(id).on(event, function(e) {
        e.stopPropagation();
        return false;
    });
}


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
				  var followsJSON = [];
				  for(var i=0; i<c.data.length; i++) {
					 followsJSON[i]={'name':c.data[i].to_login, 'size': 12, 'color':'default', 'theme':'default'}
				  }					  
				  deleteCookie('JsonTwitchConfig');
				  setCookie('JsonTwitchConfig', JSON.stringify(followsJSON), 6000);
				  
				  window.location.replace(basePath);
			   },

			});	
	   },

	});		
}

jQuery(document).ready(function(){	
	var scamConf = loadScam();
	loadClient(scamConf);
	
	var urlStreams = "";
	var urlUsers = "";
	
	totalList.forEach(function(scam) {
	   urlStreams = urlStreams + "user_login=" + scam.name + "&";
	   urlUsers = urlUsers + "login=" + scam.name + "&";
	});	
	
	function getUsersData() {
		jQuery.ajax(
		{
		   type: 'GET',
		   url: 'https://api.twitch.tv/helix/users?' + urlUsers,
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			  totalListInfos = c.data;
			  myPeriodicMethod(scamConf, true);
		   }
		});
	}	
	
	function myPeriodicMethod(scamConf, firstIteration) {
		jQuery.ajax(
		{
		   type: 'GET',
		   url: 'https://api.twitch.tv/helix/streams?' + urlStreams,
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			  updateStatuses(c.data, scamConf["scamers"], firstIteration);
		   },
		   complete: function(c) {
			  setTimeout(myPeriodicMethod, tickRefreshMs, scamConf, false);
			}
		});
	}	
	
	getUsersData();
	
	loadEmotes(scamConf["scamers"]);
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
			jQuery(".hometext .suggestion").append("<h4>Importez toutes les chaines de votre twitch ici ou une seule via le menu : </h4><input id='import' type='text' placeholder='Votre login twitch + enter'>");
			jQuery(".hometext .suggestion").append("<h4>Ou ajoutez parmis les chaines suivantes :</h4>");
			jQuery(c.data).each(function(i, val){
				//var thumbnail_resized = val.thumbnail_url.replace(/{width}|{height}/gi, 60);
				jQuery(".hometext .suggestion").append("<div class='streams'><a title='"+val.title+"' class='suggest' href='"+basePath+"?add="+val.user_login+"'>"+val.user_name+"<small> ("+val.viewer_count+")</small><br><small>"+val.game_name+"</small></a></div>");
			});
			
			var input = document.getElementById("import");
			input.addEventListener("keypress", function(event) {
			  if (event.key === "Enter") {
				console.log(input.value);
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
	
	jQuery(document).mouseup(function(e){
    switch(e.which)
    {
        case 2:
			if(jQuery('body[data-layout=studio]').length) {
				jQuery('.viewer').removeClass('mainViewer');
				jQuery('.twitch-video').removeClass('hasMainViewer');
			}else {
				switchToGrid();
			}
			
			break;		
        case 3:
			jQuery("h1.toggleShit").toggleClass("hide");
			jQuery(".status").toggle(300, "linear");
			
			break;
        case 4:
			previousStream();
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			return false;
			break;
        case 5:
			nextStream();	
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			return false;		
			break;
    }

    return true;
});
	
	
	
	jQuery(document).keydown(function(e) {
		
		var target = e.target.localName;
		
		if(e.which == 13 && target == 'input'){
			jQuery(e.target).parent().submit();
			return true;
		}
		
		if(target == 'input'){
			return true;
		}
		
	    var value = e.which;	
		switch (value) {
			case 96: 
				// 0 
				switchToGrid();
				break;
				
			case 37:
				//left
				previousStream();
				
				break;
			case 110:
				//Point 
				switchToStudio();
				break;
			case 39:
				//right
				nextStream();
				break;
				
			default:
				if(scamConf["scamers"].length != 1){
					// 1-9 (1-N)
					switch(true)
					{
						case ((value > 96) && (value <= 96+scamConf["scamers"].length)): 
							
							jQuery('.viewer').removeClass('mainViewer');
							jQuery('.twitch-video').addClass('hasMainViewer');
							jQuery('.viewer').eq((value-96)-1).addClass('mainViewer');
							
							break;
					}	
				}
		}
		
	});
	
	jQuery(function timer() {
		var timer;
		var fadeInBuffer = false;
		jQuery(document).mousemove(function (e) {
			
			var target = e.target.localName;
			if(target == 'input' || target == 'nav' || jQuery("input[type=text]").is(":focus")){
				return false;
			}
		
			//check for target
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
				//, [name=spam-area]
				jQuery('.player-options, .toggleShit, .switchers').css({
					opacity: 1
				});
				jQuery('.twitch-description').css('border-color', '#aaaaaadd');
				
				jQuery('.specialgrid .viewer').css('height', '12%');
				
				fadeInBuffer = false;
			}


			timer = setTimeout(function () {
				 jQuery('.viewer').css({
					cursor: 'none'
				});		
				//, [name=spam-area]
				jQuery('.toggleShit, .player-options, .switchers').css({
					opacity: 0
				});
				jQuery('.twitch-description').css('border-color', 'transparent');
				jQuery('.specialgrid .viewer').css('height', '0%');
				fadeInBuffer = true;
			}, 1500)
		});
	});
	
	jQuery(document).bind("contextmenu",function(e){
		return false;
    });
	
	jQuery("[data-reset-app]").on('click', function(){
		deleteCookie('JsonTwitchConfig');
		window.location.replace(basePath);
	});	
	
	function switchToGrid() {
		if(jQuery('body').attr('data-layout') != 'grid') {
			jQuery('body').removeClass('specialgrid');
		}
		
		jQuery('body').attr('data-layout', 'grid');
		$(".viewer").removeAttr("style");
		var current = jQuery('.viewer.mainViewer').index();
		if(current == -1){
			jQuery('.viewer').eq(0).addClass('mainViewer');
			jQuery('.twitch-video').addClass('hasMainViewer');
		} else {
			if(scamConf["scamers"].length != 1){
				jQuery('.viewer').removeClass('mainViewer');
				jQuery('.twitch-video').removeClass('hasMainViewer');
				jQuery(".viewer").css("left", "0");
			}
		}
	}
		
	function switchToStudio() {
		if(jQuery('body').attr('data-layout') !== 'studio'){
			jQuery('.twitch-video').removeClass('hasMainViewer');
			jQuery('body').attr('data-layout', 'studio');
			
			var current = jQuery('.viewer.mainViewer').index();
			if(current == -1) {
				jQuery('.viewer').eq(0).addClass('mainViewer');
				jQuery('.twitch-video').addClass('hasMainViewer');			
			}
			
			jQuery(".mainViewer .twitch-description").css("left", "initial");
			jQuery(scamConf["scamers"]).each(function(i, val){
				jQuery(".viewer").eq(i).css("left", 11.11111*(i)+"%");
				
				/*if(jQuery(".viewer").eq(i).hasClass("mainViewer")) {
					console.log("insert");
					jQuery(".viewer").eq(i).insertBefore("<div class='viewer'></div>");
				}*/
			});

			jQuery('body').toggleClass('specialgrid');
		}		
	}
	
	function nextStream() {
		var current = jQuery('.viewer.mainViewer').index();	

		if(current == -1) current = scamConf["scamers"].length;				
		
		var newId = ((current+1) % scamConf["scamers"].length-1);
		jQuery('.twitch-video').addClass('hasMainViewer');
		jQuery('.viewer').removeClass('mainViewer');
		jQuery('.viewer').eq(newId).addClass('mainViewer');		
	}
	
	function previousStream(){
		var current = jQuery('.viewer.mainViewer').index();
		
		if(current == -1) current = scamConf["scamers"].length + 1;
		
		var newId = ((current-1) % scamConf["scamers"].length-1);
		
		jQuery('.twitch-video').addClass('hasMainViewer');
		jQuery('.viewer').removeClass('mainViewer');
		jQuery('.viewer').eq(newId).addClass('mainViewer');		
	}
	
	jQuery("[data-studio-switch]").on('click', function() {
		switchToStudio();
	});
	
	jQuery("[data-grid-switch]").on('click', function() {
		switchToGrid();
	});
	
	jQuery("[data-stream-prev]").on('click', function() {
		previousStream();
	});

	jQuery("[data-stream-next]").on('click', function() {
		nextStream();
	});	
	
	jQuery("[data-down-font]").on('click', function() {
		var lineHeight = jQuery(this).parent().parent().find('.twitch-description').css('line-height');
		var fontSize = jQuery(this).parent().parent().find('.twitch-description').css('font-size');
		
		jQuery(this).parent().parent().find('.twitch-description').css('line-height',parseInt(lineHeight, 10)-1+"px").css('font-size',parseInt(fontSize, 10)-1+"px");
		
		var id = jQuery(this).parent().parent().find('.twitch-description').attr('id');
		
		updateJsonCookievalueByname("JsonTwitchConfig", id, 'size', fontSize);
	});
	
	jQuery("[data-up-font]").on('click', function() {
		var lineHeight = jQuery(this).parent().parent().find('.twitch-description').css('line-height');
		var fontSize = jQuery(this).parent().parent().find('.twitch-description').css('font-size');
		
		jQuery(this).parent().parent().find('.twitch-description').css('line-height',parseInt(lineHeight, 10)+1+"px").css('font-size',parseInt(fontSize, 10)+1+"px");
		
		var id = jQuery(this).parent().parent().find('.twitch-description').attr('id');
		
		updateJsonCookievalueByname("JsonTwitchConfig", id, 'size', fontSize);
	});
	
	jQuery("[data-form-theme-color]").on( "change", function(){
		jQuery(this).parent().parent().eq(0).attr("data-theme-color", this.value);
		var id = jQuery(this).parent().parent().find('.twitch-description').attr('id');

		updateJsonCookievalueByname("JsonTwitchConfig", id, 'color', this.value);
		
	});
	
	jQuery("[data-form-theme]").on( "change", function(){
		jQuery(this).parent().parent().eq(0).attr("data-theme", this.value);
		var id = jQuery(this).parent().parent().find('.twitch-description').attr('id');

		updateJsonCookievalueByname("JsonTwitchConfig", id, 'theme', this.value);
	});
	
	jQuery(".viewer").bind('mousewheel', function(e) {			
		
		if(jQuery(e.target).parents('.twitch-description').length !== 0) {
			return true;
		}
		
		var delta = e.originalEvent.wheelDelta;
		let viewer = jQuery(this).attr("data-streamer");
		
		if(delta > 0) {
			players[viewer].setVolume((players[viewer].getVolume() + 0.05));
			jQuery(this).find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 + 5))+"px inset #9146FF");
		} else {
			players[viewer].setVolume((players[viewer].getVolume() - 0.05));
			jQuery(this).find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 - 5))+"px inset #9146FF");
		}
		

	});
	jQuery(".muteBtn").on('click',function(e){
		let viewer = jQuery(this).parent().parent().attr("data-streamer");
		let toggleState = !players[viewer].getMuted();
		
		players[viewer].setMuted(toggleState);
		jQuery(this).attr("data-mute", toggleState);
	});
	

	jQuery(".playPause").on('click',function(e){
		let viewer = jQuery(this).parent().parent().attr("data-streamer");
		console.log(viewer);
		let isPaused = players[viewer].isPaused();

		if(isPaused) {
			players[viewer].play();
			
		} else {
			players[viewer].pause();
		
		}
		jQuery(this).attr("data-play", isPaused);
	});
	
	
	jQuery(".viewer").on('click',function(e){
		
		if((jQuery("body").attr('data-layout') == 'grid') && (jQuery(".mainViewer").length == 0)) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
		
		var isChat = jQuery(e.target).hasClass('twitch-description');
		var isOptions = jQuery(e.target).parent().hasClass('player-options');
		if(isOptions || isChat){
			e.preventDefault();
			e.stopPropagation();
			return true;
		}
		
		if(jQuery(this).hasClass("mainViewer")) {
			return false;
		}
		jQuery('.viewer').removeClass('mainViewer');
		jQuery(this).addClass('mainViewer');
	});
	
	var pauseScroll = false;
	jQuery(".chatscroll").hover(function(){
		pauseScroll = true;
		
	},function(){
		pauseScroll = false;
	});
	
	client.on('message', (channel, tags, message, self) => {
		let premium = "";
		let subscriber = "";
		let bits = "";
		let subgifts = "";
		let noaudio = "";
		let novideo = "";
		let partner = "";
		let broadcaster = "";
		let vip = "";
		let reply = "";
		let turbo = "";
		let channelSubIcon = "";
		let channelBitsIcon = "";
		let tab = badgesChannels[channel.substr(1).toLowerCase()];
		
		if(tags.badges !== null ) {
			
			premium = tags.badges['premium'];
			subscriber = tags.badges['subscriber'];
			bits = tags.badges['bits'];
			subgifts = tags.badges['sub-gifter'];
			noaudio = tags.badges['no_audio'];
			novideo = tags.badges['no_video'];
			partner = tags.badges['partner'];
			broadcaster = tags.badges['broadcaster'];
			turbo = tags.badges['turbo'];
			vip = tags.badges['vip'];
			
			if(subscriber !== undefined) {
				let tabSubs = tab.find(o => o.set_id === 'subscriber');
				let iconInfo = tabSubs["versions"].find(o => o.id === subscriber);
				channelSubIcon = "style='background-image:url(\""+iconInfo["image_url_1x"]+"\");'";
			}
			
			if(bits !== undefined) {
				let tabBits = tab.find(o => o.set_id === 'bits');
				if(tabBits !== undefined) {
					let iconBitsInfo = tabBits["versions"].find(o => o.id === bits);
					channelBitsIcon = iconBitsInfo["image_url_1x"];
				}
			}
			
		}
		
		if(tags["reply-parent-msg-id"] !== undefined) {		
			reply = "<div class='embed-message' style='padding-left: 10px;'><i>" +
						"<div class='sender-message reply-author-message'>" +
							"@"+tags["reply-parent-display-name"] +
						"</div>" +
						"<span title=\'"+tags["reply-parent-msg-body"]+"\' class='message author-message'>" +
							getMessage(tags["reply-parent-msg-body"], []) +
						"</span>" +
					"</i></div>";
			//console.log(reply);
		}

		jQuery('.twitch-description'+channel.toLowerCase()+' > .scroll > div')
		  .append(""+
			  "<div class='embed-message "+tags.id+"'>" +
				"<span data-first-message='"+tags['first-msg']+"'>"+
				reply +
				"<div class='sender-message'>" +
				  "<span title='Turbo' data-turbo-"+turbo+"></span>"+
				  "<span title='Regarde sans le son' data-no-audio-"+noaudio+"></span>"+
				  "<span title='Regarde sans image' data-no-video-"+novideo+"></span>"+
				  "<span title='Sub ("+subscriber+")' "+channelSubIcon+" data-subscriber='"+tags['subscriber']+"'></span>"+
				  "<span title='Prime' data-prime-"+premium+"></span>"+
				  "<span title='Modo !' data-modo='"+tags['mod']+"'></span>"+
				  "<span title='Partenaire' data-partner-"+partner+"></span>"+
				  "<span title='VIP' data-vip-"+vip+"></span>"+
				  "<span title='"+subgifts+" Subgifts' data-subgifts-"+subgifts+"></span>"+
				  "<span title='Bits' data-bits-icon data-bits="+bits+" style='background-image:url("+channelBitsIcon+")'></span>"+
				  "<span title='Diffuseur' data-brodcaster-"+broadcaster+"></span>"+
				  
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
	
});


/*

pluie d'emotes + option

webhooks >> stream.online, stream.offline, channel.ban, channel.raid	

améliorer la home globalement (évenements esports/tendances ?)

Boutons >> grille - stud
reply to hover

qualité


bits de base
popupqualité
404 kraken/chat/emoticon si loggué


??scam roulette??
https://dev.to/codesphere/how-to-create-a-twitch-chat-game-with-javascript-deg
??qualité bloqué par background transparent??

*/






