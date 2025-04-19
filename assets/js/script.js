
let authToken;
let tokenLoaded = new Promise(async (resolve, reject) => {
  try {
    const response = await fetch('/load.php');
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    authToken = data.token;
    resolve(authToken);
  } catch (error) {
    console.error("Erreur lors du chargement du token :", error);
    reject(error);
  }
});

async function useToken() {
  await tokenLoaded;
  console.log("Utilisation du token :", authToken);
}

async function getAuthToken() {
    await tokenLoaded;
    if (!authToken) {
        throw new Error("Token non disponible");
    }
    return authToken;
}

const getLangueNormalisee = () => {
  return ['fr', 'en', 'de', 'es'].includes(navigator.language.slice(0, 2)) 
    ? navigator.language.slice(0, 2) 
    : 'fr';
}

let clientID = "vn9avm6d14fgwfyq0hc655klhwdcv8";
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

async function loadTopCategories() {
    const authToken = await getAuthToken();
    jQuery.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/games/top?first=100',
        headers: {
            'Client-ID': clientID,
            'Authorization': 'Bearer ' + authToken,
        },
        success: function(response) {
            const gameSelect = jQuery('#category-filter');
            
            // Transformer les données pour Select2
            const formattedData = [
                { id: '', text: 'Toutes les catégories' }, // Option par défaut
                ...response.data.map(game => ({
                    id: game.id,
                    text: game.name,
                    image: game.box_art_url.replace(/{width}|{height}/gi, 30)
                }))
            ];

            // Initialiser Select2
            gameSelect.select2({
                data: formattedData,
                templateResult: formatGame,
                templateSelection: formatGame,
                placeholder: 'Toutes les catégories'
            });

        }
    });
}

function formatGame(game) {
    if (!game.id) return game.text; // Pour l'option "Toutes les catégories"
    
    return jQuery(`<span>
        <img src="${game.image}" style="width: 30px; vertical-align: middle;"/>
        <span style="margin-left: 5px">${game.text}</span>
    </span>`);
}

async function loadScam() {
  const authToken = await getAuthToken();
  var scamGet = [];
  var urlParams = new URLSearchParams(window.location.search);
  var newScamer = urlParams.getAll('add');
  const path = window.location.pathname.substring(1);
  const streamersInPath = path ? path.split('/').filter(s => s) : [];

  if (streamersInPath.length > 0) {
  	if (newScamer.length === 0) {
      newScamer = streamersInPath;
    }
    scamGet = streamersInPath;
  } else {
  	scamGet = urlParams.getAll('show');
  }

	if(localStorage.getItem("JsonTwitchConfig") !== null) {
	    configObject = JSON.parse(localStorage.getItem("JsonTwitchConfig"));
	}

	if(newScamer) {
		var toObject = [];
		var jsonString = [];

		if(configObject.length != 0) {
			var parse = configObject;
			
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
					  var allEntries = JSON.parse(localStorage.getItem("JsonTwitchConfig")) || [];
						allEntries.push(newChannel);
						console.log(allEntries)
						localStorage.setItem('JsonTwitchConfig', JSON.stringify(allEntries));
						window.location.replace(window.location.pathname);
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

		var player = new Twitch.Player("twitch-embed"+(i+1), options);		


		player.addEventListener(Twitch.Player.READY, function() {
			var embed = player.getPlayer();
		
			embed.play();
			embed.setVolume(0);
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
		jQuery(".channel-form .reset-channels").attr("data-items", jQuery(".channels.selected").length );

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
		jQuery(".channel-form .reset-channels").attr("data-items", jQuery(".channels.selected").length );
	});	
	
	jQuery(".channel-form [type=reset]").on('click', function(e) {
		e.preventDefault();
		jQuery(".channels.selected").each(function(){
			jQuery(this).removeClass('selected');
		});
		jQuery(".channel-form [data-counter]").text("0 / 9");
		jQuery(".channel-form .reset-channels").attr("data-items", 0 );
	});

	jQuery(".channels").hover(function(e){
	    const rect = this.getBoundingClientRect();
	    jQuery(".title").css("top", rect.top + "px");
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
	
	if (!access_token) {
		access_token = getCookie('tokenMultiTwitch');
		setCookie('urlRedirect', url, 2);
	} else {
		
    setCookie('tokenMultiTwitch', access_token, 2);    
    if (getCookie('urlRedirect') !== undefined ) {
        url = getCookie('urlRedirect');
        deleteCookie('urlRedirect');
    }
    
    window.location.replace(url);
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
					if(!getCookie('pleaseLoad')) {
						jQuery.ajax(
						{
						   type: 'GET',
						   url: 'https://api.twitch.tv/helix/channels/followed?first=100&user_id='+id,
						   headers: {
							 'Client-ID': clientID,
							 'Authorization': 'Bearer '+ access_token,
						   },
						   success: function(res){    
			            let existingConfig = [];
			            const storedConfig = localStorage.getItem('JsonTwitchConfig');
			            if (storedConfig) {
			                existingConfig = JSON.parse(storedConfig);
			            }

			            // Transformer les nouveaux follows en config
			            const followsJSON = res.data.map(item => ({
			                'name': item.broadcaster_login,
			                'size': 18,
			                'color': 'dark-opacity',
			                'theme': 'default'
			            }));

			            const mergedConfig = [...existingConfig];
			            followsJSON.forEach(newItem => {
			                if (!mergedConfig.some(existingItem => existingItem.name === newItem.name)) {
			                    mergedConfig.push(newItem);
			                }
			            });

			            localStorage.setItem('JsonTwitchConfig', JSON.stringify(mergedConfig));
			            setCookie('pleaseLoad', true, 2);
			            window.location.replace(url);
        			}

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
			deleteCookie('pleaseLoad');
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

async function getBroadcasterId(userLogin) {
  const authToken = await getAuthToken();
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


async function getGlobalEmotes() {
	 const authToken = await getAuthToken();
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

async function getEmotesChannels(data, textStatus, jqXHR) {
	 const authToken = await getAuthToken();
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
async function getBadgesChannels(data, textStatus, jqXHR) {
	 const authToken = await getAuthToken();
	
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

jQuery(document).ready(async function(){
	jQuery('#language-filter').val(getLangueNormalisee());
	var cache = {};
	const authToken = await getAuthToken();
	loadTopCategories();
	jQuery('#import').autocomplete({
	    minLength: 2,
	    source: function(request, response) {
	        var term = request.term;
	        const language = jQuery('#language-filter').val();
	        const gameId = jQuery('#category-filter').val();

	        let url = 'https://api.twitch.tv/helix/search/channels?query=' + request.term;
	        if (language) url += '&broadcaster_language=' + language;
	        if (gameId) url += '&game_id=' + gameId;

	        jQuery.ajax({
	            type: 'GET',
	            url: url,
	            headers: {
	                'Client-ID': clientID,
	                'Authorization': 'Bearer ' + authToken,
	            },
	            success: function(c) {
	                if (c.data.length > 0) {
	                    jQuery(".suggestion .streams").remove();
	                    console.log(c.data);
	                    jQuery(c.data).each(function(key, val) {
	                    	console.log(val.thumbnail_url);
	                        jQuery(".suggestion").append(
	                            "<form class='add-stream-form streams' data-channel='" + val.broadcaster_login + "' method='post'> " +
	                            "<div style='background-image: url(" + val.thumbnail_url + ");background-size: cover;' class='paddbox'> " +
	                            "<div class='channel-logo'>" +
	                            "<img src='" + val.thumbnail_url + "' alt='" + val.display_name + " logo' />" +
	                            "</div>" +
	                            "<div class='online-status live-is-" + val.is_live + "'></div>" +
	                            "<input type='hidden' name='add_stream' value='" + val.broadcaster_login + "'>" +
	                            "<button type='submit' class='suggest' title='" + val.title + "'>" +
	                            val.display_name +
	                            "<small>" + val.game_name + "</small>" +
	                            (language ? "<small class='language fi fi-"+val.broadcaster_language+"'></small>" : "") +
	                            "</button>" +
	                            "</div> " +
	                            "</form>"
	                        );
	                    });

	                    // Mettre à jour également le code pour loadStreams()
	                    jQuery(document).on('submit', '.add-stream-form', function(e) {
	                        e.stopImmediatePropagation();
	                        const streamName = jQuery(this).find('input[name="add_stream"]').val();
	                        var newChannel = {
	                            'name': streamName,
	                            'size': 22,
	                            'color': 'dark-opacity',
	                            'theme': 'default',
	                        };

	                        const currentConfig = JSON.parse(localStorage.getItem('JsonTwitchConfig') || '[]');
	                        currentConfig.push(newChannel);
	                        localStorage.setItem('JsonTwitchConfig', JSON.stringify(currentConfig));
	                    });

	                    // Conserver le comportement hover pour la preview
	                    jQuery(".streams").mouseenter(function() {
	                        var channel = jQuery(this).data('channel');
	                        jQuery(this).append("<iframe class='tempVid' src='https://player.twitch.tv/?channel=" + channel + "&muted=true&parent=mytwitchplayer.fr'></iframe>");
	                    }).mouseleave(function() {
	                        jQuery('.tempVid').remove();
	                    });
	                }
	            },
	        });
	    }
	});




	var scamConf = await loadScam();
	loadClient(scamConf);
	
	var urlStreams = "";
	var urlUsers = "";
	
	totalList.forEach(function(scam) {
	   urlStreams = urlStreams + "user_login=" + scam.name + "&";
	   urlUsers = urlUsers + "login=" + scam.name + "&";
	});	
	
	async function getUsersData() {
		const authToken = await getAuthToken();
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
	async function loadStreams() {
	    const language = jQuery('#language-filter').val();
	    const gameId = jQuery('#category-filter').val();

	    let streamUrl = 'https://api.twitch.tv/helix/streams?first=20';
	    if (language) streamUrl += '&language=' + language;
	    if (gameId) streamUrl += '&game_id=' + gameId;

	    const authToken = await getAuthToken();
	    jQuery(".hometext .suggestion").empty();

	    jQuery.ajax({
	        type: 'GET',
	        url: streamUrl,
	        headers: {
	            'Client-ID': clientID,
	            'Authorization': 'Bearer ' + authToken,
	        },
	        success: async function(streamData) {
	            if (streamData.data.length > 0) {
	                // Obtenir les informations des utilisateurs pour avoir leurs avatars
	                const userIds = streamData.data.map(stream => stream.user_id).join('&id=');
	                const usersResponse = await jQuery.ajax({
	                    type: 'GET',
	                    url: 'https://api.twitch.tv/helix/users?id=' + userIds,
	                    headers: {
	                        'Client-ID': clientID,
	                        'Authorization': 'Bearer ' + authToken,
	                    }
	                });

	                const userMap = {};
	                usersResponse.data.forEach(user => {
	                    userMap[user.id] = user.profile_image_url;
	                });

	                jQuery(streamData.data).each(function(i, val) {
	                    var thumbnail_resized = val.thumbnail_url.replace(/{width}|{height}/gi, 400);
	                    jQuery(".hometext .suggestion").append(
	                        "<form class='add-stream-form streams' data-channel='" + val.user_login + "' method='post'>" +
	                        "<div style='background-image: url(" + thumbnail_resized + ");background-size: cover;' class='paddbox'>" +
	                        "<div class='channel-logo'>" +
	                        "<img src='" + userMap[val.user_id] + "' alt='" + val.user_name + " logo' />" +
	                        "</div>" +
	                        "<div class='online-status live-is-true'></div>" +
	                        "<input type='hidden' name='add_stream' value='" + val.user_login + "'>" +
	                        "<button type='submit' class='suggest' title='" + val.title + "'>" +
	                        val.user_name + "<small class='counter'>" + val.viewer_count.toLocaleString() + "</small>" +
	                        "<small>" + val.game_name + "</small>" +
	                        (language ? "<small class='language fi fi-"+val.language+"'></small>" : "") +
	                        "</button>" +
	                        "</div>" +
	                        "</form>"
	                    );
	                });
	                
                    // Mettre à jour également le code pour loadStreams()
                    jQuery(document).on('submit', '.add-stream-form', function(e) {
                        e.stopImmediatePropagation();
                        const streamName = jQuery(this).find('input[name="add_stream"]').val();
                        var newChannel = {
                            'name': streamName,
                            'size': 22,
                            'color': 'dark-opacity',
                            'theme': 'default',
                        };

                        const currentConfig = JSON.parse(localStorage.getItem('JsonTwitchConfig') || '[]');
                        currentConfig.push(newChannel);
                        localStorage.setItem('JsonTwitchConfig', JSON.stringify(currentConfig));
                    });

	                // Conserver le comportement hover pour la preview
	                jQuery(".streams").mouseenter(function() {
	                    var channel = jQuery(this).data('channel');
	                    jQuery(this).append("<iframe class='tempVid' src='https://player.twitch.tv/?channel=" + channel + "&muted=true&parent=mytwitchplayer.fr'></iframe>");
	                }).mouseleave(function() {
	                    jQuery('.tempVid').remove();
	                });
	            }
	        }
	    });
	}
	
  jQuery('#language-filter, #category-filter').on('change', function() {
      loadStreams(); // Recharger les streams avec les nouveaux filtres
      
      // Si une recherche est en cours, la relancer avec les nouveaux filtres
      const searchTerm = jQuery('#import').val();
      if (searchTerm.length >= 2) {
          jQuery('#import').autocomplete("search", searchTerm);
      }
  });

	async function myPeriodicMethod(scamConf, firstIteration) {
		const authToken = await getAuthToken();
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
	loadStreams();
	// D'abord, vérifions les filtres actuels
const language = jQuery('#language-filter').val();
const gameId = jQuery('#category-filter').val();

// Construction de l'URL avec les filtres
let streamUrl = 'https://api.twitch.tv/helix/streams';
let params = [];
if (language) params.push('language=' + language);
if (gameId) params.push('game_id=' + gameId);
if (params.length > 0) streamUrl += '?' + params.join('&');



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
	
	jQuery("[data-reset-app]").on('click', function(){
		deleteAllCookies();
		localStorage.removeItem('JsonTwitchConfig');
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

	jQuery('.channel-form input[type=submit]').on('click', function(e) {
	    e.preventDefault();
	    
	    const selectedStreamers = [];
	    jQuery('.channels input:checked').each(function() {
	        selectedStreamers.push(jQuery(this).val());
	    });

	    if (selectedStreamers.length > 0) {
	        const newUrl = `${basePath}${selectedStreamers.join('/')}`;
	        window.location.href = newUrl;
	    }
	    
	    return false;
	});

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
		players[viewer].setVolume((players[viewer].getVolume() - 0.1));
		jQuery(this).parent().find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 - 10))+"px inset #9146FF");
	});
	
	jQuery("[data-up-volume]").on('click', function() {
		let viewer = jQuery(this).parents(".viewer").attr("data-streamer");
		players[viewer].setVolume((players[viewer].getVolume() + 0.1));
		jQuery(this).parent().find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 + 10))+"px inset #9146FF");
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
			players[viewer].setVolume((players[viewer].getVolume() + 0.1));
			jQuery(this).find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 + 10))+"px inset #9146FF");
		} else {
			players[viewer].setVolume((players[viewer].getVolume() - 0.1));
			jQuery(this).find(".volume").css("border-bottom", ((players[viewer].getVolume()*100 - 10))+"px inset #9146FF");
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

- webhooks >> stream.online, stream.offline, channel.ban, channel.raid	
- cookie "emotes pref"
- reply to 
- droits emotes

OMG le strem se lance mute bordel !

404 kraken/chat/emoticon si loggué

STEP 1 ??
https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=vn9avm6d14fgwfyq0hc655klhwdcv8&redirect_uri=https://mytwitchplayer.fr/&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671

STEP 2 récupérer tokenMultiTwitch (cookie)

STEP 3 le remplacer dans script.js

26/05/2023
*/






