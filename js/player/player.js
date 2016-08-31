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









