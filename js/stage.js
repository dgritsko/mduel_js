if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Stage == 'undefined') {
   Mduel.Stage = {};
}

Mduel.Stage.platformImage = new Image();
Mduel.Stage.platformImage.src = 'img/main_platform.bmp';
Mduel.Stage.spawnImage = new Image();
Mduel.Stage.spawnImage.src = 'img/spawn_platform.bmp';
Mduel.Stage.powerupImage = new Image();
Mduel.Stage.powerupImage.src = 'img/powerup_spawn.png';
Mduel.Stage.ropeAnchorImage = new Image();
Mduel.Stage.ropeAnchorImage.src = 'img/rope_anchor.bmp';

Mduel.Stage.stage = function(spec) {
   var that = {};
   
   var stage = Mduel.Stage.generateStage();
   
   that.levels = stage.levels;
   that.ropes = stage.ropes;
   
   that.draw = function(ctx, elapsed) {
      
      // Right spawn
      ctx.save();   
      
      ctx.translate(Mduel.Game.width, (Mduel.Game.height / 2) - (Mduel.Stage.platformImage.width / 2));
      ctx.rotate(90 * (Math.PI / 180));
      ctx.drawImage(Mduel.Stage.powerupImage, 0, 0);
      
      ctx.restore();
      
      // Left spawn
      ctx.save();
      
      // 208 is a magic number -- need to figure out the right way to position this image
      ctx.translate(0, 208); //(Mduel.Game.height / 2) + (Mduel.Stage.platformImage.width / 2));
      ctx.rotate(270 * (Math.PI / 180));
      ctx.drawImage(Mduel.Stage.powerupImage, 0, 0);
      
      ctx.restore();
      
      // Top spawn
      ctx.drawImage(Mduel.Stage.powerupImage, (Mduel.Game.width / 2) - (Mduel.Stage.platformImage.width / 2), 0);
   
      // Platforms
      for (var i = 0, len = that.levels.length; i < len; i++) {
         var imageToDraw = that.levels[i].isSpawn ? Mduel.Stage.spawnImage : Mduel.Stage.platformImage;
      
         ctx.drawImage(imageToDraw, that.levels[i].x, that.levels[i].y);
      }
      
      // Ropes
      for (var i = 0, len = that.ropes.length; i < len; i++) {
         ctx.drawImage(Mduel.Stage.ropeAnchorImage, that.ropes[i].x, that.ropes[i].y);
      }
   }
      
   return that;
}

Mduel.Stage.generateStage = function() {

   var levels = [
      Mduel.Stage.generateTopLevel(),         
      Mduel.Stage.generateLevel(18),
      Mduel.Stage.generateLevel(18),
      Mduel.Stage.generateLevel(18)
   ];      
     
   var rval = new Array();
   
   var verticalSpacing = 64;
   var verticalOffset = 80;
      
   // Top and Random platforms
   for (var i = 0; i < levels.length; i++) {
      var currentLevel = levels[i];
          
      for (var j = 0; j < currentLevel.length; j++) {
         if (currentLevel[j]) {
            rval.push({ x: (j * 32) + 32, y: (i * verticalSpacing) + verticalOffset, isSpawn: false });
         }
      }
   }   
   
   // Left spawn platforms
   for (var ls = 0; ls < 4; ls++) {
      rval.push({ x: (32 * ls) + 48, y: (4 * verticalSpacing) + verticalOffset, isSpawn: true });
   }
   
   
   // Right spawn platforms
   for (var ls = 0; ls < 4; ls++) {
      rval.push({ x: (32 * (ls + 13)) + 48, y: (4 * verticalSpacing) + verticalOffset, isSpawn: true });
   }
   
   // Generate ropes
   var ropes = Mduel.Stage.generateRopes(levels, 18);
   
   return { levels: rval, ropes: ropes };
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
   
   var parts = new Array();
   var isPlatform = Math.floor(Math.random() * 2);
   
   var accum = function(l) { return l.width; }; 
   
   while (Mduel.Util.sum(parts, accum) < width) {
      var minWidth = isPlatform ? minPlatformWidth : minGapWidth;
      var maxWidth = isPlatform ? maxPlatformWidth : maxGapWidth;
      
      var newWidth = Math.floor(Math.random() * (maxWidth + 1 - minWidth)) + minWidth;
   
      parts.push({ width: newWidth, isPlatform: isPlatform });
      
      isPlatform = !isPlatform;
      
      var tempSum = Mduel.Util.sum(parts, accum);
      if (tempSum > width) {
         parts[parts.length - 1].width -= (tempSum - width);
         parts[parts.length - 1].isPlatform = false;
      }   
   }
   
   return Mduel.Stage.convertLevel(parts);
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

Mduel.Stage.generateRopes = function(levels, width) {
   var rval = new Array();
   
   // TODO   
   rval.push({ x: 120, y: 20 });
   
   return rval;
}