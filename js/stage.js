if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Stage == 'undefined') {
   Mduel.Stage = {};
}

Mduel.Stage.image = new Image();
Mduel.Stage.image.src = 'img/playerSprite1.gif';

Mduel.Stage.stage = function(spec) {
   var that = {};
   
   that.data = Mduel.Stage.generateStage();
   
   that.draw = function(ctx, elapsed) {
      ctx.fillText('stage rendering ok', 5, 20);
   }
      
   return that;
}

Mduel.Stage.generateStage = function() {
   
   var toggle = Math.floor(Math.random()*2);

   // TODO
   
   return {};
}