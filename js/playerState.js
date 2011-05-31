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
            } else if (keyState.lastKey.name == 'right' && keyState.right.pressed && !keyState.left.pressed) {
               that.player.velocity.x = that.player.constants.runSpeed;
               that.player.flip = false;
               that.setState('run');
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
         animation : 'uncrouch',
         update : function(elapsed) {
            if (that.currentAnimation.isFinished()) {
               that.setState('stand');
            }
         }
      }
   };
    
   that.setState = function(state) {
      that.currentState = that.states[state];
      that.currentAnimation = Mduel.Animations[that.currentState.animation]();
   }
   
   that.update = function(elapsed) {
      if (that.currentState && that.currentState.update) {
         that.currentState.update(elapsed);
      }       
   }   
   
   that.setState('stand'); //that.currentState = that.states.stand;
 
   return that;
 }