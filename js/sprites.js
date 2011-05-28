if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Sprites == 'undefined') {
   Mduel.Sprites = {};
}

Mduel.Sprites.player = Mduel.Spritesheet.spritesheet({
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
      { name: 'jump_1', x: 0, y: 11 },
      { name: 'jump_2', x: 0, y: 12 },
      { name: 'jump_3', x: 0, y: 13 },
      { name: 'jump_4', x: 0, y: 14 },
      { name: 'jump_5', x: 0, y: 15 },
      { name: 'jump_6', x: 0, y: 16 },
      { name: 'jump_7', x: 0, y: 17 },
      { name: 'run_jump_1', x: 0, y: 18 },
      { name: 'run_jump_2', x: 0, y: 19 },
      { name: 'run_jump_3', x: 0, y: 20 },
      { name: 'stand_fall', x: 0, y: 21 },
      { name: 'unknown_12', x: 0, y: 22 },
      { name: 'unknown_13', x: 0, y: 23 },
      { name: 'unknown_14', x: 0, y: 24 },
      { name: 'unknown_15', x: 0, y: 25 },
      { name: 'unknown_16', x: 0, y: 26 },
      { name: 'unknown_17', x: 0, y: 27 },
      { name: 'unknown_18', x: 0, y: 28 },
      { name: 'unknown_19', x: 0, y: 29 },
      { name: 'gun_shoot_1', x: 0, y: 30 },
      { name: 'gun_shoot_2', x: 0, y: 31 },
      { name: 'grenade_toss_1', x: 0, y: 32 },
      { name: 'grenade_toss_2', x: 0, y: 33 },
      { name: 'puck_toss_1', x: 0, y: 34 },
      { name: 'puck_toss_2', x: 0, y: 35 },
      { name: 'parachute', x: 0, y: 36 },
      { name: 'unknown_27', x: 0, y: 37 },
      { name: 'unknown_28', x: 0, y: 38 },
      { name: 'climb_1', x: 0, y: 39 },
      { name: 'climb_2', x: 0, y: 40 },
      { name: 'climb_3', x: 0, y: 41 },
      { name: 'climb_4', x: 0, y: 42 },
      { name: 'climb_5', x: 0, y: 43 },
      { name: 'stand_victory_1', x: 0, y: 44 },
      { name: 'stand_victory_2', x: 0, y: 45 },
      { name: 'rope_victory_1', x: 0, y: 46 },
      { name: 'rope_victory_2', x: 0, y: 47 },
      { name: 'disintegrate_1', x: 0, y: 48 },
      { name: 'disintegrate_2', x: 0, y: 49 },
      { name: 'disintegrate_3', x: 0, y: 50 },
      { name: 'disintegrate_4', x: 0, y: 51 },
      { name: 'disintegrate_5', x: 0, y: 52 },
      { name: 'disintegrate_6', x: 0, y: 53 },
      { name: 'vaporize_1', x: 0, y: 54 },
      { name: 'vaporize_2', x: 0, y: 55 },
      { name: 'vaporize_3', x: 0, y: 56 },
      { name: 'vaporize_4', x: 0, y: 57 },
      { name: 'taunt_1', x: 0, y: 58 },
      { name: 'taunt_2', x: 0, y: 59 },
      { name: 'taunt_3', x: 0, y: 60 },
      { name: 'taunt_4', x: 0, y: 61 },
      { name: 'flex_1', x: 0, y: 62 },
      { name: 'flex_2', x: 0, y: 63 },
      { name: 'magnet_1', x: 0, y: 64 },
      { name: 'magnet_2', x: 0, y: 65 },
      { name: 'empty', x: 0, y: 66 },
      { name: 'trapped', x: 0, y: 67 }
   ]
});

Mduel.Sprites.pit = Mduel.Spritesheet.spritesheet({
   width: 32,
   height: 32,
   sprites: [
      { name: 'pit0', x: 0, y: 0 },
      { name: 'pit1', x: 0, y: 1 },
      { name: 'pit2', x: 0, y: 2 },
      { name: 'pit3', x: 0, y: 3 }
   ]
});