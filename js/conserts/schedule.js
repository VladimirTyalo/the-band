module.exports = (function () {
  "use strict";
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

})(window, document, require("../vendor/jquery-3.1.0"));

});