<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Scam chat</title>
  <meta name="description" content="Scam chat">
  <meta name="author" content="Scam chat">

  <meta property="og:title" content="Scam chat">
  <meta property="og:type" content="website">
  <meta property="og:url" content="">
  <meta property="og:description" content="A simple Scam chat">
  <meta property="og:image" content="">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <link rel="icon" type="image/png" href="/scam-is-real/favicon.png">
</head>
  <body class="vsc-initialized">

<div class="chat">
  <div class="messages-box clearfix" id="messages-box">
    <div class="message me">
      <i class="fa fa-close">x</i>
      <p>test</p>
    </div>
    <div class="message user">
      <i class="fa fa-close">x</i>
      <p>test réponse</p>
    </div>
    <div class="message me">
      <i class="fa fa-close">x</i>
      <p>test</p>
    </div>
    <div class="message me">
      <i class="fa fa-close">x</i>
      <p>test</p>
    </div>
  </div>
  
  <div class="create-massage">
    <form>
        <input type="text" placeholder="type message">
        <button type="submit"><i class="fa fa-send">Go</i></button>
    </form>
   </div><!-- / .create-massage -->
  
</div><!-- /.chat -->

<div class="message-icon">
  <i class="fa fa-comments"></i>
</div>

<script>
$(document).ready(function(){
  
  $('.message-icon').click(function(){
    $('.chat').fadeToggle(500);
  });
  
  // for nicescroll
  // $('.messages-box').niceScroll({
  //   cursorcolor:'#5290F5',
  //   cursoropacitymin:0.7,
  //   cursorborder:'none',
  //   cursorborderradius: "3px",
  //   scrollspeed: 400,
  //   background: "#ddd",
  //   railoffset: {left: 7},
  //   cursorwidth :'4px'
  // });
  
  // form submit
  $('form').submit(function(e){
    e.preventDefault();
    var $messagesBox = $( ".messages-box" ),
        messagesBoxHeight = $messagesBox[0].scrollHeight,
        message = $('input', this).val(),
        messageLength = message.length;
        
        if(messageLength > 0){
          $('input', this).removeClass('error');
          $messagesBox.append('<div class="message"><i class="fa fa-close"></i> <p>' + message +'</p></div>');
        }else{
          $('input', this).addClass('error');
        }
        
        $('input',this).val('');
        $('input',this).focus();
    
     // scroll to see last message
     $messagesBox.scrollTop( messagesBoxHeight );
    
  });  // form
  
  // delete massage
  $(document).on('click', '.fa-close', function(){ 
     $(this).parent().fadeOut(500,function(){
      $(this).remove();
      });
   }); 
  
  // mouse enter add class
  $(document).on('mouseenter', '.fa-close', function(){
    $(this).parent().addClass('active');
  });
  
  // mouse leave remove class
  $(document).on('mouseleave', '.fa-close', function(){
    $(this).parent().removeClass('active');
  });
  
});  // document ready

</script>
<style>
body {
  background-color: #EEE;
}

.chat {
  width: 300px;
  position: fixed;
  right: 10px;
  background: #fff;
  padding: 10px;
  bottom: 90px;
  display: none;
  box-shadow: 0px 0px 10px 5px #ddd;
}
.chat .messages-box {
  margin-top: 10px;
  max-height: 300px;
  transition: all 0.3s linear;
}
.chat .messages-box .message {
  padding: 5px 10px;
  margin-bottom: 2px;
  background-color: #5290F5;
  color: #fff;
  position: relative;
  border-radius: 10px 0 0 10px;
  width: 80%;
  float: right;
  transition: all 0.3s linear;
}
.chat .messages-box .message.user {
  float: left;
  border-radius: 0 10px 10px 0;
}
.chat .messages-box .message.user:last-child {
  border-radius: 0px 10px 0px 0px;
}
.chat .messages-box .message:first-child {
  border-radius: 10px 10px 0px 10px;
}
.chat .messages-box .message:last-child {
  border-radius: 10px 0px 10px 10px;
}
.chat .messages-box .message.active {
  background-color: #F37660;
}
.chat .messages-box .message p {
  margin: 0 10px 0 0;
}
.chat .messages-box .message .fa {
  position: absolute;
  top: 5px;
  right: 7px;
  cursor: pointer;
  font-size: 12px;
  transform: scale(0.5);
  opacity: 0;
  transition: all 0.3s linear;
}
.chat .messages-box .message:hover .fa {
  transform: scale(1);
  opacity: 1;
}
.chat form {
  padding: 10px;
  margin: -10px;
  margin-top: 20px;
  background-color: #fff;
}
.chat form input {
  padding: 7px 10px;
  font-size: 15px;
  width: 87%;
  border: 1px solid #ddd;
  color: #9A9797;
  font-weight: 300;
}
.chat form input:focus {
  outline: inherit;
}
.chat form input.error {
  border: 1px solid rgba(255, 0, 0, 0.5);
}
.chat form button {
  border: none;
  background-color: transparent;
  font-size: 18px;
  color: #4085F6;
  cursor: pointer;
}
.chat form button:focus {
  outline: inherit;
}

.message-icon {
  width: 40px;
  height: 40px;
  background: #4085F6;
  line-height: 40px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  border-radius: 50%;
  position: fixed;
  bottom: 30px;
  right: 30px;
  cursor: pointer;
}
</style>

</body>
</html>