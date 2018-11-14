'use strict';

const draw = document.querySelector('.menu__item.draw');
draw.addEventListener('click', showDrawing);

function setCanvasSize(el) {
    const img = document.querySelector('.current-image');
    el.width = img.width;
    el.height = img.height;
}

function checkColor() {
    const colors = document.querySelectorAll('.menu__color[type="radio"]');
    const color = Array.from(colors).find(btn => btn.checked);
    return color.dataset.color;
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let pastSimple = Date.now();
let presentCont;
let brush = 4;
let curves = [];
let drawing = false;
let needsRepaint = false;

function showDrawing() {
    HideCommentForm();
    app.appendChild(canvas);
    setCanvasSize(canvas);

    canvas.addEventListener('mousemove', onMouseMoveCanvas);
    canvas.addEventListener('mousedown', onMouseDownCanvas);
    canvas.addEventListener('mouseup', onMouseUpCanvas);
    canvas.addEventListener('mouseleave', onMouseLeaveCanvas);
}

function onMouseDownCanvas() {
    drawing = true;
    const curve = [];
    curve.push([event.offsetX, event.offsetY]);
    curves.push(curve);
    needsRepaint = true;
}

function onMouseMoveCanvas() {
    if (drawing) {
        curves[curves.length - 1].push([event.offsetX, event.offsetY]);
        needsRepaint = true;
    }
}

function onMouseUpCanvas() {
    drawing = false;
    presentCont = Date.now();
    if (presentCont - pastSimple < 2000) {
        return;
    }
    sendCanvas(canvas);
    curves = [];
    pastSimple = Date.now();
}

function onMouseLeaveCanvas() {
    drawing = false;
    ctx.stroke();
}

function rendering() {
    clearCanvas();
    curves.forEach(curve => {
        circle(curve[0]);
        smoothCurve(curve);
    });
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function circle(points) {
    ctx.beginPath();
    ctx.fillStyle = checkColor();
    ctx.arc(...points, brush / 2, 0, Math.PI * 2);
    ctx.fill();
}

function smoothCurve(points) {
    ctx.beginPath();
    ctx.lineWidth = brush;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.moveTo(...points[0]);
    ctx.globalCompositeOperation = "source-over";

    for (let i = 1; i < points.length - 1; i++) {
        smoothCurveBetween(points[i], points[i + 1]);
    }
    ctx.stroke();
}

function smoothCurveBetween(p1, p2) {
    ctx.lineWidth = brush;
    ctx.strokeStyle = checkColor();
    const cp = p1.map((coord, idx) => (coord + p2[idx]) / 2);
    ctx.quadraticCurveTo(...p1, ...cp);
}

function tick() {

    if (needsRepaint) {
        rendering();
        needsRepaint = false;
    }

    window.requestAnimationFrame(tick);
}

tick();

function sendCanvas(canvas) {
    createImgOverCanvas(canvas);
    canvas.toBlob(blob => socket.send(blob));
}

function createImgOverCanvas(canvas) {
    const imgOverCanvas = document.createElement('img');
    imgOverCanvas.src = canvas.toDataURL();
    setCanvasSize(imgOverCanvas);
    imgOverCanvas.classList.add('over-canvas');
    insertElement(imgOverCanvas);
}

function createImgMask(url) {
    const mask = document.createElement('img');
    setCanvasSize(mask);
    mask.src = url;
    mask.classList.add('image-mask');
    insertElement(mask);
}

function insertElement(el) {
    app.insertBefore(el, document.querySelector('.error'));
}
