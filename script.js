let authToken = "ebio7i23n0oa5qfwfrteza6xfj90w9";
let clientID = "vn9avm6d14fgwfyq0hc655klhwdcv8";
    	
var scamersTotalList = ['Xou____', 'Zed_B', 'Emizdar', 'patayencroute', 'amouranth', 'mistermv', 'zgolene', 'slackos_tv'];

function loadScam() {
var urlscammers = "";

scamersTotalList.forEach(function(scam) {
   urlscammers = urlscammers + "user_login=" + scam + "&";
});

var urlParams = new URLSearchParams(window.location.search);
var scamGet = urlParams.getAll('scamer');
var showChat = urlParams.get('active_chat');

if(!showChat) {
	showChat = "true";
} 

if(scamGet.length == 0) {
	scamGet[0] = "Zed_B";
} 
if(scamGet.length == 1) {
	jQuery(".page-title").append(scamGet[0] + " scam");
} else {
	jQuery(".page-title").append("Multi scam");
}

StartThisShit(scamGet, showChat);
jQuery("input[name=active_chat][value='"+showChat+"']").prop("checked",true);

  jQuery("h1.toggleShit").click(function(){
    jQuery(".status").toggle(800,"linear");
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
   	updateStatuses(c.data, scamGet);
   }

});

}

function StartThisShit(scamers, showChat) {
	jQuery("body").addClass("viewer"+scamers.length+"video");
		var layout="video";
		if(showChat == "true") {
			layout="video-with-chat";
		}

for(var i=0; i<scamers.length; i++){
		jQuery(".twitch-video").append("<div class='viewer'><div class='twitch-description' id='twitch-description"+(i+1)+"'></div><div class='twitch-embed'  id='twitch-embed"+(i+1)+"'></div></div>");
		updateScammerOnlineBullshit(scamers[i], i+1);

		  new Twitch.Embed("twitch-embed"+(i+1), {
			width: "100%",
			height: "100%",
			layout: layout,
			channel: scamers[i]
		  });	
		 //jQuery(".twitch-video").append("<iframe id='twitch-chat-embed"+scamers[i]+"' src='https://www.twitch.tv/embed/"+scamers[i]+"/chat?parent=https://xouindaplace/scam-is-real/' height='100%' width='350'></iframe>");
 
}

		return true;
}

function updateStatuses(response, scamersList) {
	jQuery(scamersTotalList).each(function(scam, value){
            var scamer = value;
		let flag = false;
		
		jQuery(response).each(function(value, user){
		      if(user.user_login == scamer || user.user_name == scamer){
				getBroadcast(user.user_id);
                        updateScammerStatus(true, user); 
			      flag = true;
			}	
		});
		if(flag == false) {
			updateScammerStatus(false, scamer);
		}
		jQuery(scamersList).each(function(){
			jQuery('.channel-form [value='+this+']').attr("checked", "checked");
		});	
		
	});
}

function updateScammerStatus(online, scamer) {
	if(online === true){
		var duration = timeDiffCalc(new Date(scamer.started_at), new Date());
		var thumbnail_resized = scamer.thumbnail_url.replace(/{width}|{height}/gi, 60);
		var game = scamer.game_name;
console.log(scamer);
		jQuery(".channel-form").prepend("<div class='channels'><input type='checkbox' id='"+scamer.user_name+"' name='scamer' value='"+scamer.user_name+"'/><div class='title'><img src='"+ thumbnail_resized+"'/>"+ scamer.title +"<div class='infos'>"+scamer.viewer_count+" Victimes</div><div class='date'>"+duration+"</div></div><i class='online-icon'></i><label for='"+scamer.user_name+"' >" + scamer.user_name + "</label><small class='game'><i>"+game+"</i></small></div>");
	}else{
		jQuery(".channel-form").prepend("<div class='channels'><input type='checkbox' id='"+scamer+"' name='scamer' value='"+scamer+"'/><i class='offline-icon'></i><label for='"+scamer+"'>" + scamer + "</label></div>");
	}
}

function updateScammerOnlineBullshit(scamer,index) {
	jQuery("#twitch-description"+index).append('<a target="_blank" href="https://twitch.tv/'+scamer+'">'+scamer+'</a>');
}

function timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
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