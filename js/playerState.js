if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.PlayerState == 'undefined') {
   Mduel.PlayerState = {};
}

Mduel.PlayerState.playerState = function(spec) {
   var that = {};
 
   that.player = spec.player;
 
   that.states = {
    stand : {
         animation: 'stand',
         keyUp : function(keyState) {
          
         },
         keyDown : function(keyState) {
            if (keyState.lastKey.name == 'left' && keyState.left.pressed && !keyState.right.pressed) {
               that.player.velocity.x = -that.player.constants.runSpeed;
               that.player.flip = true;
               that.setState('run');
            } 
            else if (keyState.lastKey.name == 'right' && keyState.right.pressed && !keyState.left.pressed) {
               that.player.velocity.x = that.player.constants.runSpeed;
               that.player.flip = false;
               that.setState('run');
            }
            else if (keyState.lastKey.name == 'down' && !keyState.right.pressed && !keyState.right.pressed) {
               if (that.player.isOnRope()) {
	          that.player.velocity.y = 1;
	          that.setState('climbing');
               }
               else {
                  that.setState('crouching');
               }
            }
            else if (keyState.lastKey.name == 'up' && !keyState.right.pressed && !keyState.right.pressed) {
               if (that.player.isOnRope()) {
                  that.player.velocity.y = -1;
                  that.setState('climbing');
               }
               else {
                  that.player.velocity.y = -10;
                  that.setState('standJump');
               }
            }
         }
      },
      run : {
         animation : 'run',
         keyUp : function(keyState) {
            if (!keyState.left.pressed && !keyState.right.pressed) {
               that.player.velocity.x = 0;
               that.setState('stand');
            }
            else if (!keyState.left.pressed && keyState.right.pressed) 
	    {
	       that.player.velocity.x = that.player.constants.runSpeed;
	       that.player.flip = false;
	    } 
	    else if (keyState.left.pressed && !keyState.right.pressed) 
	    {
	       that.player.velocity.x = -that.player.constants.runSpeed;
	       that.player.flip = true;
            }  
         },
         keyDown : function(keyState) {
            if (keyState.lastKey.name == 'down') {
               if (keyState.left.pressed || keyState.right.pressed) {
                  that.setState('roll');
               } 
               else {
                  that.setState('crouch');
               }
            }
            else if (keyState.lastKey.name == 'up') {
               that.player.velocity.y = -10;
               that.setState('runJump');
            }
         }      
      },
      standJump : {
         animation : 'roll', // TODO
         update : function(elapsed) {
            if (that.currentAnimation.isFinished()) {
               that.setState('stand');
               that.player.velocity.y = 0;
            }
            else if (!that.player.isOnPlatform()) {
               that.player.velocity.y += 0.1 * (elapsed / 1000);
            }
         }
      },
      runJump : {
         animation : 'roll', // TODO
         update : function(elapsed) {
            if (that.currentAnimation.isFinished()) {
               that.setState('run');
            }
            else if (!that.player.isOnPlatform()) {
               that.player.velocity.y += 2;
            }
         }
      },
      crouching : {
         animation : 'crouching',
         update : function(elapsed) {
            if (that.currentAnimation.isFinished()) {
               that.setState('crouch');
            }
         }
      },
      crouch : {
         animation : 'crouch',
         keyUp : function(keyState) {
            if (!keyState.down.pressed) {
               that.setState('uncrouching');
            }
         }
      },
      roll : {
         animation : 'roll',
         update : function(elapsed) {
            if (that.currentAnimation.isFinished()) {
               that.player.velocity.x = 0;
            }
         },
         keyUp : function(keyState) {
	    if (!keyState.down.pressed) {
	       that.setState('uncrouching');
	    }
         }
      },
      uncrouching : {
         animation : 'uncrouching',
         update : function(elapsed) {
            if (that.currentAnimation.isFinished()) {
               that.setState('stand');
            }
         }
      },
      climbing : {
         animation : 'roll',
         keyUp : function(keyState) {
            if (!keyState.up.pressed && !keyState.down.pressed) {
               that.player.velocity.y = 0;
               that.setState('rope');
            }
         },
         keyDown : function(keyState) {
         
         }
      },
      rope : {
         animation : 'stand',
         keyUp : function(keyState) {
         },
         keyDown : function(keyState) {
            if (keyState.lastKey.name == 'up') {
               that.player.velocity.y = -1;
               that.setState('climbing');            
            }
            else if (keyState.lastKey.name == 'down') {
               that.player.velocity.y = 1;
               that.setState('climbing');
            }
         }
      },
      ropeFall : {
         animation : 'stand'
      },
      fall : {
         animation : 'stand'
      },
      dead : {
         animation : 'stand'
      }
   };
    
   that.setState = function(state) {
      if (that.states[state]) {   
         that.currentState = that.states[state];
         that.currentAnimation = Mduel.Animations[that.currentState.animation]();
         
         if (Mduel.Game.debug) {
            Mduel.Game.debugText = 'State: ' + state;
         }
      }
      else {
         Mduel.Game.debugText = 'Player state not found: ' + state;
      }
   }
   
   that.update = function(elapsed) {
      if (that.currentState && that.currentState.update) {
         that.currentState.update(elapsed);
      }       
   }   
   
   that.setState('stand'); 
   
   return that;
 }