(function () {
  "use strict";
  var state = require("./player-states"),
      input = require("./input-names");


// define Player class
  function Player(trackList) {
    this._currentTime  = 0;
    this._state        = state.STOPPED;
    this._trackList    = trackList;
    this._track        = trackList[0];
    this._trackNumber  = 0;
    this._subscribers  = [];
    this._playbackRate = this._track.playbackRate || 1;

    var timerHandler;
    var UPDATE_INTERVAL = 50; //  ms
    var MAX_RATE        = 3;
    var MIN_RATE        = 0.5;
    var self            = this;


    Object.defineProperties(Player.prototype, {
      currentTime: {
        set: function (time) {
          // set time within bounds
          if (time < 0) {
            this._currentTime       = 0;
            this._track.currentTime = 0;
          } else if (time > this._track.duration) {
            this._currentTime       = this._track.duration;
            this._track.currentTime = this._track.duration;
          } else {
            /*jshint bitwise: false*/
            this._currentTime       = 0 | time; // drops part after decimal
            this._track.currentTime = 0 | time;
          }
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
          this._track        = list[0];
          this._state        = state.STOPPED;
          this._playbackRate = 1;
          this._trackNumber  = 0;
          this.notifyAll();
        },
        get: function () {
          return this._trackList;
        }
      },
      playbackRate: {
        set: function (rate) {
          this._playbackRate       = rate;
          this._track.playbackRate = rate;
        },
        get: function () {
          return this._playbackRate;
        }
      },
      track: {
        set: function (track) {
          this._track       = track;
          this._trackNumber = this._trackList.indexOf(track);
        },
        get: function () {
          return this._track;
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
          this._track.play();
          timerHandler = setInterval(function () {
            self.update();
          }, UPDATE_INTERVAL);

        }
      },

      stop: {
        value: function () {
          this._track.stop();
          this._currentTime = 0;
          clearInterval(timerHandler);
        }
      },
      trackNumber: {

        set: function (number) {
          if (number < 0 || number >= this._trackList.length) return;
          this._track.pause();
          this._state      = state.PAUSED;
          this.currentTime = 0;
          var playRate     = this._playbackRate;

          this._trackNumber = number;
          this._track       = this._trackList[number];
          this.playbackRate = playRate;
          self.notifyAll();

        },
        get: function () {
          return this._trackNumber;
        }
      },
      pause: {
        value: function () {
          this._track.pause();
          clearInterval(timerHandler);
        }
      },
      speedUp: {
        value: function (delta) {

          if (self.playbackRate < MAX_RATE - delta) {
            self.playbackRate += delta;
          }
        }
      },
      speedDown: {
        value: function (delta) {
          if (self.playbackRate > MIN_RATE + delta) {
            this.playbackRate -= delta;
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
          this.state.update(self);
        }
      },
      notifyAll: {
        value: function () {
          this._subscribers.forEach(function (el) {
            el.update(self);
          });
        }
      },
      addSubscriber: {
        value: function (item) {
          if (this._subscribers.indexOf(item) >= 0) return;
          this._subscribers.push(item);
        }
      },
      removeSubscriber: {
        value: function (item) {
          var index = this._subscribers.indexOf(item);
          this._subscribers.splice(index, 1);
        }
      }

    });
  }

  module.exports.Player = Player;


})();






