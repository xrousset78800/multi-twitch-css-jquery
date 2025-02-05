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

function deleteAllCookies() {
	const cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}

function removeToken(){
	deleteAllCookies();
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
    try {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                const value = c.substring(nameEQ.length, c.length);
                // Tenter de parser si c'est du JSON
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }
        }
        return undefined;
    } catch (error) {
        console.error("Erreur lors de la lecture du cookie:", error);
        return undefined;
    }
}

function setCookie(name, value, days) {
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `; expires=${date.toUTCString()}`;
        
        // Pour les objets et tableaux, s'assurer qu'ils sont bien stringifiés
        const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
        console.log(cookieValue);
        document.cookie = `${name}=${cookieValue}${expires}; path=/`;
        
        // Vérifier que le cookie a bien été sauvegardé
        const savedCookie = getCookie(name);
        if (savedCookie === undefined) {
            console.log(`Échec de la sauvegarde du cookie`);
            return false;
        }
        return true;
    } catch (error) {
        console.log("Erreur lors de la sauvegarde du cookie:",);
        return false;
    }
}

function updateJsonCookievalueByname(cookieName, nameId, prop, propNewVal) {
    try {
        const configObject = JSON.parse(localStorage.getItem(cookieName));
        if (!configObject) return;

        configObject.forEach(obj => {
            if(obj.name === nameId) {
                obj[prop] = propNewVal;
            }
        });

        localStorage.setItem(cookieName, JSON.stringify(configObject));
    } catch (e) {
        console.error("Erreur lors de la mise à jour:", e);
    }
}

function updateJsonCookieremoveByname(cookieName, nameId) {
    try {
        const configObject = JSON.parse(localStorage.getItem(cookieName));
        if (!configObject) return;

        const filteredConfig = configObject.filter(obj => obj.name !== nameId);
        localStorage.setItem(cookieName, JSON.stringify(filteredConfig));
    } catch (e) {
        console.error("Erreur lors de la suppression:", e);
    }
}

function deleteCookie(name) {
    try {
        localStorage.removeItem(name);
    } catch (e) {
        console.error("Erreur lors de la suppression:", e);
    }
}

function scrollToBottom(channel) {
	jQuery(channel.toLowerCase()+' nav.scroll').animate({ scrollTop: jQuery(channel.toLowerCase()+' nav.scroll > div.chatscroll').height() }, 50);
    return false;
}
