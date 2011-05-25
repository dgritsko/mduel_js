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
      
   Mduel.Game.players = [
      player({ 
      	position: { x: 32, y: 280 }
     })
   ];
   
   Mduel.Game.stage = Mduel.Stage.stage();

   window.onkeydown = Mduel.Keyboard.keyDown;
   window.onkeyup = Mduel.Keyboard.keyUp;

   setInterval(Mduel.Game.gameLoop, 1000 / Mduel.Game.framerate);
}

Mduel.Game.gameLoop = function() {
   Mduel.Game.update();
   Mduel.Game.draw();
}


Mduel.Game.update = function() {
   for (var i = 0, len = Mduel.Game.players.length; i < len; i++) {
      Mduel.Game.players[i].processInput(Mduel.Keyboard.KeyStates);
   }
}

Mduel.Game.draw = function() {
   Mduel.Game.ctx.clearRect(0, 0, Mduel.Game.width, Mduel.Game.height);

   var renderTime = new Date().valueOf();
   var elapsedTime = renderTime - Mduel.Game.lastFrameDrawn;
   Mduel.Game.lastFrameDrawn = renderTime;
   
   // Stage
   Mduel.Game.stage.draw(Mduel.Game.ctx, elapsedTime);
   
   // Players
   for (var i = 0, len = Mduel.Game.players.length; i < len; i++) {
        Mduel.Game.players[i].draw(Mduel.Game.ctx, elapsedTime);
   }
  
   if (Mduel.Game.debug) {
       Mduel.Game.ctx.fillStyle = '#f00';
       Mduel.Game.ctx.font = 'arial 30px sans-serif';
       
       Mduel.Game.ctx.fillText(Mduel.Game.debugText || '', 5, 10);
   }
}