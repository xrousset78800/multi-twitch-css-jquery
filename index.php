<!doctype html>
<html lang="en">
	<head>
	  <meta charset="utf-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1">
	  <title>Scam</title>
	  <meta name="description" content="Scam">
	  <meta name="author" content="Scam">
	  
	  <meta property="og:title" content="Scam">
	  <meta property="og:type" content="website">
	  <meta property="og:url" content="">
	  <meta property="og:description" content="A simple Scam">
	  <meta property="og:image" content="">
	  
	  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	  <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
	  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>

	  <script src="/scam-is-real/script.js"></script>
	  <script src="/scam-is-real/tmi.min.js"></script>
	  
	  <link rel="icon" type="image/png" href="/scam-is-real/favicon.png" />
	  <link href="/scam-is-real/style.css" rel="stylesheet" />
	  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand" />
	</head>
	<body class="vsc-initialized">
		<div class="page wrapper">
			<header class="blog-header home row">
				<div class="cell cell-12">
					<h1 class="page-title"></h1>
					<p class="omg">Gère jusqu'a 9 players</p>
					<div class="postmessage">
						<form action="" name="spam-area">
						<select disabled id="channel-to-feed" name="channel-to-feed">
							<option value="" selected disabled hidden>--Chaine--</option>
						</select>
						<input disabled type="text" id="spam-content" value="" placeholder="(TODO) Envoyer un message"/>
						<input disabled type="submit" value="Go"/>
						</form>
					</div>
				</div>
			</header>
			<main id="myScamPlayer" class="page-content">
				<div class="status">
					<div class="status-text">
						<form action="#" method="GET" class="channel-form">
							<input type="text" name="newScamer" placeholder="Add new scamer in list" value="">
							<div class="online-stream">
							</div>
							<div class="offline-stream">
							</div>
							<div class="chat">
								<input type="radio" name="active_chat" value="video"/><label for="active_chat">Hide chat</label>
								<br />
								<input checked="checked" type="radio" name="active_chat" value="embed"/><label for="active_chat">Embed chat</label>
								<!--input type="checkbox" name="full_scam_after_reload" value="true"/><label for="full_scam_after_reload">full scam on load</label-->							
							</div>						
							<input type="submit" value="Load this shit" />
						</form>
					</div>
				</div>
				<h1 title="In full scam please" id="go-button">Full Scam</h1>
				<h1 class="toggleShit hide" name="toggle">Menu</h1>
				<div class="twitch-video">
					<!-- Load the Twitch embed JavaScript file -->
					<script src="https://embed.twitch.tv/embed/v1.js"></script>
					<div class="instructions">
						<h1>Instructions</h1>
						<ol>
							<li class="tuto-add">Ajoutez des chaines dans le menu</li>
							<li class="tuto-select">Selectionnez les chaines à charger</li>
							<li class="tuto-enjoy">Enjoy</li>
						</ol>
					</div>
				</div>
		  </main>
		</div>
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-9FP44RMCTK"></script>
		<script>
			  window.dataLayer = window.dataLayer || [];
			  function gtag(){window.dataLayer.push(arguments);}
			  gtag('js', new Date());
			setTimeout(function(){
			 gtag('config', 'G-9FP44RMCTK', {
				'page_title' : $(document).attr('title')
			 });
		}, 5000);	
		</script>
	</body>
</html>