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
         }
      }   
   };
    
   that.currentState = that.states.stand;
 
   return that;
 }