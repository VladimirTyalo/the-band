(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports  = {
  STOP: "stop",
  PAUSE: "pause",
  PLAY: "play",
  REWINED: "rewinded",
  FOREWARD: "foreward",
  SPEED_UP: "speed-up",
  SPEED_DOWN: "speed-down"
};

},{}],2:[function(require,module,exports){
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
},{"./input-names":1}],3:[function(require,module,exports){
"use strict";
var state = require("./player-states"),
    input = require("./input-names");


// define Player class
function Player(trackList) {
  this._currentTime  = 0;
  this._playBackRate = 1;
  this._state        = state.STOPPED;
  this._trackList    = trackList;
  this._audioTrack   = trackList[0];
  this._subscribers = [];
}

Object.defineProperties(Player.prototype, {
  currentTime: {
    set: function (time) {
      this._currentTime = time;
    },
    get: function () {
      return this._currentTime;
    }
  },
  trackList: {
    set: function (list) {
      this._trackList = list;
      this._trackList.forEach(function (el) {
        el.currentTime = 0;
      });
      this._currentTime  = 0;
      this._audioTrack   = list[0];
      this._state        = state.STOPPED;
      this._playBackRate = 1;
      this.notifyAll();
    },
    get: function () {
      return this._trackList;
    }
  },
  playBackRate: {
    set: function (rate) {
      this._playBackRate = rate;
    },
    get: function () {
      return this._playBackRate;
    }
  },
  audioTrack: {
    set: function (track) {
      this._audioTrack = track;
    },
    get: function () {
      return this._audioTrack;
    }
  },
  state: {
    set: function (state) {
      this._state = state;
    },
    get: function () {
      return this._state;
    }
  },
  play: {
    value: function () {
      //this._audioTrack.play();
      console.log("I am playing");
    }
  },

  stop: {
    value: function () {
      //this._audioTrack.stop();
      this._currentTime = 0;
      console.log("I am stopped");
    }
  },
  pause: {
    value: function () {
      //this._audioTrack.pause();
      console.log("I am paused");
    }
  },
  speedUp: {
    value: function (delta) {
      if (this._playBackRate + delta <= 10 && delta >= 0) {
        this._playBackRate += delta;
      }
    }
  },
  speedDown: {
    value: function (delta) {
      if (this._playBackRate - delta >= -10 && delta >= 0) {
        this._playBackRate -= delta;
      }
    }
  },
  handleInput: {
    value: function (input) {
      this.state.handleInput(this, input);
    }
  },
  update: {
    value: function () {
      this.state.update(this);
    }
  },
  notifyAll: {
    value: function() {
      this._subscribers.forEach(function(el) {
        el.update(this);
      });
    }
  },
  addSubscriber: {
    value: function(item) {
      this._subscribers.push(item);
    }
  },
  removeSubscriber: {
    value: function(item){
      var index = this._subscribers.indexOf(item);
      this._subscribers.splice(index,1);
    }
  }

});

var pl = new Player([1,3,4]);

pl.update();

pl.play();




module.exports.Player = Player;










},{"./input-names":1,"./player-states":2}]},{},[3]);
