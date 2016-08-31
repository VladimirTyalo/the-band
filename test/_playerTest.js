"use strict";

var Player = require("./../js/player/player").Player,
    states  = require("./../js/player/player-states"),
    PlayState = states.PlayState,
    StopState = states.StopState,
    PauseState = states.PauseState,
    assert = require("chai").assert,
    jsdom  = require("mocha-jsdom");


describe("Player api test", function () {

  var player;
  var trackList = [
    {currentTime: 0, src: "track1"},
    {currentTime: 0, src: "track2"},
    {currentTime: 0, src: "track3"}
  ];

  beforeEach(function () {
    player = new Player(trackList);
  });


  it("creates a Player object", function () {
    assert.isOk(player, "player is not initialized");
  });

  it("should create private variables with initial values", function () {
    assert.deepEqual(player._trackList, trackList);
    assert.deepEqual(player._audioTrack, trackList[0]);
    assert.deepEqual(player._currentTime, 0);
    assert.deepEqual(player._playBackRate, 1);
    assert.deepEqual(player.state === states.STOPPED, true);
  });

  it("test getters and setters", function () {
    var expected       = 10;
    player.currentTime = 10;
    assert.equal(player.currentTime, expected);

    player.audioTrack = "hello";
    assert.equal(player.audioTrack, "hello");
  });

  it("should reset initial player values   when changing trackList, new tracks currentTime should also be reset to 0", function () {
    var newTrackList    = [{currentTime: 10, src: "track0"}, {currentTime: 11, src: "track1"}];
    player.currentTime  = 123;
    player.audioTrack   = "old Track";
    player.state = states.STOPPED;
    player.trackList = newTrackList;

    assert.equal(player._trackList[0].currentTime, 0, "trackLIst current Time");
    assert.equal(player.currentTime, 0, "player current Time");
    assert.equal(player.audioTrack.src, newTrackList[0].src, "new initial audio src");
    assert.equal(player.state === states.STOPPED, true, "expected instanceof StropState");
  });

  it("speedUp()", function () {
    var delta    = 3;
    var expected = delta + 1;
    player.speedUp(delta);
    assert.equal(player._playBackRate, expected, "actual " + player._playBackRate + " expected: " + expected);

    var oldRate = player.playBackRate;
    player.speedUp(13);
    assert.equal(oldRate, oldRate, "if delta of rate more then 10 or less then 0 value is staying the same")

  });

  it("speedDown()", function () {
    var delta    = 3;
    var oldRate  = player.playBackRate;
    var expected = oldRate - delta;
    player.speedDown(delta);
    assert.equal(player.playBackRate, expected);

    delta    = 12;
    expected = player.playBackRate;
    player.speedDown(delta);
    assert.equal(player.playBackRate, expected, "if delta of rate more then 10 or less then 0 value is staying the same");
  });


});



