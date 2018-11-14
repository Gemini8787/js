"use strict";

mask.addEventListener("click", event => {
	if (commentsTools.style.display == "inline-block" && commentsOn.checked) {		
		const markers = document.querySelectorAll(".comments__marker-checkbox");
		for (const marker of markers) {
			marker.checked = false;
		}

		commentForm.style.top = `${event.clientY -14}px`;
		commentForm.style.left = `${event.clientX - 22}px`;
		commentForm.style.display = "initial";
		commentForm.querySelector(".comment__loader").style.display = "none";
		commentForm.querySelector(".comments__marker-checkbox").checked = true;
		commentForm.querySelector(".comments__input").focus();
		commentForm.style.zIndex = 100;

		commentForm.querySelector(".comments__close")
		.addEventListener("click", event => {
			commentForm.querySelector(".comments__marker-checkbox").checked = false;
		});
	}
});

app.addEventListener("submit", event => {
	event.preventDefault();
	event.target.querySelector(".comment__loader").style.display = "initial";
	event.target.querySelector(".comments__marker-checkbox").checked = true;
	
	const input = event.target.querySelector(".comments__input");
	const comment = {"message" : input.value, "left" : parseInt(event.target.style.left), "top" : parseInt(event.target.style.top)};                                               
	
	sendComment(comment); 
	
});

function sendComment(comment) {
	commentForm.reset();
	let requestArray = [];
	for (let property in comment) {
		let encodedKey = encodeURIComponent(property);
		let encodedValue = encodeURIComponent(comment[property]);
		requestArray.push(encodedKey + '=' + encodedValue);
	};
	requestArray = requestArray.join('&');
	const request = new XMLHttpRequest();
	request.addEventListener('error', () => console.log(request.responseText));
	request.addEventListener('load', () => {
		if (request.status === 200) {
	    	let response = JSON.parse(request.responseText);
		}
	});
	request.open('POST', `https://neto-api.herokuapp.com/pic/${id}/comments`, true);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	request.send(requestArray);
	console.log(requestArray);
};

function loadComments(comments) {
	for (let comment in comments) {
    	let currentComment = {message: comments[comment].message,
        left: comments[comment].left,
        top: comments[comment].top};                  
    	renderComment(currentComment);
  }
};

function renderComment(comment) {
	const currentFormNode = document.querySelector(`.comment__form[data-left="${comment.left}"][data-top="${comment.top}"]`);
	if (currentFormNode) { 
    	currentFormNode.querySelector(".comment__loader").style.display = "none";	
    	renderNewCommentElement(currentFormNode, comment);
	} else {
    	placeComment(comment);
	}; 
};

function placeComment(comment) {
	const commentsFormSimple = commentForm;
	const commentEl = commentsFormSimple.cloneNode(true);
	commentEl.style.display = "initial";
    commentEl.style.top = `${comment.top}px`;
    commentEl.style.left = `${comment.left}px`;
    commentEl.dataset.top = comment.top;
    commentEl.dataset.left = comment.left;
	commentEl.querySelector(".comment__loader").style.display = "none";		
	commentEl.querySelector(".comments__marker-checkbox").checked = true;

	let date = new Date();
	let time = `${("0" + date.getHours()).slice(-2)}:${("0" 
		+ date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
	const commentDateTime = commentEl.querySelector(".comment__time");
    commentDateTime.textContent = time;
	const commentMessage = commentEl.querySelector(".comment__message");
    commentMessage.setAttribute("style", "white-space: pre;");
    commentMessage.textContent = comment.message;

	const closeBtn = commentEl.querySelector(".comments__close");
    closeBtn.addEventListener("click", () => {
    	commentEl.querySelector(".comments__marker-checkbox").checked = false;
    });
	
	app.appendChild(commentEl);
	showCommentForm();
};

function renderNewCommentElement(currentFormNode, comment) {
	const currentFormNodeCommentsBody = currentFormNode.querySelector(".comments__body");
	const currentFormNodeLoader = currentFormNode.querySelector(".comment__loader");
	const commentsFormSimple = currentFormNodeCommentsBody.querySelector(".comment");
	const commentEl = commentsFormSimple.cloneNode(true);
	let date = new Date();
	let time = `${("0" + date.getHours()).slice(-2)}:${("0" 
		+ date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`; 
	const commentDateTime = commentEl.querySelector(".comment__time");
    commentDateTime.textContent = time;
	const commentMessage = commentEl.querySelector(".comment__message");
    commentMessage.setAttribute("style", "white-space: pre;");
    commentMessage.textContent = comment.message;
    currentFormNodeCommentsBody.insertBefore(commentEl, currentFormNodeLoader);
	currentFormNode.reset();
	currentFormNode.querySelector(".comments__marker-checkbox").checked = true;
	currentFormNode.querySelector(".comments__input").focus();
	showCommentForm();
};

commentsBtn.addEventListener("click", showCommentForm);

function showCommentForm() {
	const commentsForm = document.querySelectorAll("[data-top]");
	for (const commentForm of commentsForm) {
		if (commentsOn.checked) {
			commentForm.style.display = "block";
		} else {
			commentForm.style.display = "none";
		}
	}
};
