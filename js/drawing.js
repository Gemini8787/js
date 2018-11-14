`use strict`;

draw.addEventListener("click", () => {
	newLoad.style.display = "none";
	comments.style.display = "none";
	share.style.display = "none";
	mask.style.zIndex = 50;
	burger.style.display = "inline-block";
	drawTools.style.display = "inline-block";
	canvas.style.zIndex = 100;

	canvas.width = image.width;
	canvas.height = image.height;
		
	const ctx = canvas.getContext("2d");
	const brush = 4;
	let color = "#6cbe47";
	let curves = [];
	let drawing = false;
	let needsRepaint = false;

	document.querySelector(".red").addEventListener("click", () =>
		color = "#ea5d56");
	document.querySelector(".yellow").addEventListener("click", () =>
		color = "#f3d135");
	document.querySelector(".green").addEventListener("click", () =>
		color = "#6cbe47");
	document.querySelector(".blue").addEventListener("click", () =>
		color = "#53a7f5");
	document.querySelector(".purple").addEventListener("click", () =>
		color = "#b36ade");

	function smoothCurveBetween (p1, p2) {
	    const cp = p1.map((coord, index) => (coord + p2[index]) / 2);
	    ctx.quadraticCurveTo(...p1, ...cp);
	}

	function smoothCurve(points) {
	    ctx.beginPath();
	    ctx.lineWidth = brush;
	    ctx.strokeStyle = color;
	    ctx.lineJoin = "round";
	    ctx.lineCap = "round";
	  
	    ctx.moveTo(...points[0]);
		for(let i = 1; i < points.length - 1; i++) {
			smoothCurveBetween(points[i], points[i + 1]);
		}

	    ctx.stroke();
	}

	canvas.addEventListener("mousedown", (event) => { 
		if (drawTools.style.display == "inline-block") {
			drawing = true;
	  		const curve = [];
			curve.push([event.offsetX, event.offsetY]);
			curves.push(curve);
			needsRepaint = true;
		}  
	});

	canvas.addEventListener("mouseup", (event) => {
	    curves = [];
	    drawing = false;

		let canv = canvas;
		let imageData = canv.toDataURL("image/png");
		let byteArray = convertDataURIToBinary(imageData);
		connection.send(byteArray.buffer);

		function convertDataURIToBinary(dataURI) {
			const marker = ';base64,';
			let markerIndex = dataURI.indexOf(marker) + marker.length;
			let base64 = dataURI.substring(markerIndex);
			let raw = window.atob(base64);
			let rawLength = raw.length;
			let byteArray = new Uint8Array(new ArrayBuffer(rawLength));

			for(let i = 0; i < rawLength; i++) {
			  byteArray[i] = raw.charCodeAt(i);
			};

			return byteArray;
		};
	});

	canvas.addEventListener("mouseleave", (event) => {
	    curves = [];
	    drawing = false;
	});

	canvas.addEventListener("mousemove", (event) => {
	    if (drawing) {
	      const point = [event.offsetX, event.offsetY];
	      curves[curves.length - 1].push(point);
	      needsRepaint = true;
	    }
	});

	function repaint () {
	    curves.forEach((curve) => smoothCurve(curve));
	}

	function tick () {
	    if(needsRepaint) {
	      repaint();
	      needsRepaint = false;
	    }
	    window.requestAnimationFrame(tick);
	}

	tick();

});

function placeMask(url) {
	const maskLayer = mask;
    maskLayer.width = image.width;
    maskLayer.height = image.height;
	const context = maskLayer.getContext("2d");
    context.clearRect(0, 0, maskLayer.width, maskLayer.height); 
	let img = new Image;

	img.addEventListener("load", () => { 
    	context.drawImage(img, 0, 0); 
	});
	img.src = url;
};
