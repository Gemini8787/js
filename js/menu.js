"use strict";

let movedPiece = null;
let minY, minX, maxX, maxY;
let shiftX = 0;
let shiftY = 0;

const dragStart = event => {
    movedPiece = menu;
    minY = app.offsetTop;
    minX = app.offsetLeft;
    maxX = app.offsetLeft + app.offsetWidth - movedPiece.offsetWidth;
    maxY = app.offsetTop + app.offsetHeight - movedPiece.offsetHeight;
    shiftX = event.pageX - event.target.getBoundingClientRect().left - window.pageXOffset;
    shiftY = event.pageY - event.target.getBoundingClientRect().top - window.pageYOffset;
};

const dragMenu = ((x, y) => {
  if (movedPiece) {
    x = x - shiftX;
    y = y - shiftY;
    x = Math.min(x, maxX);
    y = Math.min(y, maxY);
    x = Math.max(x, minX);
    y = Math.max(y, minY);
    movedPiece.style.whiteSpace = "nowrap";
    movedPiece.style.left = x + "px";
    movedPiece.style.top = y + "px";
  }
});

drag.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", event => dragMenu(event.pageX, event.pageY));
drag.addEventListener("mouseup", event => movedPiece = null);
