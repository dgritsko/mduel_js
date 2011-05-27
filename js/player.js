if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Player == 'undefined') {
   Mduel.Player = {};
}


Mduel.Player.player = function(spec) {
   var that = {};
  
   that.velocity = { x: 0, y: 0 };

   that.location = 'platform';
   that.state = 'stand';  
   that.animation = Mduel.Animations.stand();
   that.flip = spec.flip;
   that.spriteImage = spec.spriteImage;
   that.constants = Mduel.Player.Constants;
  
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
      
      ctx.drawImage(that.spriteImage, 
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
      
      if (that.animation.isFinished()) 
      {
         if (that.state == 'uncrouch')
         {
            that.setState('stand');
         }
      }
   }
      
   that.keyUp = function(keyState) {
      if (!keyState.left.pressed && !keyState.right.pressed) 
      {
         that.velocity.x = 0;
         
         if (keyState.lastKey.name == 'down') 
         {
	    if ((that.state == 'roll' || that.state == 'crouch' || that.state == 'crouched') && that.animation.isFinished()) 
	    {
	       that.setState('uncrouch');
	    }
         } 
         else 
         {
            that.setState('stand');
         }
      } 
      else if (!keyState.left.pressed && keyState.right.pressed) 
      {
         that.velocity.x = that.constants.runSpeed;
         that.flip = false;
      } 
      else if (keyState.left.pressed && !keyState.right.pressed) 
      {
         that.velocity.x = -that.constants.runSpeed;
         that.flip = true;
      }      
   }
      
   that.keyDown = function(keyState) {
      if (keyState.lastKey.name == 'left' && keyState.left.pressed && !keyState.right.pressed) {
         that.velocity.x = -that.constants.runSpeed;
         that.flip = true;
         that.setState('run');
      } else if (keyState.lastKey.name == 'right' && keyState.right.pressed && !keyState.left.pressed) {
         that.velocity.x = that.constants.runSpeed;
         that.flip = false;
         that.setState('run');
      } else if (keyState.lastKey.name == 'down') {
         if (keyState.left.pressed || keyState.right.pressed) {
            that.setState('roll');
         } else {
            that.setState('crouch');
         }
         
         if (that.animation.finished) {
            that.velocity.x = 0;
         }
         
      } else if (keyState.up.pressed) {
         
      }
   }
      
   that.setState = function(state) {
      if (state != that.state) {   
         that.animation = Mduel.Animations[state]();
         that.state = state;
      }
   }
   
   return that;
}

Mduel.Player.Constants = {
   runSpeed: 2.5
};