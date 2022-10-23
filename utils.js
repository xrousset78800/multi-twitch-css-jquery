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

function removeToken(){
	deleteCookie("tokenMultiTwitch");
	window.location.reload();
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

function updateJsonCookievalueByname(cookieName, nameId, prop, propNewVal) {
	var configObject = JSON.parse(getCookie(cookieName));
	
	configObject = configObject.filter(function( obj ) {
		if(obj.name == nameId){
			obj[prop] = propNewVal;
		}
		return obj;
	});
	
	setCookie(cookieName, JSON.stringify(configObject), 60);
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
