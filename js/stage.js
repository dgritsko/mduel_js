if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Stage == 'undefined') {
   Mduel.Stage = {};
}

Mduel.Stage.platformImage = new Image();
Mduel.Stage.platformImage.src = 'img/main_platform.bmp';

Mduel.Stage.stage = function(spec) {
   var that = {};
   
   that.levels =
      [
         Mduel.Stage.generateTopLevel(),         
         Mduel.Stage.generateLevel(18),
         Mduel.Stage.generateLevel(18),
         Mduel.Stage.generateLevel(18),
      ];
   
   that.draw = function(ctx, elapsed) {
      for (var i = 0; i < that.levels.length; i++) {
         var currentLevel = that.levels[i];
          
         for (var j = 0; j < currentLevel.length; j++) {
            if (currentLevel[j]) {
               ctx.drawImage(Mduel.Stage.platformImage, j * 32, (i * 48) + 100);
            }
         }
      }
   }
      
   return that;
}

Mduel.Stage.generateTopLevel = function() {
   var level = new Array();
   
   level[0] = { width: 2, isPlatform: false };
   level[1] = { width: 4, isPlatform: true };
   level[2] = { width: 6, isPlatform: false };
   level[3] = { width: 4, isPlatform: true };
   level[4] = { width: 2, isPlatform: false };
   
   return Mduel.Stage.convertLevel(level);
}

Mduel.Stage.generateLevel = function(width) {
   var maxPlatformWidth = 7;
   var minPlatformWidth = 2;
   var maxGapWidth = 2;
   var minGapWidth = 1;
   
   // Min 2, Max 4
   var numPlatforms = Math.floor(Math.random() * 3) + 2;
   
   var level = new Array();
   
   for (var i = 0; i < numPlatforms; i++)
   {
      // Gap
      var gapWidth = Math.floor(Math.random() * (maxGapWidth + 1 - minGapWidth)) + minGapWidth;
      level.push({ width: gapWidth, isPlatform: false });

      // Level
      var platformWidth = Math.floor(Math.random() * (maxPlatformWidth + 1 - minPlatformWidth)) + minPlatformWidth;
      level.push({ width: platformWidth, isPlatform: true });
   }
   
   var lastGapWidth = Math.floor(Math.random() * (maxGapWidth + 1 - minGapWidth)) + minGapWidth;
   level.push({ width: lastGapWidth, isPlatform: false });
   
   var accum = function(l) { return l.width; };   
   
   while (Mduel.Util.sum(level, accum) < width) {
      var index = Math.floor(Math.random() * level.length);
      
      if (level[index].isPlatform) {
         level[index].width += 1;
      }
   }      
   
   while (Mduel.Util.sum(level, accum) > width) {
      var index = Math.floor(Math.random() * level.length);
      
      if (level[index].isPlatform) {
         level[index].width -= 1;
      }
   }
   
   return Mduel.Stage.convertLevel(level);
}

Mduel.Stage.convertLevel = function(rawLevel) {
   var rval = new Array();
   
   for (var i = 0, len = rawLevel.length; i < len; i++) {
      for (var j = 0, currWidth = rawLevel[i].width; j < currWidth; j++) {
         rval.push(rawLevel[i].isPlatform);
      }
   }
   
   return rval;
}