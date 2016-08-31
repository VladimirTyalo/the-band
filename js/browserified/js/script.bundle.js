(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var HIDDEN_CLASS = "visually-hidden";


// --- SLIDER ---
(function (window, document, $) {
alert("Hie");

  // gather '.about' slider elements
  var $members   = $(".about__member");
  var $arrowPrev = $(".about__prev");
  var $arrowNext = $(".about__next");
  var $slides    = $(".about__slide");


  var MEMBER_ACTIVE_CLASS = "about__member--active";
  var ATTR_DATA_SLIDE_TO  = "data-slide-to";

  $($arrowPrev).click(function (ev) {
    ev.preventDefault();

    var $activeMember = $("." + MEMBER_ACTIVE_CLASS);
    var activeIndex   = $activeMember.attr(ATTR_DATA_SLIDE_TO);
    var prevIndex     = +activeIndex - 1;

    if (prevIndex >= 0) {
      checkMember(prevIndex);
    }
  });


  $($arrowNext).click(function (ev) {
    ev.preventDefault();

    var $activeMember = $("." + MEMBER_ACTIVE_CLASS);
    var activeIndex   = $activeMember.attr(ATTR_DATA_SLIDE_TO);
    var nextIndex     = +activeIndex + 1;

    if (nextIndex < $members.length) {
      checkMember(nextIndex);
    }
  });


  $($members).click(function (ev) {
    // if there is next slide => hide current and show next
    ev.preventDefault();

    var $target = getAncestor(ev.target, function (el) {
      return !!el.getAttribute(ATTR_DATA_SLIDE_TO);
    });

    var slideNumber = $target.getAttribute(ATTR_DATA_SLIDE_TO);

    if (slideNumber !== undefined) {
      checkMember(slideNumber);
    }
  });


  function checkMember(slideNumber) {
    switchActiveElement($members, slideNumber, MEMBER_ACTIVE_CLASS, "");
    switchActiveElement($slides, slideNumber, "", HIDDEN_CLASS);
  }


})(window, document, window.jQuery);


// --- PLAYER ---
(function (window, document, $) {

  // document ready
  function initPlayerControls() {
    var full    = document.querySelector(".player__progress-future");
    var played  = document.querySelector(".player__progress-past");
    var current = document.querySelector(".player__progress-current");

    current.style.left = "0";
    played.style.width = "0";
    full.style.width   = "100%";
  }

  $(function () {

    var $player       = $(".player__controls");
    var $audioSourses = $(".player__song-src");
    var $songList     = $(".player__songs");
    var songSet       = $(".player__song");
    var $albumButtons = $(".player__icon-play");


    initPlayer();

    var $previousTrack = $songList[0].querySelector("audio");
    var isPlaying      = false;

    // handling song list
    $($songList).click(function (ev) {
      ev.preventDefault();

      var $target       = getAncestor(ev.target, function (el) {
        return el.classList.contains("player__song");
      });
      var $audioElement = $target.querySelector("audio");
      var activeIndex   = $target.getAttribute("data-track-number");
      var songLinks     = $songList.find("a");

      initPlayerControls();

      switchActiveElement(songLinks, activeIndex, "player__song-link--active", "");
      playSongHandler($audioElement);


      // update song info in player header
      var $songInfo = $(".player__song-info");
      var songTitle = $target.querySelector(".player__song-title").innerText;

      $songInfo.find(".player__current-title").text(songTitle);
      $songInfo.find(".player__current-number").text(formSongNumber(activeIndex));


      // update player controls play/pause button
      var playPauseButton = $player.find('[data-play="true"]');

      if (isPlaying) {
        playPauseButton[0].classList.remove("player__play");
        playPauseButton[0].classList.add("player__pause");
      }
      else {
        playPauseButton[0].classList.remove("player__pause");
        playPauseButton[0].classList.add("player__play");
      }

    });


    // if click on the same song => stop it and return,
    // if clicked on the other just stop previous
    function playSongHandler(audioElement) {
      if (isPlaying) {
        if (!!$previousTrack) {
          $previousTrack.pause();
          isPlaying = false;
        }
        if ($previousTrack === audioElement) return;
      }

      audioElement.play();

      isPlaying      = true;
      $previousTrack = audioElement;
    }


    var UPDATE_INTERVAL = 1000;


    // handling player controls
    $(".player__controls").click(function (ev) {
      ev.preventDefault();
      var target       = ev.target;
      var elementClass = target.classList[0];


      var songItem = getAncestor($previousTrack, function (el) {
        return el.classList.contains("player__song");
      });

      var songIndex = toArray(songSet).indexOf(songItem);

      var audio = songSet[songIndex].querySelector("audio");

      progressBarHandler();

      switch (elementClass) {
        case "player__rewind":
          rewindHandler();
          break;
        case "player__pause" :
          pauseHandler();
          break;
        case "player__play":
          playHandler();
          break;
        case "player__forward":
          // TODO
          forwardHandler();
          break;
        case "player__progress-past":
          // TODO
          break;
        case "player__progress-future":
          // TODO
          break;
        default:
          break;
      }


      function rewindHandler() {
        $previousTrack = audio;
        var full       = document.querySelector(".player__progress-future");
        var played     = document.querySelector(".player__progress-past");
        var current    = document.querySelector(".player__progress-current");
        var scale      = (Number.parseInt(full.offsetWidth) - Number.parseInt(current.offsetWidth)) / audio.duration;

        var TIME_SHIFT = 30;

        $previousTrack.currentTime -= TIME_SHIFT;
        var currTime = Date.now();
        updateInfo();

        function updateInfo() {
          current.style.left = (scale * $previousTrack.currentTime) + "px";
          played.style.width = (scale * $previousTrack.currentTime) + "px";
        }
      }


      function forwardHandler() {
        var audio = getAncestor(document.querySelector(".player__song-link--active"), function (el) {
          return el.classList.contains("player__song");
        }).querySelector("audio");

        var full    = document.querySelector(".player__progress-future");
        var played  = document.querySelector(".player__progress-past");
        var current = document.querySelector(".player__progress-current");
        var scale   = (Number.parseInt(full.offsetWidth) - Number.parseInt(current.offsetWidth)) / audio.duration;

        var TIME_SHIFT = 30;

        $previousTrack.currentTime += TIME_SHIFT;


        updateInfo();

        function updateInfo() {
          current.style.left = (scale * audio.currentTime) + "px";
          played.style.width = (scale * audio.currentTime) + "px";
        }
      }

      function pauseHandler() {
        target.classList.remove("player__pause");
        target.classList.add("player__play");
        playSongHandler(audio);
      }

      function playHandler() {
        target.classList.remove("player__play");
        target.classList.add("player__pause");
        playSongHandler(audio);
      }

    });

    // to prevent updating audio info before update interval ends
    var lastUpdated = Date.now();

    function progressBarHandler() {
      var audio   = $previousTrack;
      var full    = document.querySelector(".player__progress-future");
      var played  = document.querySelector(".player__progress-past");
      var current = document.querySelector(".player__progress-current");

      var scale = (Number.parseInt(full.offsetWidth) - Number.parseInt(current.offsetWidth)) / audio.duration;


      function updateInfo() {
        var currTime  = Date.now();
        if(currTime - lastUpdated < UPDATE_INTERVAL) return;
        current.style.left = (scale * $previousTrack.currentTime) + "px";
        played.style.width = (scale * $previousTrack.currentTime) + "px";
        lastUpdated  = currTime;
      }

      var handler = setTimeout(function tick() {
        updateInfo();
        if (!isPlaying) {
          clearInterval(handler);
        }
        handler = setTimeout(tick, UPDATE_INTERVAL);

      }, UPDATE_INTERVAL);
    }


    function initPlayer() {
      toArray($albumButtons).forEach(function (el) {
        el.classList.remove("player__icon-play--no-js");
      });

      toArray($audioSourses).forEach(function (el) {
        el.classList.add(HIDDEN_CLASS);
      });

      toArray(songSet).forEach(function (el, index) {
        el.setAttribute("data-track-number", index);
        if (index !== 0) el.querySelector("a").classList.remove("player__song-link--active");
      });
      initPlayerControls();
    }

  });

})(window, document, window.jQuery);

// --- SCHEDULE SLIDE ---
(function handleSchedule(window, document, $) {
  var $list = $(".schedule__list");
  var $next = $(".schedule__next");
  var $prev = $(".schedule__prev");
  var $item = $(".schedule__item");

  var x    = 0;
  var STEP = $item.get(0).offsetHeight;


  $($next).click(function (ev) {
    ev.preventDefault();
    var $schedule = $(".schedule");
    var width     = $schedule.get(0).offsetWidth;

    if (x > 0.8 * width) return;
    x += STEP;
    $list.css("transform", "translateY(" + x + "px)");
  });

  $($prev).click(function (ev) {
    ev.preventDefault();
    var $schedule = $(".schedule");
    var width     = $schedule.get(0).offsetWidth;

    if (x < -width * 0.8) return;
    x -= STEP;
    $list.css("transform", "translateY(" + x + "px)");
  });

})(window, document, window.jQuery);


function formSongNumber(number) {
  if ((+number + 1 + "").length === 1) {
    return "0" + (+number + 1) + ". ";
  }
  return +number + 1 + ". ";
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


// helper function to add active class to one of the list elements and remove from others and add inactive class to all elements except activageIndex element
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

},{}]},{},[1]);
