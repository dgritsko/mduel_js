$(document).ready(function() {
    var fullscreen = new URL(document.location).searchParams.get('fullscreen') === 'true';
  
    if (fullscreen) {
      $('#fullscreen a').hide();
      MarshmallowDuel.fullscreen = true;
    } else {
      $('#fullscreen a').click(function() {
        if (confirm('Restart game in fullscreen mode?')) {
          window.location.href = '?fullscreen=true';
        }
      });
    }
  });
  
  var game = new Phaser.Game(640, 400, Phaser.AUTO, 'game');
  
  game.state.add('Boot', MarshmallowDuel.Boot);
  game.state.add('Game', MarshmallowDuel.Game);
  game.state.start('Boot');