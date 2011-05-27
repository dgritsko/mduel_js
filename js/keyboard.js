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

Mduel.Keyboard.keyNames = {
      '37' : 'left',
      '38' : 'up',
      '39' : 'right',
      '40' : 'down',
      '65' : 'a',
      '83' : 's',
      '68' : 'd',
      '87' : 'w',
      '13' : 'enter',
      '73' : 'i',
      '74' : 'j',
      '75' : 'k',
      '76' : 'l',
      '85' : 'u'      
};

Mduel.Keyboard.getKeyName = function(keyCode) {
   var rval = null;
  
   if (Mduel.Keyboard.keyNames['' + keyCode]) {
      rval = Mduel.Keyboard.keyNames['' + keyCode];
   }
   
   return rval;
}