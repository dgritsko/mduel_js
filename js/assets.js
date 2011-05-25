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
      { name: 'run_4', x: 0, y: 4 }
   ]
});

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