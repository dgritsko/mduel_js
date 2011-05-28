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

      // Update position      
      pos.x += that.velocity.x;
      pos.y += that.velocity.y;

      // Update location
      that.updateLocation();
      
      // TODO: Call update on the current state object
      
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
   
   that.updateLocation = function() {
      // Possible Values: air, pit, platform, rope
      if (that.location == 'platform') 
      {         
         if (that.isOnPlatform())
         {
         }
         else
         {
            that.location = 'air';
            that.velocity.y = Mduel.Player.Constants.maxFallSpeed;
         }         
      }
      else if (that.location == 'air') 
      {
         if (that.getPosition().y > 320) 
         {
            that.velocity.y = 0;
         }
      }
   }
   
   that.isOnPlatform = function() {
      var pos = that.getPosition();
      var x = pos.x + 32;
   
      var predX = function(p) {
         return x >= p.x && x <= (p.x + 32);
      };
   
      var columnPlatforms = Mduel.Util.where(Mduel.Game.stage.platforms, predX);
      
      var predY = function(p) {
         var diff = p.y - pos.y;
         return diff <= 56 && diff > 0;
      }
   
      var platform = Mduel.Util.where(columnPlatforms, predY);
      
      return platform.length > 0;
   };
   
   return that;
}

Mduel.Player.Constants = {
   runSpeed: 3,
   maxFallSpeed: 7.5
};