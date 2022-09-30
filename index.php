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
  <script src="/scam-is-real/script.js"></script>
  <script src="/scam-is-real/tmi.min.js"></script>
  
  <link rel="icon" type="image/png" href="/scam-is-real/favicon.png">
  <link href="/scam-is-real/style.css" rel="stylesheet">
  <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Quicksand">
</head>
  <body class="vsc-initialized">
  	<div class="status">
	  	<div class="status-text">
			<form action="" method="GET" class="channel-form">
				<!--input type="text" name="scamer" placeholder="or another scamer" value=""-->
				<div class="online-stream">
				</div>
				<div class="offline-stream">
				</div>
				<div class="chat">
					<input type="radio" name="active_chat" value="true"/><label for="active_chat">Show Twitch chat</label>
					<br />
					<input type="radio" name="active_chat" value="false"/><label for="active_chat">Hide chat</label>
					<br />
					<input type="radio" name="active_chat" value="embed"/><label for="active_chat">Embed chat</label>					
				</div>
				
				<input type="checkbox" name="full_scam_on_load" disabled="disabled" value=""/><label for="full_scam_on_load">full_scam_on_load</label>
				<input type="checkbox" name="move_chat" disabled="disabled" value=""/><label for="move_chat">move_chat</label>
				
				<input type="submit" value="Load this shit" />
			</form>
	    </div>
	</div>
    <div class="page wrapper">
		<header class="blog-header home row">
			<div class="cell cell-12">
				<h1 class="page-title"></h1>
			</div>
		</header>
        <main id="myScamPlayer" class="page-content">
			<h1 class="toggleShit hide" name="toggle">Menu</h1>
			<div class="twitch-video">
				<!-- Load the Twitch embed JavaScript file -->
				<script src="https://embed.twitch.tv/embed/v1.js"></script>
			</div>
      </main>
    </div>
	<h1 title="In full scam please" id="go-button">Full Scam</h1>

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