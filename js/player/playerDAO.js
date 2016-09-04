(function () {
  "use strict";
  var states = require("./player-states");

  // Player DOM access object requires the html to have data-action attributes for controls
  // and classes ".player__ " to update current track info and styling elements
  function PlayerDAO(controls, album) {
    this._btnPlay         = controls.querySelector('[data-action="play"]');
    this._btnDragPosition = controls.querySelector("[data-action='drag']");
    this._progressPlayed  = controls.querySelector("[data-action='played']");
    this._progressBar     = controls.querySelector("[data-action='progress-bar']");
    this._playbackRate    = controls.querySelector("[data-value='playback-rate']");
    this._trackList       = album.querySelectorAll("[data-action='play']");
    this._trackListIcons  = album.querySelectorAll(".player__icon-play");

    this._albumInfo    = document.querySelector(".player__current-album");
    this._trackName    = document.querySelector(".player__current-title");
    this._trackNumber  = document.querySelector(".player__current-number");
    this._timeInfo     = document.querySelector(".player__current-time");
    this._durationInfo = document.querySelector(".player__duration");

    this._player;
    var self = this;

    init();

    this.subscribe = function (player) {
      this._player = player;
      player.addSubscriber(this);
    };

    this.unsibscribe = function () {
      self._player.removeSubscriber(this);
    };

    this.update = function update(player) {
      this._player = player;
      var state    = player.state;

      // to change icons from play to pause and vise versa;
      switch (state) {

        case states.PLAYING:
        {
          this._btnPlay.classList.remove("player__play");
          this._btnPlay.classList.add("player__pause");
          if (this._btnPlay.getAttribute("data-action") === "play") {
            this._btnPlay.setAttribute("data-action", "pause");
          }

          break;
        }
        case states.STOPPED:
        case states.PAUSED:
        {
          this._btnPlay.classList.remove("player__pause");
          this._btnPlay.classList.add("player__play");
          if (this._btnPlay.getAttribute("data-action") === "pause") {
            this._btnPlay.setAttribute("data-action", "play");
          }
          break;
        }
        default:
          throw new Error("illegal state");
      }

      if (this._progressBar && this._btnDragPosition) {
        var scale = getScale.call(this);
        updateProgressBar.call(this, scale);
      }

      updateCurentTimeInfo();
    };

    // adding event listeners to controls and player list elements
    function init() {

      // handling scrollbar
      controls.addEventListener("mousedown", function mouseDown(ev) {
        ev.preventDefault();

        var controlPanel = ev.target;
        if (controlPanel.getAttribute("data-action") !== "drag") return;

        controls.addEventListener("mousemove", function mouseMove(ev) {
          ev.preventDefault();

          // play previous track without moving progressBar
          self.unsibscribe();

          var x         = ev.clientX;
          var rect      = controls.getBoundingClientRect();
          var left      = x - rect.left;
          var btnRadius = self._btnDragPosition.offsetWidth / 2;

          // move dragging element according to x position of the mouse
          if (left > btnRadius && x < rect.right - btnRadius) {
            var currentX                     = left - btnRadius + "px";
            self._btnDragPosition.style.left = currentX;
            self._progressPlayed.style.width = self._btnDragPosition.getBoundingClientRect().left - rect.left + "px";
          }

          updateCurentTimeInfo();

          document.body.addEventListener("mouseup", function mouseUp(ev) {
            var scale = getScale();
            var left  = ev.clientX - rect.left;

            controls.removeEventListener("mousemove", mouseMove);

            self.subscribe(self._player);
            self._player.currentTime = left / scale;

            document.body.removeEventListener("mouseup", mouseUp);
          });
        });
      });


      controls.onclick = function (ev) {
        ev.preventDefault();
        var target = ev.target;
        var action = target.getAttribute("data-action");

        switch (action) {
          case "play":
          {
            target.setAttribute("data-action", "pause");
            break;
          }
          case "pause":
          {
            target.setAttribute("data-action", "play");
            break;
          }
          case undefined:
            return;
        }
        self._player.handleInput(action);
      };

      album.onclick = function (ev) {
        ev.preventDefault();
        var target = getAncestor(ev.target, function (el) {
          return !!el.getAttribute("data-action");
        });

        var action = target.getAttribute("data-action");
        if (!action) return;


        var number               = toArray(self._trackList).indexOf(target);
        self._player.trackNumber = number;
        switchActiveElement(self._trackListIcons, number, "player__icon-play--active", "");
        self._player.handleInput(action);

        // gather track info
        var albumTitle  = album.querySelector(".player__album-title").innerText;
        var trackName   = album.querySelectorAll(".player__song-title")[number].innerText;
        var trackNumber = toTwoDigitString(number + 1) + ". ";

        // update main track info
        self._albumInfo.innerText   = albumTitle;
        self._trackName.innerText   = trackName;
        self._trackNumber.innerText = trackNumber;
      };
    }


    function toTwoDigitString(number) {
      if (("" + number).length >= 2) return "" + number;
      return "0" + number;
    }

    function updateCurentTimeInfo() {
      if (self._timeInfo) self._timeInfo.innerText = compoundStringTime(self._player.currentTime);

      if (self._durationInfo) self._durationInfo.innerText = compoundStringTime(self._player.track.duration);
    }

    function compoundStringTime(timeSeconds) {
      var minutes = (+timeSeconds / 60).toFixed(0);
      var seconds = (+timeSeconds % 60).toFixed(0);
      return minutes + ":" + toTwoDigitString(seconds);
    }


    function getScale() {
      var width    = self._progressBar.offsetWidth - self._btnDragPosition.offsetWidth;
      var fullTime = self._player.track.duration;
      var scale    = width / fullTime;
      return scale;
    }

    function updateProgressBar(scale) {
      self._btnDragPosition.style.left = self._player.currentTime * scale + "px";
      self._progressPlayed.style.width = self._player.currentTime * scale + "px";
      self._playbackRate.innerText     = (self._player.playbackRate).toFixed(1) + "x";
    }

    // helper function to add active class to one of the list elements and remove   from others and add        inactive class to all elements except activageIndex element
    function switchActiveElement(elements, activateIndex, activeClass, inactiveClass) {
      toArray(elements).forEach(function (el, index) {
        // add active element class
        if (index === (+activateIndex)) {

          if (inactiveClass !== "") el.classList.remove(inactiveClass);
          if (activeClass !== "" && !el.classList.contains(activeClass)) {
            el.classList.add(activeClass);
          }
        }
        // remove inactive element class
        else {
          if (activeClass !== "") el.classList.remove(activeClass);
          if (inactiveClass !== "" && !el.classList.contains(inactiveClass)) {
            el.classList.add(inactiveClass);
          }
        }
      });
    }

    function toArray($elems) {
      return Array.prototype.slice.call($elems);
    }

    // find the ancestor of element  that match filter function criteria
    function getAncestor(elem, filter) {
      var currElem = elem;

      while (currElem !== document) {
        if (filter(currElem)) {
          return currElem;
        }
        currElem = currElem.parentElement;
      }
    }
  }

  module.exports = PlayerDAO;
})();