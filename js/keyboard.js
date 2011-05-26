if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Keyboard == 'undefined') {
   Mduel.Keyboard = {};
}

Mduel.Keyboard.keyDown = function(e) {
   var keyName = Mduel.Keyboard.getKeyName(e.keyCode);
   if (keyName) {
      for (var i = 0, len = Mduel.Game.players.length; i < len; i++) {
         if (Mduel.Game.players[i].keyDown) {
            Mduel.Game.players[i].keyDown(keyName);
         }
      }
   }
}

Mduel.Keyboard.keyUp = function(e) {
   var keyName = Mduel.Keyboard.getKeyName(e.keyCode);
   if (keyName) {
      for (var i = 0, len = Mduel.Game.players.length; i < len; i++) {
         if (Mduel.Game.players[i].keyUp) {
            Mduel.Game.players[i].keyUp(keyName);
         }
      }
   }
}

Mduel.Keyboard.getKeyName = function(keyCode) {
   var rval = null;
      
   switch (keyCode)
   {
      case 37:
         rval = 'left';
         break;
      case 38:
         rval = 'up';
         break;
      case 39:
         rval = 'right';
         break;
      case 40: 
         rval = 'down';
         break;
      default:
         break;
   }
   
   return rval;
}