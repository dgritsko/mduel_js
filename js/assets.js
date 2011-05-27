if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Assets == 'undefined') {
   Mduel.Assets = {};
   Mduel.Assets.Animations = {};
}

Mduel.Assets.Animations.pit = function(startFrame) {
   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'pit0', time: 2500 },
               { sprite: 'pit1', time: 2500 },
               { sprite: 'pit2', time: 2500 },
               { sprite: 'pit3', time: 2500 }
            ], 
            data: Mduel.Sprites.pit,
            loop: true,
            startFrame: startFrame
         });

}

Mduel.Assets.Animations.stand = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'stand', time: 10000000 }
            ], 
            data: Mduel.Sprites.player
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
            loop: true,
            data: Mduel.Sprites.player
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
               { sprite: 'crouched', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Assets.Animations.crouch = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouching', time: 75 },
               { sprite: 'crouched', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Assets.Animations.crouched = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouched', time: 10000 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Assets.Animations.uncrouch = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouched', time: 75 },
               { sprite: 'crouching', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}