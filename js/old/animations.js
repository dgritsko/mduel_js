if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Animations == 'undefined') {
   Mduel.Animations = {};
}

Mduel.Animations.pit = function(startFrame) {
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

Mduel.Animations.stand = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'stand', time: 10000000 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.run = function() {

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

Mduel.Animations.roll = function() {

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

Mduel.Animations.crouching = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouching', time: 75 },
               { sprite: 'crouched', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.crouch = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouched', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.uncrouching = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'crouched', time: 75 },
               { sprite: 'crouching', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.standJump = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'jump_2', time: 75 },
               { sprite: 'jump_3', time: 75 },
               { sprite: 'jump_4', time: 75 },
               { sprite: 'jump_5', time: 75 },
               { sprite: 'jump_6', time: 75 },
               { sprite: 'jump_7', time: 75 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.runJump = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'run_jump_1', time: 150 },
               { sprite: 'run_jump_2', time: 150 },
               { sprite: 'run_jump_3', time: 150 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.climbing = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'climb_1', time: 75 },
               { sprite: 'climb_2', time: 75 },
               { sprite: 'climb_3', time: 75 },
               { sprite: 'climb_4', time: 75 }
            ], 
            loop: true,
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.rope = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'climb_5', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}

Mduel.Animations.standFall = function() {

   return Mduel.Animation.animation({
            frames:
            [
               { sprite: 'stand_fall', time: 1 }
            ], 
            data: Mduel.Sprites.player
         });
}