var PLAYER = {};
PLAYER.image = new Image();
PLAYER.image.src = 'img/playerSprite1.png';

var player = function(spec) {
   var that = {};
  
   that.velocity = { x: 0, y: 0 };

   that.location = 'platform';
   that.state = 'stand';  
   that.animation = Mduel.Assets.Animations.stand();
   that.flip = false;
  
   that.getPosition = function() {
      return spec.position;
   }
   
   that.draw = function(ctx, elapsed) {
      var pos = that.getPosition();
      var posNew = { x: pos.x, y: pos.y };
      
      that.animation.animate(elapsed);
      
      var frame = that.animation.getSprite();

      if (that.flip) {
         ctx.save();
                  
         posNew.x = -posNew.x - frame.width;
         
         ctx.transform(-1, 0, 0, 1, 0, 0);
      }      
      
      ctx.drawImage(PLAYER.image, 
         // Source X and Y coordinates
         frame.x, frame.y, 
         // Source Width and Height
         frame.width, frame.height, 
         // Destination X and Y coordinates
         posNew.x, posNew.y,
         // Destination Width and Height
         frame.width, frame.height);

      if (that.flip) {        
         ctx.restore();      
      }
   }
   
   that.update = function(elapsed) {
      var pos = that.getPosition();
      
      pos.x += that.velocity.x;
      pos.y += that.velocity.y;
            
   }
      
   that.keyUp = function(keyName) {
      if (keyName == 'left' || keyName == 'right') {
         that.velocity.x = 0;
         that.setState('stand');
      }
   }
      
   that.keyDown = function(keyName) {
      if (keyName == 'left') {
         that.velocity.x = -2.5;
         that.flip = true;
         that.setState('run');
      }
      if (keyName == 'right') {
         that.velocity.x = 2.5;   
         that.flip = false;
         that.setState('run');
      }
      if (keyName == 'up') {
         
      }
   }
      
   that.setState = function(state) {
      if (state != that.state) {   
         that.animation = Mduel.Assets.Animations[state]();
         that.state = state;
      }
   }
   
   return that;
}