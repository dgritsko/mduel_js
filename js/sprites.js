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