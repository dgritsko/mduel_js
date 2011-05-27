if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Assets == 'undefined') {
   Mduel.Assets = {};
   Mduel.Assets.Sprites = {};
   Mduel.Assets.Animations = {};
}

Mduel.Assets.Sprites.player = Mduel.Spritesheet.spritesheet({
   width: 64,
   height: 64,
   sprites: [
      { name: 'stand', x:0, y: 0 },
      { name: 'run_1', x: 0, y: 1 },
      { name: 'run_2', x: 0, y: 2 },
      { name: 'run_3', x: 0, y: 3 },
      { name: 'run_4', x: 0, y: 4 },
      { name: 'crouched', x: 0, y: 5 },
      { name: 'crouching', x: 0, y: 6 },
      { name: 'roll_1', x: 0, y: 7 },
      { name: 'roll_2', x: 0, y: 8 },
      { name: 'roll_3', x: 0, y: 9 },
      { name: 'roll_4', x: 0, y: 10 },
   ]
});

Mduel.Assets.Sprites.pit = Mduel.Spritesheet.spritesheet({
   width: 32,
   height: 32,
   sprites: [
      { name: 'pit0', x: 0, y: 0 },
      { name: 'pit1', x: 0, y: 1 },
      { name: 'pit2', x: 0, y: 2 },
      { name: 'pit3', x: 0, y: 3 }
   ]
});

Mduel.Assets.Animations.pit = function(startFrame) {
   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'pit0', time: 2500 },
               { sprite: 'pit1', time: 2500 },
               { sprite: 'pit2', time: 2500 },
               { sprite: 'pit3', time: 2500 }
            ], 
            data: Mduel.Assets.Sprites.pit,
            startFrame: startFrame
         });

}

Mduel.Assets.Animations.stand = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'stand', time: 10000000 }
            ], 
            data: Mduel.Assets.Sprites.player
         });
}

Mduel.Assets.Animations.run = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'run_1', time: 75 },
               { sprite: 'run_2', time: 75 },
               { sprite: 'run_3', time: 75 },
               { sprite: 'run_4', time: 75 }
            ], 
            data: Mduel.Assets.Sprites.player
         });
}

Mduel.Assets.Animations.roll = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouching', time: 75 },
               { sprite: 'roll_1', time: 75 },
               { sprite: 'roll_2', time: 75 },
               { sprite: 'roll_3', time: 75 },
               { sprite: 'roll_4', time: 75 },
               { sprite: 'crouched', time: 10000 }
            ], 
            data: Mduel.Assets.Sprites.player
         });
}

Mduel.Assets.Animations.crouch = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouching', time: 75 },
               { sprite: 'crouched', time: 10000 }
            ], 
            data: Mduel.Assets.Sprites.player
         });
}