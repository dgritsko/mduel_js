if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Animation == 'undefined') {
   Mduel.Animation = {};
}

Mduel.Animation.animation = function(spec) {
   var that = {};      
        
   that.frames = spec.frames;
   that.sprites = spec.data;
   
   that.frameDuration = spec.frames[0].time;   
   that.frameIndex = spec.startFrame || 0;
   
   that.animate = function(deltaTime) {
      that.frameDuration -= deltaTime;
            
      if (that.frameDuration <= 0) {
                 
         that.frameIndex++;
        
         if (that.frameIndex == that.frames.length) {
            that.frameIndex = 0;
         }
    
         that.frameDuration = that.frames[that.frameIndex].time;
      }
   }
   
   // Return the sprite for the current frame
   that.getSprite = function() {
      return that.sprites.getOffset(that.frames[that.frameIndex].sprite);
   }
   
   return that;
}