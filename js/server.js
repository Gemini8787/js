`use strict`;

if (performance.navigation.type === 1 || window.location.href.indexOf("?id=") !== -1) {
    image.src = localStorage.getItem("saveImg");
    id = localStorage.getItem("saveId");
    image.style.display = "inline-block";
	burger.style.display = "inline-block";
    comments.style.display = "inline-block";
	commentsTools.style.display = "inline-block";
	newLoad.style.display = "none";
	
	document.querySelector(".menu__url").value = 
		window.location.protocol + "//" + window.location.host 
		+ window.location.pathname + "?id=" + id;

	setTimeout(function() {
		mask.width = image.clientWidth
		mask.height = image.clientHeight;
		document.querySelector(".comment__form").style.display = "none";
		const markers = document.querySelectorAll(".comments__marker-checkbox");
		for (const marker of markers) {
			marker.checked = false;
		}
	}, 2000);
	
	socketConnect();
	
};

function sendFile(file) {
	const formData = new FormData();
	formData.append("title", file.name);
	formData.append("image", file);

	const xhr = new XMLHttpRequest();
	xhr.open("POST", "https://neto-api.herokuapp.com/pic");

	xhr.addEventListener("loadstart", () => {
		image.style.display = "none";
		imageLoader.style.display = "initial";
	});

	xhr.addEventListener("loadend", () =>
		imageLoader.style.display = "none");

	xhr.addEventListener("load", () => {
		if (xhr.status === 200) {
			response = JSON.parse(xhr.responseText);
			console.log(response);
			id = response.id;
			newLoad.style.display = "none";
			comments.style.display = "none";
			draw.style.display = "none";
			burger.style.display = "inline-block";
			share.style.display = "inline-block";
			shareTools.style.display = "inline-block";
			document.querySelector(".menu__url").value = 
				window.location.protocol + "//" + window.location.host 
				+ window.location.pathname + "?id=" + id;

			setTimeout(function() {
				mask.width = image.clientWidth;
				mask.height = image.clientHeight;
				resetComment();
				resetCanvas();
			}, 2000);

			socketConnect();
			
		}
	});

	xhr.send(formData);
}

function socketConnect() {
	connection = new WebSocket
		(`wss://neto-api.herokuapp.com/pic/${id}`);

	connection.addEventListener("open", () => {
		console.log("Вебсокет-соединение открыто");
	});

	connection.addEventListener("message", event => {
		let message = JSON.parse(event.data);
		console.log(message);

		if (message.event == "pic") {
			localStorage.setItem("saveImg", message.pic.url);
			localStorage.setItem("saveId", message.pic.id);
			image.src = message.pic.url;
			image.style.display = "initial";

		    image.addEventListener("load", () => {
				if (message.pic.mask) {
					setTimeout(function() {
						placeMask(message.pic.mask);
					}, 1000);	
			    }
			    if (message.pic.comments) {
			    	const markers = document.querySelectorAll(".comments__marker-checkbox");
					for (const marker of markers) {
						marker.checked = false;
					}
			    	loadComments(message.pic.comments);
			    	
			    }
		    });
		}
		if (message.event == "comment") {
			renderComment(message.comment);
		}
		        
		if (message.event == "mask") {
			placeMask(message.url);
		}
	});

	connection.addEventListener("error", error => {
		console.log(`Произошла ошибка: ${error.message}`);
	});
}
