var PLAYER = {};
PLAYER.image = new Image();
PLAYER.image.src = 'img/playerSprite1.png';

var player = function(spec) {
   var that = {};

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
   
   that.processInput = function(keyboard) {
      var pos = that.getPosition();
      
      if (keyboard.up) {
         pos.y -= 1;
      }
      
      if (keyboard.down) {
         pos.y += 1;
      }
      
      if (keyboard.left) {
         pos.x -= 1;
         
         
         if (that.state == 'stand') {
           that.setState('run');
           that.flip = true;
         }
      }
      else if (that.state != 'stand' && !keyboard.right) {
         that.setState('stand');
      }
      
      if (keyboard.right) {
         pos.x += 1;
         
         if (that.state == 'stand') {
            that.setState('run');
            that.flip = false;
         }
      }
      else if (that.state != 'stand' && !keyboard.left) {
         that.setState('stand');
      }      
   }
   
   that.setState = function(state) {
      that.animation = Mduel.Assets.Animations[state]();
      that.state = state;
   }
   
   return that;
}