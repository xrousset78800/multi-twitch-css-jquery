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
	<h1 class="toggleShit hide" name="toggle">Menu</h1>
    <div class="page wrapper">
		<header class="blog-header home row">
			<div class="cell cell-12">
				<h1 class="page-title"></h1>
			</div>
		</header>
        <main id="myScamPlayer" class="page-content">
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
		
		<script>
      let screenDim = 600;


      let players = []; // All Players who are still in the game
      let boxes = { unChosen: players.slice(), A: [], B: [], C: [], D: [] }; // What players are in each box
      let round = 1;
      let timeLeft = 15; // 15 seconds for 1st round, 5 for subsequent rounds
      let mostRecentEliminated = "Type Join To Enter The Game"; // Text that appears on the bottom

      function setup() { // Runs when page loads in
        console.log("Setting Up");
        createCanvas(screenDim + 300, screenDim + 300); // Create p5.js canvas
        frameRate(100); //Measured in FPS
        setupClient(); // Setup TMI to listen to Twitch comments
      }

      function resetBoxes() { // Runs after each round
        timeLeft = 5; // Reset timer
        round += 1; // Increment round
        boxes = { unChosen: players.slice(), A: [], B: [], C: [], D: [] }; // Reset boxes
      }
      function clearName(name) { // Eliminate a player from their box

        // Go through each of the boxes and filter out the relevant name

        boxes.unChosen = boxes.unChosen.filter((elem) => elem !== name);
        boxes.A = boxes.A.filter((elem) => elem !== name);
        boxes.B = boxes.B.filter((elem) => elem !== name);
        boxes.C = boxes.C.filter((elem) => elem !== name);
        boxes.D = boxes.D.filter((elem) => elem !== name);
      }
      function setupClient() { // Setup TMI to listen to Twitch Chat
        const client = new tmi.Client({ // Setup TMI Client with the channel(s) you want to listen to
          channels: ["INSERT_TWITCH_NAME"],
        });

        client.connect(); // Connect to the channel

        client.on("message", (channel, tags, message, self) => { // Run each time a comment comes in
          
          

          let name = tags["display-name"]; // Commenter's Name

          if (round == 1 && message == "join") { // If its the first round let a player join the game
            players.push(name);
            boxes.unChosen.push(name); // Add them to the unChosen category
          }

          if (players.includes(name)) { // If they are in the game
            switch (message) { // Move them to the relevant box
              case "A":
                clearName(name);
                boxes.A.push(name);
                break;
              case "B":
                clearName(name);
                boxes.B.push(name);
                break;
              case "C":
                clearName(name);
                boxes.C.push(name);
                break;
              case "D":
                clearName(name);
                boxes.D.push(name);
                break;
            }
          }
        });
      }

      function draw() { // Runs 100 times per second (Based on FPS value in setup()) 
        clear(); // Clear Canvas
        noFill(); // Set pen to noFill
        stroke("green"); // Set stroke color
        strokeWeight(5); // Set Stroke width
        square(0, 50, screenDim); // Draw border around the relevant canvas

        // Draw two lines across border, making a 2x2 grid
        line(screenDim / 2, 50 + 0, screenDim / 2, 50 + screenDim);
        line(0, 50 + screenDim / 2, screenDim, 50 + screenDim / 2);

        noStroke(); // Remove border stroke
        fill("black"); // Set Fill Color
        textSize(32); // Set Text Size

        // Label each box
        text("A", screenDim / 4, 50 + screenDim / 4);
        text("B", (3 * screenDim) / 4, 50 + screenDim / 4);
        text("C", screenDim / 4, 50 + (3 * screenDim) / 4);
        text("D", (3 * screenDim) / 4, 50 + (3 * screenDim) / 4);

        // Draw each player name in the relevant box
        textSize(20); 
        boxes.unChosen.forEach((player, ind) => {
          text(player, screenDim + 10, 70 + ind * 20);
        });
        boxes.A.forEach((player, ind) => {
          text(player, screenDim / 4 - 50, 70 + ind * 20);
        });
        boxes.B.forEach((player, ind) => {
          text(player, (3 * screenDim) / 4 - 50, 70 + ind * 20);
        });
        boxes.C.forEach((player, ind) => {
          text(player, screenDim / 4 - 50, screenDim / 2 + 70 + ind * 20);
        });
        boxes.D.forEach((player, ind) => {
          text(player, (3 * screenDim) / 4 - 50, screenDim / 2 + 70 + ind * 20);
        });

        textSize(32);
        // Draw headers that says the round and time left
        text(
          "Round: " +
            round +
            ", Time to Choose: " +
            Math.round(timeLeft * 10) / 10,
          screenDim / 6,
          30
        );
        timeLeft -= 0.01; // Decrement the timeLeft variable


        text(mostRecentEliminated, screenDim / 6, screenDim + 100); // Show most recently eliminated box

        if (timeLeft <= 0) { // If time runs out

         
          boxes.unChosen.forEach((name) => { // Eliminate anyone who didn't choose a box
            players.splice(players.indexOf(name), 1);
          });

          let randInd = Math.floor(Math.random() * 4); // Pick a random box
          // Remove all Players in that box and adjust label
          switch (randInd) {
            case 0:
              boxes.A.forEach((name) => {
                players.splice(players.indexOf(name), 1);
              });
              mostRecentEliminated = "Box A was just eliminated";
              break;
            case 1:
              boxes.B.forEach((name) => {
                players.splice(players.indexOf(name), 1);
              });
              mostRecentEliminated = "Box B was just eliminated";
              break;
            case 2:
              boxes.C.forEach((name) => {
                players.splice(players.indexOf(name), 1);
              });
              mostRecentEliminated = "Box C was just eliminated";
              break;
            case 3:
              boxes.D.forEach((name) => {
                players.splice(players.indexOf(name), 1);
              });
              mostRecentEliminated = "Box D was just eliminated";
              break;
          }
          resetBoxes();

          if (players.length == 0) { // If everyone is eliminated
            // Reset rounds, timer, and label
            timeLeft = 15;
            round = 1;
            mostRecentEliminated = "Type Join To Enter The Game";
          }
        }
      }
    </script>
  </body>
</html>