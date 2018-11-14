`use strict`;

const app = document.querySelector(".app");
const menu = document.querySelector(".menu");
const drag = document.querySelector(".drag");
const burger = document.querySelector(".burger");
const newLoad = document.querySelector(".new");
const comments = document.querySelector(".comments");
const commentsTools = document.querySelector(".comments-tools");
const commentsBtn = document.querySelector(".menu__toggle-bg");
const commentsOn = document.getElementById("comments-on");
const draw = document.querySelector(".draw");
const drawTools = document.querySelector(".draw-tools");
const share = document.querySelector(".share");
const shareTools = document.querySelector(".share-tools");
const image = document.querySelector(".current-image");
const commentsForm = document.querySelector(".comments__form");
const imageLoader = document.querySelector(".image-loader");
let response, connection, id;

burger.style.display = "none";
comments.style.display = "none";
draw.style.display = "none";
share.style.display = "none";
image.style.display = "none";

app.removeChild(document.querySelector(".comments__form"));

resetComment();

const imageWrap = document.createElement("div");
let mask = document.createElement("canvas");
let canvas = document.createElement("canvas");

imageWrap.className = "image-wrap";
mask.className = "mask";
canvas.className = "canvas";

app.appendChild(imageWrap);
imageWrap.appendChild(image);
imageWrap.appendChild(mask);
imageWrap.appendChild(canvas);

const commentForm = document.createElement("form");
const commentMarker = document.createElement("span");
const commentMarkerCheck = document.createElement("input");
const commentBody = document.createElement("div");
const comment = document.createElement("div");
const commentLoader = document.createElement("div");
const commentTime = document.createElement("p");
const commentMessage = document.createElement("p");
const loader = document.createElement("div");
const loaderSquare = document.createElement("span");
const commentInput = document.createElement("textarea");
const commentClose = document.createElement("input");
const commentSubmit = document.createElement("input");

commentForm.className = "comment__form";
commentMarker.className = "comments__marker";
commentMarkerCheck.className = "comments__marker-checkbox";
commentMarkerCheck.type = "checkbox";
commentMarkerCheck.checked = true;
commentBody.className = "comments__body";
comment.className = "comment";
commentTime.className = "comment__time";
commentMessage.className = "comment__message";
commentLoader.className = "comment";
commentLoader.classList.add("comment__loader");
loader.className = "loader";
commentInput.className = "comments__input";
commentInput.placeholder = "Напишите ответ...";
commentClose.className = "comments__close";
commentClose.type = "button";
commentClose.value = "Закрыть";
commentSubmit.className = "comments__submit";
commentSubmit.type = "submit";
commentSubmit.value = "Отправить";

app.appendChild(commentForm);
commentForm.appendChild(commentMarker);
commentForm.appendChild(commentMarkerCheck);
commentForm.appendChild(commentBody);
commentBody.appendChild(comment);
comment.appendChild(commentTime);
comment.appendChild(commentMessage);
commentBody.appendChild(commentLoader);
commentLoader.appendChild(loader);
loader.appendChild(loaderSquare);
loader.appendChild(loaderSquare.cloneNode());
loader.appendChild(loaderSquare.cloneNode());
loader.appendChild(loaderSquare.cloneNode());
loader.appendChild(loaderSquare.cloneNode());
commentBody.appendChild(commentInput);
commentBody.appendChild(commentClose);
commentBody.appendChild(commentSubmit);

commentForm.style.display = "none";
commentLoader.style.display = "none";

function onFilesDrop(event) {
	event.preventDefault();
	if (image.style.display == "none") {
		const imageTypeRegExp = /^image\/(jpeg|png)/;
		const file = event.dataTransfer.files[0];
		if (imageTypeRegExp.test(file.type)) {
			document.querySelector(".error").style.display = "none";
			sendFile(file);
		} else {
			document.querySelector(".error").style.display = "initial";
		}	
	} else {
		document.querySelector(".error").style.display = "initial";
		document.querySelector(".error__message").textContent 
		= 'Чтобы загрузить новое изображение, пожалуйста, воспользуйтесь пунктом "Загрузить новое" в меню';
	}		
}

newLoad.addEventListener("click", (event) => {
	document.querySelector(".error").style.display = "none";
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/jpeg, image/png";
	input.click();
	input.addEventListener("change", event => {
		const file = event.currentTarget.files[0];
		sendFile(file);
	});
});

app.addEventListener("drop", onFilesDrop);
app.addEventListener("dragover", event => event.preventDefault());

function resetComment() {
	const comments = app.querySelectorAll("[data-top]");
	for (const comment of comments) {
    	app.removeChild(comment);
	}	
}

function resetCanvas() {
	const resetMask = mask;
	const canvasContextReset = resetMask.getContext('2d');
    canvasContextReset.clearRect(0, 0, resetMask.width, resetMask.height);
	const resetImageDraw = canvas;
	const canvasContextResetImg = resetImageDraw.getContext('2d');
    canvasContextResetImg.clearRect(0, 0, resetImageDraw.width, resetImageDraw.height);
};

burger.addEventListener("click", () => {
	burger.style.display = "none";
	commentsTools.style.display = "none";
	drawTools.style.display = "none";
	shareTools.style.display = "none";
	newLoad.style.display = "inline-block";
	comments.style.display = "inline-block";
	draw.style.display = "inline-block";
	share.style.display = "inline-block";
});

comments.addEventListener("click", () => {
	newLoad.style.display = "none";
	draw.style.display = "none";
	share.style.display = "none";
	canvas.style.zIndex = 50;
	burger.style.display = "inline-block";
	commentsTools.style.display = "inline-block";
	mask.style.zIndex = 100;	
});

share.addEventListener("click", () => {
	if (shareTools.style.display == "inline-block") {
		share.style.display = "none";
		shareTools.style.display = "none";
		burger.style.display = "inline-block";
		comments.style.display = "inline-block";
		commentsTools.style.display = "inline-block";	
	} else {
		newLoad.style.display = "none";
		comments.style.display = "none";
		draw.style.display = "none";
		burger.style.display = "inline-block";
		shareTools.style.display = "inline-block";
	}
});

document.querySelector(".menu_copy").addEventListener("click", () => {
	const url = document.querySelector(".menu__url");
	url.select();
    document.execCommand("copy"); 
});
