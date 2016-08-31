"use strict";

var inputs = require("./input-names");


var state = {

  PLAYING: {
    _REWINDED_STEP: 0.5,
    _RATE_INCREMENT: 0.1,
    handleInput: function (player, input) {
      switch (input) {
        case inputs.STOP:
        {
          player.stop();
          player.state = state.STOPPED;
          break;
        }
        case inputs.PAUSE:
        {
          player.pause();
          player.state = state.PAUSED;
          break;
        }
        case inputs.FOREWARD:
        {
          player.stop();
          player.currentTime += state.PLAYING._REWINDED_STEP;
          player.play();
          break;
        }
        case inputs.REWINED:
        {
          player.stop();
          player.currentTime -= state.PLAYING._REWINDED_STEP;
          player.play();
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
          throw Error("Illegal input string in this state");
        }
      }
    },
    update: function (player) {
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
        default:
        {
          throw Error("Illegal input string in this state");
        }
      }
    },
    update: function (player) {
      player.notifyAll();
    }

  },
  STOPPED: {
    handleInput: function (player, input) {
      if (input === inputs.PLAY) {
        player.play();
        player.state = state.PLAYING;
      }
      else {
        throw Error("Illegal input string in this state");
      }
    },
    update: function (player) {
      player.notifyAll();
    }
  }
};

module.exports = state;