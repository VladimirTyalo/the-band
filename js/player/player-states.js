(function () {
  "use strict";

  var inputs = require("./input-names");
  var state  = {
    PLAYING: {
      _REWIND_STEP: 30,
      _RATE_INCREMENT: 0.1,
      handleInput: function (player, input) {
        switch (input) {
          case inputs.STOP:
          {
            player.pause();
            player.currentTime = 0.0;
            player.state       = state.STOPPED;
            break;
          }
          case inputs.PAUSE:
          {
            player.pause();
            player.state = state.PAUSED;
            break;
          }
          case inputs.FORWARD:
          {
            player.currentTime += state.PLAYING._REWIND_STEP;

            break;
          }
          case inputs.REWIND:
          {
            player.currentTime -= state.PLAYING._REWIND_STEP;
            break;
          }
          case inputs.SPEED_UP:
          {
            player.speedUp(state.PLAYING._RATE_INCREMENT);
            break;
          }
          case inputs.SPEED_DOWN:
          {
            player.speedDown(state.PLAYING._RATE_INCREMENT);
            break;
          }
          default:
          {
            return;
          }
        }
        state.PLAYING.update(player);
      },
      update: function (player) {
        player._currentTime = player._track.currentTime;
        player.playbackRate = player._track.playbackRate;
        player.notifyAll();
      }
    },
    PAUSED: {
      handleInput: function (player, input) {
        switch (input) {
          case inputs.PLAY :
          {
            player.play();
            player.state = state.PLAYING;

            break;
          }
          case inputs.STOP:
          {
            player.stop();
            player.state = state.STOPPED;
            break;
          }
          case inputs.REWIND:
          {
            player.currentTime -= state.PLAYING._REWIND_STEP;
            break;
          }
          case inputs.FORWARD:
          {
            player.currentTime += state.PLAYING._REWIND_STEP;

            break;
          }
          default:
          {
            return;
          }
        }
        state.PLAYING.update(player);
      },
      update: function (player) {
        player.notifyAll();
      }

    },
    STOPPED: {
      handleInput: function (player, input) {
        switch (input) {
          case inputs.PLAY :
          {
            player.play();
            player.state = state.PLAYING;
            break;
          }
          case inputs.REWIND:
          {
            player.currentTime -= state.PLAYING._REWIND_STEP;
            break;
          }
          case inputs.FORWARD:
          {
            player.currentTime += state.PLAYING._REWIND_STEP;

            break;
          }
          default:
            return;
        }
        state.PLAYING.update(player);
      },
      update: function (player) {
        player.notifyAll();
      }
    }
  };

  module.exports = state;
})();