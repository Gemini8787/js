'use strict';

const wrap = document.querySelector('.wrap');
let menu = document.querySelector('.menu');
let drag;
let shiftX, shiftY;
const minX = wrap.offsetLeft;
const minY = wrap.offsetTop;
let maxX, maxY;

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

function onMouseDown() {
    if (event.target.classList.contains('drag')) {
        drag = event.target;


        let bounds = menu.getBoundingClientRect();

        shiftX = event.pageX - bounds.left - window.pageXOffset;
        shiftY = event.pageY - bounds.top - window.pageYOffset;

        maxX = minX + wrap.offsetWidth - menu.offsetWidth;
        maxY = minY + wrap.offsetHeight - menu.offsetHeight;
    }
}

function onMouseMove() {
    if (drag) {
        event.preventDefault();

        let x = event.pageX - shiftX;
        let y = event.pageY - shiftY;

        x = Math.min(x, maxX);
        y = Math.min(y, maxY);

        x = Math.max(x, minX);
        y = Math.max(y, minY);

        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        localStorage.menuLeft = menu.style.left;
        localStorage.menuTop = menu.style.top;
    }
}

function onMouseUp() {
    if (drag) {
        menu.style.visibility = 'hidden';
        let under = document.elementFromPoint(event.clientX, event.clientY).closest('.wrap');
        menu.style.visibility = '';

        if (under) {
            wrap.insertBefore(menu, wrap.children[0]);
            drag = null;
        }
    }
}

localStorageMenu();

function localStorageMenu() {
    if (localStorage.menuTop || localStorage.menuLeft) {
        menuPosition();
    }
}

function menuPosition() {

    const menuCorrect = document.querySelector('.menu').getBoundingClientRect();

    let coordX = parseInt(localStorage.menuLeft);
    let coordY = parseInt(localStorage.menuTop);

    const maxX = window.innerWidth - menuCorrect.width;
    const maxY = window.innerHeight - menuCorrect.height;

    coordX = Math.max(coordX, 0);
    coordY = Math.max(coordY, 0);

    menu.style.left = `${Math.min(coordX, maxX)}px`;
    menu.style.top = `${Math.min(coordY, maxY)}px`;

    localStorage.menuLeft = menu.style.left;
    localStorage.menuTop = menu.style.top;
}
