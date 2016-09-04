(function (document, window, $) {
  "use strict";
  var Player       = require("./player/player").Player;
  var PlayerDAO    = require("./player/playerDAO");
  var HIDDEN_CLASS = "visually-hidden";
  var schedule     = require("./conserts/schedule");
  var slider = require("./slider/about-slider");


  var albumButtons = document.querySelectorAll(".player__icon-play");
  var audioSources = document.querySelectorAll(".player__song-src");
  var songSet      = document.querySelectorAll(".player__song");


  slider(document, window, $);
  schedule(document, window, $);

  // remove no-js classes, hide audio elements, set some data attributes
  initPlayer();


  // set up player and it's view representation to work as subject(Player) and subscriber(DAO - DOM access object)
  var controls  = document.querySelector(".player__controls");
  var playList  = document.querySelector(".player__album");
  var audioList = playList.querySelectorAll("audio");
  var player    = new Player(audioList);
  var trackList = document.querySelector(".player__album");

  var playerDao = new PlayerDAO(controls, trackList);
  playerDao.subscribe(player);


  function initPlayer() {


    toArray(albumButtons).forEach(function (el) {
      el.classList.remove("player__icon-play--no-js");
    });

    toArray(audioSources).forEach(function (el) {
      el.classList.add(HIDDEN_CLASS);
    });

    toArray(songSet).forEach(function (el, index) {
      el.setAttribute("data-track-number", index);
      if (index !== 0) el.querySelector("a").classList.remove("player__song-link--active");
    });
  }

  function toArray($elems) {
    return Array.prototype.slice.call($elems);
  }


})(document, window, require("./vendor/jquery-3.1.0.js"));