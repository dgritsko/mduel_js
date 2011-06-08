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
               var rope = that.player.isOnRope();
            
               if (rope) {
                  var pos = that.player.getPosition();
                  pos.x = rope.ropeStart.x - 32;
               
	          that.player.velocity.y = that.player.constants.climbSpeed;
	          that.setState('climbing');
               }
               else {
                  that.setState('crouching');
               }
            }
            else if (keyState.lastKey.name == 'up' && !keyState.right.pressed && !keyState.right.pressed) {
               var rope = that.player.isOnRope();
               
               if (rope) {
                  var pos = that.player.getPosition();
                  pos.x = rope.ropeStart.x - 32;
               
                  that.player.velocity.y = -that.player.constants.climbSpeed;
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
         update : function(elapsed) {
            if (!that.player.isOnPlatform()) {
               that.setState('fall');
            }
         },
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
         animation : 'standJump',
         update : function(elapsed) {
            if (that.player.velocity.y < that.player.constants.maxFallSpeed) {
               that.player.velocity.y += 1;
            }

            if (that.player.velocity.y >= 0) {
               var platform = that.player.isOnPlatform();

               if (platform) {            
                  that.player.velocity.y = 0;
                  that.setState('stand');
               }
            }
         }
      },
      runJump : {
         animation : 'runJump',
         update : function(elapsed) {
            if (that.player.velocity.y < that.player.constants.maxFallSpeed) {
               that.player.velocity.y += 1;
            }

            if (that.player.velocity.y >= 0) {
               var platform = that.player.isOnPlatform();

               if (platform) {
                  that.player.velocity.y = 0;
               
                  var keyState = Mduel.Keyboard.playerKeyStates[that.player.id];
                  if (!keyState.right.pressed && !keyState.left.pressed) {
                     that.player.velocity.x = 0;
                     that.setState('stand');
                  }
                  else {
                     if ((keyState.right.pressed && !keyState.left.pressed && that.player.velocity.x < 0) ||
                         (keyState.left.pressed && !keyState.right.pressed && that.player.velocity.x > 0)) {
                        that.player.flip = !that.player.flip;
                        that.player.velocity.x = -1 * that.player.velocity.x;
                     }
                  
                     that.setState('run');
                  }
               }
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
            if (!that.player.isOnPlatform()) {
               that.setState('fall');
            }
            else if (that.currentAnimation.isFinished()) {
               that.player.velocity.x = 0;
               
               var keyState = Mduel.Keyboard.playerKeyStates[that.player.id];
               
               if (keyState.down.pressed) {
                  that.setState('crouch');
               }
               else {
                  that.setState('uncrouching');
               }
            }
         }
      },
      uncrouching : {
         animation : 'uncrouching',
         update : function(elapsed) {
            if (that.currentAnimation.isFinished()) {
               var keyState = Mduel.Keyboard.playerKeyStates[that.player.id];
            
               if (keyState.left.pressed && (!keyState.right.pressed || keyState.left.eventTime > keyState.right.eventTime)) {
                  that.player.flip = true;
                  that.player.velocity.x = -that.player.constants.runSpeed;
                  that.setState('run');
               }
               else if (keyState.right.pressed && (!keyState.left.pressed || keyState.right.eventTime > keyState.left.eventTime)) {
                  that.player.flip = false;
                  that.player.velocity.x = that.player.constants.runSpeed;
                  that.setState('run');
               }
               else {
                  that.setState('stand');
               }
            }
         }
      },
      climbing : {
         animation : 'climbing',
         keyUp : function(keyState) {
            if (!keyState.up.pressed && !keyState.down.pressed) {
               that.player.velocity.y = 0;
               that.setState('rope');
            }
         },
         keyDown : function(keyState) {
            if (keyState.lastKey.name == 'left') {
               that.player.velocity.x = -that.player.constants.runSpeed;               
               that.setState('fall');
            }
            else if (keyState.lastKey.name == 'right') {
               that.player.velocity.x = that.player.constants.runSpeed;               
               that.setState('fall');
            }
         }
      },
      rope : {
         animation : 'rope',
         keyUp : function(keyState) {
         },
         keyDown : function(keyState) {
            if (keyState.lastKey.name == 'up') {
               that.player.velocity.y = -that.player.constants.climbSpeed;
               that.setState('climbing');            
            }
            else if (keyState.lastKey.name == 'down') {
               that.player.velocity.y = that.player.constants.climbSpeed;
               that.setState('climbing');
            }
            else if (keyState.lastKey.name == 'left') {
               that.player.velocity.x = -that.player.constants.runSpeed;               
               that.setState('fall');
            }
            else if (keyState.lastKey.name == 'right') {
               that.player.velocity.x = that.player.constants.runSpeed;               
               that.setState('fall');
            }
         }
      },
      ropeFall : {
         animation : 'stand',
         update : function(elapsed) {
            if (that.player.velocity.y < that.player.constants.maxFallSpeed) {
               that.player.velocity.y += 1;
            }
            
            if (that.player.getPosition().y > 320) {
               that.player.velocity.y = 0;
            }
            else {
               var platform = that.player.isOnPlatform();
               if (platform) {
                  that.player.velocity.y = 0;
                  that.player.velocity.x = 0;
                  that.setState('stand');
               }
            }            
         }
      },
      fall : {
         animation : 'standFall',
         update : function(elapsed) {
            if (that.player.velocity.y < that.player.constants.maxFallSpeed) {
               that.player.velocity.y += 1;
            }
            
            if (that.player.getPosition().y > 320) {
               that.player.velocity.y = 0;
               that.player.velocity.x = 0;
            }
            else {
               var platform = that.player.isOnPlatform();
               if (platform) {
                  that.player.velocity.y = 0;
                  that.player.velocity.x = 0;
                  that.setState('stand');
               }
            }
         }
      },
      dead : {
         animation : 'empty'
      }
   };
    
   that.setState = function(state) {
      if (that.states[state]) {   
         that.currentState = that.states[state];
         that.currentAnimation = Mduel.Animations[that.currentState.animation]();
         
         if (Mduel.Game.debug) {
            console.log(state);
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