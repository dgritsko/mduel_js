if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Keyboard == 'undefined') {
   Mduel.Keyboard = {};
   Mduel.Keyboard.KeyStates = {};
}

Mduel.Keyboard.keyDown = function(e) {
   Mduel.Keyboard.KeyStates[Mduel.Keyboard.getKeyName(e.keyCode)] = true;
}

Mduel.Keyboard.keyUp = function(e) {
   Mduel.Keyboard.KeyStates[Mduel.Keyboard.getKeyName(e.keyCode)] = false;
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