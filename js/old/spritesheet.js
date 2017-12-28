if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Spritesheet == 'undefined') {
   Mduel.Spritesheet = {};
}

Mduel.Spritesheet.spritesheet = function(spec) {
   var that = {};
      
   that.sprites = spec.sprites;
   that.width = spec.width;
   that.height = spec.height;
   
   that.getOffset = function(spriteName) {
      for (var i = 0, len = that.sprites.length; i < len; i++) {
         var sprite = that.sprites[i];
         
         if (sprite.name == spriteName) {
            return {
               x: (sprite.x || 0),
               y: ((sprite.y || 0) * that.height),
               width: that.width,
               height: that.height               
            };
         }
      }
      
      return null;
   }
   
   return that;
}