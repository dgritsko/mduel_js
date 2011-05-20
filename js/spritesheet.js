if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Spritesheet == 'undefined') {
   Mduel.Spritesheet = {};
}

Mduel.Spritesheet.spritesheet = function(spec) {
   var that = {};
      
   _sprites = spec.sprites;
   _width = spec.width;
   _height = spec.height;
   
   that.getOffset = function(spriteName) {
      for (var i = 0, len = _sprites.length; i < len; i++) {
         var sprite = _sprites[i];
         
         if (sprite.name == spriteName) {
            return {
               x: (sprite.x || 0),
               y: (i * _height) + (sprite.y || 0),  
               width: _width,
               height: _height               
            };
         }
      }
      
      return null;
   }
   
   return that;
}