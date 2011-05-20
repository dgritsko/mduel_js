if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Stage == 'undefined') {
   Mduel.Stage = {};
}

Mduel.Stage.image = new Image();
Mduel.Stage.image.src = 'img/playerSprite1.gif';

Mduel.Stage.stage = function(spec) {
   var that = {};
   
   that.data = Mduel.Stage.generateStage();
   
   that.draw = function(ctx, elapsed) {
      ctx.fillText('stage rendering ok', 5, 20);
   }
      
   return that;
}

Mduel.Stage.generateStage = function(width) {
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
   
   
   // TODO: Finish conversion of algorithm to generate platforms
   
   var toggle = Math.floor(Math.random()*2);

   // TODO
   
   return {};
}