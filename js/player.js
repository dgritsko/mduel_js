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
   
   that.playerState = Mduel.PlayerState.playerState({ player: that });
   
   that.flip = spec.flip;
   that.spriteImage = spec.spriteImage;
   that.constants = Mduel.Player.Constants;
   
   that.getPosition = function() {
      return spec.position;
   }
   
   that.draw = function(ctx, elapsed) {
      var pos = that.getPosition();
      var posNew = { x: pos.x, y: pos.y };
      
      that.playerState.currentAnimation.animate(elapsed);
      
      var frame = that.playerState.currentAnimation.getSprite();

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
      
      that.playerState.update(elapsed);
   }
      
   that.keyUp = function(keyState) {
      if (that.playerState.currentState.keyUp) {
         that.playerState.currentState.keyUp(keyState);
      }   
   }
      
   that.keyDown = function(keyState) {
      if (that.playerState.currentState.keyDown) {
         that.playerState.currentState.keyDown(keyState);
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

Mduel.Player.initializePlayers = function() {
   var rval = [
      Mduel.Player.player({ 
      	position: { x: 32, y: 280 },
      	spriteImage: Mduel.Images.player1
     }),
     Mduel.Player.player({ 
           	position: { x: 544, y: 280 },
           	spriteImage: Mduel.Images.player2,
           	flip: true
     })
   ];
   
   return rval;
};

Mduel.Player.Constants = {
   runSpeed: 3,
   maxFallSpeed: 7.5
};