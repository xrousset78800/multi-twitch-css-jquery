
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
			if(alreadyExist === false && newScamer[i].toLowerCase() !== ""){
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
							'size': 22,
							'color': 'dark-opacity',
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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function StartThisShit(config) {
	let muted = false;
	if(config.scamers.length == 1) {
		jQuery(document).prop('title', 'Simple twitch (' + config.scamers[0].substr(1)+")");
		jQuery("body").addClass(config.scamers[0]);
	} else {
		if(config.scamers.length == 0) {
			jQuery(document).prop('title', "Multi twitch");
		}else {
			jQuery(document).prop('title', "Multi twitch ("+ config.scamers.join(', ')+")");
			muted = true;
		}
	}

	jQuery("body").addClass("viewer"+config.scamers.length+"video", );
	
	for(var i=0; i< config.scamers.length; i++){
		
		var key = config.scamers[i];
		let matchConf = totalList.find(o => o.name === key.substr(1));
		
		jQuery(".twitch-video").append("<div id='player-"+config.scamers[i].substr(1)+"' data-streamer='"+config.scamers[i].substr(1)+"' data-font-size='"+matchConf.size+"' data-theme-color='"+matchConf.color+"' data-theme='"+matchConf.theme+"' class='viewer'><div class='ui-widget-content twitch-description' id='"+config.scamers[i].substr(1)+"'><div class='player-options'><span data-down-font>-</span><span  data-up-font>+</span><select data-form-theme-color name='theme-color'></select><select data-form-theme name='theme'></select></div><nav class='scroll'><div class='chatscroll'></div></nav></div><div class='twitch-embed' id='twitch-embed"+(i+1)+"'></div></div>");
		
		var options = {
			width: "100%",
			height: "100%",
			channel: config.scamers[i].substr(1),
			allowfullscreen: false,
			muted: muted,
			// only needed if your site is also embedded on embed.example.com and othersite.example.com
			//parent: ["embed.example.com"]
		};
		if(muted === false){
			muted = true;
		};  
		var player = new Twitch.Player("twitch-embed"+(i+1), options);		


		player.addEventListener(Twitch.Player.READY, function() {
			var embed = player.getPlayer();
		
			embed.play();
			embed.setVolume(0.3);
			embed.setMuted(false);
		});
		
		players[config.scamers[i].substr(1)] = player;
		   
		jQuery('#player-'+config.scamers[i].substr(1)).append("<div class='player-options'><select id='data-form-quality-"+config.scamers[i].substr(1)+"' name='qualities'></select><div class='playPause' data-play='true'></div><div data-mute='false' class='muteBtn'><span></span></div><span data-down-volume>-</span><div class='volume'></div><span data-up-volume>+</span><div data-close-item>X</div></div>");
		
		jQuery(themeColors).each(function(v, color){
			var selected = "";
			
			if(color == matchConf.color) {
				selected = "selected='selected' ";
			}
			
			jQuery('#player-'+config.scamers[i].substr(1)+" [data-form-theme-color]").append("<option "+selected+"value='"+color+"'>Theme: "+color+"</option>");
		});
	
		document.getElementById('data-form-quality-'+config.scamers[i].substr(1)).addEventListener('click', (e) => {
			var target = this;
			e.target.innerHTML = '';
			
			var qol = player.getQualities();
			
			for (var x=0;x<qol.length;x++) {
			  var opt = document.createElement('option');
			  opt.value = qol[x].group;
			  opt.textContent = qol[x].name;
			  
			  e.target.innerHTML += opt.outerHTML;
			}
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
		
	jQuery(".twitch-description .scroll").dblclick(function(e) {
		jQuery(this).parent().toggleClass("hide");
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
		jQuery(".channel-form [data-counter]").text(jQuery(".channels.selected").length+" / 9");

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
		icon_channel.replace(/300/gi, 90);
		
	} else {
		var icon_channel = "assets/img/modo.png";
	}

	//User is an online object
	if(typeof scamer === 'object' && !Array.isArray(scamer) && scamer !== null){
		var duration = timeDiffCalc(new Date(scamer.started_at), new Date());
		var thumbnail_resized = scamer.thumbnail_url.replace(/{width}|{height}/gi, 30);
		var game = scamer.game_name;
		
		jQuery(".channel-form .online-stream").prepend(""+
		"<div class='channels'>"+
			"<input type='checkbox' id='"+scamer.user_login+"' tabIndex='3' name='show' value='"+scamer.user_login+"'/>"+
			"<div class='title'>"+
				"<div>"+
					"<div class='gametitle'><b>"+scamer.user_name +"</b></div>"+
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
				"<div class='title'>"+
					"<div>"+
						"<div class='gametitle'><b>"+scamer +"</b></div>"+
						"<img src='"+ icon_channel+"'/>"+
					"</div>"+
				"</div>"+
				"<img width='20' height='20' class='channel-icon' src='"+ icon_channel +"'/>"+
				"<i class='offline-icon'></i>"+
				"<label for='" + scamer + "'>" + scamer + "</label>"+
				"<div data-scamer='" + scamer + "' tabIndex='4' class='remove'>x</div>"+
			"</div>"
		);
	}

	jQuery('.channels').on('click', function(e) {
		e.stopImmediatePropagation();
		let channel = jQuery(this).find('input');
		if(channel.is(':checked')) {
			channel.prop("checked", false  );
			channel.parent(".channels").removeClass("selected");
			
		} else {
			if(jQuery(".channels.selected").length == 9) {
				return false;
			}
			
			channel.prop("checked", true );
			channel.parent().addClass("selected");
		}
		
		jQuery(".channel-form [data-counter]").text(jQuery(".channels.selected").length+ " / 9");
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
	var loadChannels = false;
	// checkstate >>> 	
	
	var name = "";
	
	if (access_token) {
		setCookie('tokenMultiTwitch', access_token, 2);
		setCookie('pleaseLoad', true, 2);
		
		if (getCookie('urlRedirect') !== undefined ) {
			url = getCookie('urlRedirect');
		}
		
		window.location.replace(url);

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
		   console.log(c);
			var name = c["login"];
			var id = c["user_id"];
					
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
								'<svg width="30px" height="30px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" class="emoteschat ScIconSVG-sc-1q25cff-1 dSicFr"><g><path d="M7 11a1 1 0 100-2 1 1 0 000 2zM14 10a1 1 0 11-2 0 1 1 0 012 0zM10 14a2 2 0 002-2H8a2 2 0 002 2z"></path><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0z" clip-rule="evenodd"></path></g></svg><div class="chatIcons scroll"></div> ' +
							"</form>");
					}
					
					const formScam = jQuery('form[name=spam-area]');	
					
					jQuery(".chatIcons").append("<h6>Generic</h6>");
					//if(emotesChannels["global"]){
						for(var i=0; i<emotesChannels["global"].length; i++) {
							jQuery(".chatIcons").append("<img title='"+emotesChannels["global"][i]["name"]+"' data-key='"+emotesChannels["global"][i]["name"]+"' width='20' height='20' src='"+emotesChannels["global"][i]["images"]["url_1x"]+"' />");
						}
					//}
					for(var j=0; j<config["scamers"].length; j++) {
						var name = config["scamers"][j].substr(1);
						
						if(emotesChannels[name]) {
							jQuery(".chatIcons").append("<h6>"+name+"</h6>");
							for(var i=0; i<emotesChannels[name].length; i++) {
								jQuery(".chatIcons").append("<img title='"+emotesChannels[name][i]["name"]+"' data-key='"+emotesChannels[name][i]["name"]+"' width='20' height='20' src='"+emotesChannels[name][i]["images"]["url_1x"]+"' />");
							}
						}
					}
					
					jQuery('.emoteschat').click(function(){
						jQuery(this).next().toggleClass("open");
					});
					jQuery('.chatIcons img').click(function(elem){
						let viewer = jQuery(this).parents(".viewer").attr("data-streamer");
						let input = jQuery("input[name="+viewer+"]");
						input.val(input.val()+jQuery(this).data('key'));
					});
						
					formScam.click(function(e) {	
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
					if(getCookie('pleaseLoad')){
						jQuery.ajax(
						{
						   type: 'GET',
						   url: 'https://api.twitch.tv/helix/channels/followed?first=100&user_id='+id,
						   headers: {
							 'Client-ID': clientID,
							 'Authorization': 'Bearer '+ access_token,
						   },
						   success: function(res){	

							 console.log(res);				   
							  var followsJSON = [];
							  for(var i=0; i<res.data.length; i++) {
								 followsJSON[i]={'name':res.data[i].broadcaster_login, 'size': 18, 'color':'default', 'theme':'default'}
							  }
							  setCookie('JsonTwitchConfig', JSON.stringify(followsJSON), 6000);
							  deleteCookie('pleaseLoad');
							  window.location.replace(basePath);
						   },

						});	
					}					
				});
				jQuery('.postmessage').prepend("<a class='authbtn' onclick='removeToken();'><p>Logged as "+name+"</p><h2>Logout</h2></a> ");					
	   },
	   error: function(event){
			name = null;
			console.log("log nok");
			const option = {
			  channels: config["scamers"]
			};
			client = new tmi.client(option);
			client.connect();
			jQuery('.postmessage').prepend("<a class='authbtn' href='https://id.twitch.tv/oauth2/authorize?response_type=token&force_verify=false&client_id="+clientID+"&redirect_uri="+basePath+"&scope=user%3Aread%3Afollows+chat%3Aread+chat%3Aedit&state=c3ab8aa609ea11e793ae92361f002671'><h2 title='Active le chat sur les streams'>Login Twitch</h2></a>");
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

function getBroadcasterId(userLogin) {

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


function getGlobalEmotes() {

   return jQuery.ajax(
		{
		   type: 'GET',
		   url: 'https://api.twitch.tv/helix/chat/emotes/global',
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			  emotesChannels["global"] = c.data;
		   },
		}
	);
}

function getEmotesChannels(data, textStatus, jqXHR) {

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
function getBadgesChannels(data, textStatus, jqXHR) {
	
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
	   getBroadcasterId(userLogin).then(getEmotesChannels);
	   getBroadcasterId(userLogin).then(getBadgesChannels);
	});
	getGlobalEmotes();
	console.log(emotesChannels);
	//console.log(badgesChannels);
}

function stopPropagation(id, event) {
    jQuery(id).on(event, function(e) {
        e.stopPropagation();
        return false;
    });
}

jQuery(document).ready(function(){	

	var cache = {};
    jQuery('#import').autocomplete({
	  minLength: 2,
	  source: function( request, response ) {
		
		var term = request.term;
		/*
		if ( term in cache ) {
		  response( cache[ term ] );
		  return;
		}*/
	
		jQuery.ajax(
		{
		   type: 'GET',
		   url: 'https://api.twitch.tv/helix/search/channels?query='+request.term,
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			  //data array is empty when queried channel is offline
			if (c.data.length > 0) {	
				console.log(c);
				jQuery(".suggestion .streams").remove();
				
				jQuery(c.data).each(function(key, val){
					jQuery(".suggestion").append('<div class="streams" data-channel="'+val.broadcaster_login+'"><div style="background-image: url('+val.thumbnail_url+');background-size: cover;" class="paddbox"><a title="'+val.title+'" class="suggest" href="https://mytwitchplayer.fr/?add='+val.broadcaster_login+'">'+val.display_name+'<small> '+val.display_name+'</small><br><small>'+val.game_name+'</small></a></div></div>');
				});
				//response( c.data );
				/*
				cache[ term ] = c.data;
				response( c.data );*/
			}
		   },
		});
		
	  }
    });




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
	
/*	function refreshToken() {
		jQuery.ajax(
		{
		   type: 'POST',
		   url: 'https://api.twitch.tv/oauth2/token?' + urlUsers,
		   headers: {
			 'Client-ID': clientID,
			 'Authorization': 'Bearer ' + authToken, 
		   },
		   success: function(c){
			  totalListInfos = c.data;
			  myPeriodicMethod(scamConf, true);
		   }
		});
	}	*/
	
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
			jQuery(c.data).each(function(i, val){
				var thumbnail_resized = val.thumbnail_url.replace(/{width}|{height}/gi, 400);
				

				jQuery(".hometext .suggestion").append("<div class='streams' data-channel='"+val.user_login+"'><div style='background-image: url("+thumbnail_resized+");background-size: cover;' class='paddbox' ><a title='"+val.title+"' class='suggest' href='"+basePath+"?add="+val.user_login+"'>"+val.user_name+"<small> ("+val.viewer_count+")</small><br><small>"+val.game_name+"</small></a></div>");
				
				
				/*
				val.tags.each(function(j, v){
					jQuery(".streams [data-channel='"+val.user_login+"']").prepend("<span class=='tags'>"+v+"</span>");
				});
				
				*/
			});
			
			jQuery(".streams").mouseenter(function () {
				var channel = $(this).data('channel');
				$(this).append("<iframe class='tempVid' src='https://player.twitch.tv/?channel="+channel+"&muted=true&parent=mytwitchplayer.fr'></iframe>");
			}).mouseleave(function () {
				$('.tempVid').remove();
			})
			
			/*Ptit hover pour créer l'iframe */
		  }
	   },
	});
	
	jQuery(".toggleShit").click(function(){
		jQuery(this).toggleClass("hide");
		jQuery(".status").toggleClass("hide");
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
			jQuery(".toggleShit").toggleClass("hide");
			jQuery(".status").toggleClass("hide");

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
				jQuery('.player-options, .status, .switchers').css({
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
				jQuery('.status, .player-options, .switchers').css({
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
	
	
	function deleteAllCookies() {
		const cookies = document.cookie.split(";");

		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	}
	
	
	jQuery("[data-reset-app]").on('click', function(){
		//deleteCookie('JsonTwitchConfig');
		deleteAllCookies();
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
		var elem = jQuery(this).closest('.twitch-description');
		
		var lineHeight = elem.css('line-height');
		var fontSize = elem.css('font-size');
		
		elem.css('line-height',parseInt(lineHeight, 10)-1+"px").css('font-size',parseInt(fontSize, 10)-1+"px");
		
		var id = elem.attr('id');
		
		updateJsonCookievalueByname("JsonTwitchConfig", id, 'size', fontSize);
	});
	
	jQuery("[data-up-font]").on('click', function() {
		var elem = jQuery(this).closest('.twitch-description');
		
		var lineHeight = elem.css('line-height');
		var fontSize = elem.css('font-size');
		
		elem.css('line-height',parseInt(lineHeight, 10)+1+"px").css('font-size',parseInt(fontSize, 10)+1+"px");
		
		var id = elem.attr('id');
		
		updateJsonCookievalueByname("JsonTwitchConfig", id, 'size', fontSize);
	});
	
	jQuery("[data-down-volume]").on('click', function() {
		let viewer = jQuery(this).parents(".viewer").attr("data-streamer");
		players[viewer].setVolume((players[viewer].getVolume() - 0.05));
		jQuery(this).parent().find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 - 5))+"px inset #9146FF");
	});
	
	jQuery("[data-up-volume]").on('click', function() {
		let viewer = jQuery(this).parents(".viewer").attr("data-streamer");
		players[viewer].setVolume((players[viewer].getVolume() + 0.05));
		jQuery(this).parent().find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 + 5))+"px inset #9146FF");
	});	
	
	jQuery("[data-form-theme-color]").on( "change", function(){
		var elem = jQuery(this).closest('.twitch-description');
		
		elem.parent().attr("data-theme-color", this.value);
		var id = elem.attr('id');

		updateJsonCookievalueByname("JsonTwitchConfig", id, 'color', this.value);
		
	});
	
	jQuery("[data-form-theme]").on( "change", function(){
		var elem = jQuery(this).closest('.twitch-description');
		
		elem.parent().attr("data-theme", this.value);
		var id = elem.attr('id');

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
		let viewer = jQuery(this).parents(".viewer").attr("data-streamer");
		let toggleState = !players[viewer].getMuted();
		
		players[viewer].setMuted(toggleState);
		jQuery(this).attr("data-mute", toggleState);
		jQuery(this).closest(".viewer").find(".volume").attr("data-mute", toggleState);
	});
	
	jQuery("[name=qualities]").on('change', function(e) {
		let viewer = jQuery(this).parents(".viewer").attr("data-streamer");
		var opt = this.value;
		players[viewer].setQuality(opt);
		
	});	
	
    jQuery("[data-close-item]").on('click',function(e){
		jQuery(this).parents(".viewer").remove();

		const prefix = "viewer";
		const el = jQuery("body").attr("class");
		const classes = el.split(" ").filter(c => !c.startsWith(prefix));
		
		jQuery("body").attr("class", classes.join(" ").trim());
		
		var length = jQuery(".viewer").length;
		jQuery("body").addClass("viewer"+length+"video");
	});
	/*
	setTimeout(function() {
		jQuery('[data-a-target="tw-core-button-label-text"]').trigger('click');
		jQuery('[data-a-target="content-classification-gate-overlay-start-watching-button]"').trigger('click');
	}, 5000);
	*/
	jQuery(".playPause").on('click',function(e){
		let viewer = jQuery(this).parents(".viewer").attr("data-streamer");
		let isPaused = players[viewer].isPaused();

		if(isPaused) {
			players[viewer].play();
			
		} else {
			players[viewer].pause();
		
		}
		jQuery(this).attr("data-play", isPaused);
	});
	
	jQuery(".channels").hover(function(e){
		var topElement = jQuery(this).offset().top+"px";
		var topScroll = jQuery(".menu-scroll").scrollTop();
		console.log(topElement);
		console.log(topScroll);
		if( topScroll === 0)
			jQuery(".title").css("top", "inherit");
		else 
			jQuery(".title").css("top", topElement+topScroll);
	});

	 /*
	jQuery(".menu-scroll").on('scroll',function(e){
		var topScroll = jQuery(this).scrollTop();
		if(jQuery(".menu-scroll").scrollTop() === 0)
			jQuery(".title").css("top", "inherit");
		else 
			jQuery(".title").css("top", topScroll);
			
	});*/

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
					channelBitsIcon =  "style='background-image:url(\""+iconBitsInfo["image_url_1x"]+"\");'";
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
				  "<span title='Bits' "+channelBitsIcon+" data-bits="+bits+"'></span>"+
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

- pluie d'emotes + option

- webhooks >> stream.online, stream.offline, channel.ban, channel.raid	
- cookie "emotes pref"
- reply to 
- droits emotes
- scroll fix 

OMG le strem se lance mute bordel !

404 kraken/chat/emoticon si loggué

https://dev.to/codesphere/how-to-create-a-twitch-chat-game-with-javascript-deg

STEP 1 ??
https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=vn9avm6d14fgwfyq0hc655klhwdcv8&redirect_uri=https://mytwitchplayer.fr/&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671

STEP 2 récupérer tokenMultiTwitch (cookie)

STEP 3 le remplacer dans script.js

26/05/2023
*/






