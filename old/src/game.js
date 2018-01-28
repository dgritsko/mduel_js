if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Game == 'undefined') {
   Mduel.Game = {};
}

Mduel.Game.startGame = function() {

   Mduel.Game.debug = true;
   
   var canvas = document.getElementById('game');
   var ctx = canvas.getContext('2d');
   
   Mduel.Game.canvas = canvas;
   Mduel.Game.ctx = ctx;
   
   Mduel.Game.width = canvas.width;
   Mduel.Game.height = canvas.height;
      
   Mduel.Game.framerate = 30;
   
   Mduel.Game.lastFrameDrawn = new Date().valueOf();
   
   Mduel.Game.state = 'game';
   
   Mduel.Game.players = Mduel.Player.initializePlayers();
   Mduel.Game.pickups = Mduel.Pickups.pickups();
   Mduel.Game.stage = Mduel.Stage.stage();
   
   Mduel.Game.objects = [];
   Mduel.Game.objects.push(Mduel.Game.stage);
   Mduel.Game.objects.push(Mduel.Game.pickups);
   Mduel.Game.objects = Mduel.Game.objects.concat(Mduel.Game.players);

   window.onkeydown = Mduel.Keyboard.keyDown;
   window.onkeyup = Mduel.Keyboard.keyUp;

   setInterval(Mduel.Game.gameLoop, 1000 / Mduel.Game.framerate);
}

Mduel.Game.gameLoop = function() {
   var renderTime = new Date().valueOf();
   var elapsedTime = renderTime - Mduel.Game.lastFrameDrawn;
   Mduel.Game.lastFrameDrawn = renderTime;

   Mduel.Game.handleCollisions(elapsedTime);
   Mduel.Game.update(elapsedTime);
   Mduel.Game.draw(elapsedTime);
}


Mduel.Game.update = function(elapsedTime) {
   for (var i = 0, len = Mduel.Game.objects.length; i < len; i++) {
      Mduel.Game.objects[i].update(elapsedTime);
   }   
}

Mduel.Game.draw = function(elapsedTime) {
   Mduel.Game.ctx.clearRect(0, 0, Mduel.Game.width, Mduel.Game.height);

   if (Mduel.Game.state == 'game') {
      for (var i = 0, len = Mduel.Game.objects.length; i < len; i++) {
         Mduel.Game.objects[i].draw(Mduel.Game.ctx, elapsedTime);
      }
   }
   
   if (Mduel.Game.debug) {
       Mduel.Game.ctx.fillStyle = '#f00';
       Mduel.Game.ctx.font = 'arial 30px sans-serif';
       
       Mduel.Game.ctx.fillText(Mduel.Game.debugText || '', 5, 10);
   }
}

Mduel.Game.handleCollisions = function(elapsedTime) {
   for (var i = 0, len = Mduel.Game.players.length; i < len; i++) {
      var player = Mduel.Game.players[i];
    
      var pos = player.getPosition();
      
      // Handle collisions with left and right walls
      if (pos.x + 16 < 0 || pos.x + 48 > Mduel.Game.canvas.width) {
         player.flip = !player.flip;
         player.velocity.x = -1 * player.velocity.x;
      }
   }
}