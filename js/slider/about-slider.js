module.exports = (function (document, window, $) {
  "use strict";
// --- SLIDER ---
  var HIDDEN_CLASS = "visually-hidden";

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


// helper function to add active class to one of the list elements and
// remove from others and add inactive class to all elements except activateIndex element
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

});
