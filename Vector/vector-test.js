var canvas;
var ctx;

function init() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.background = "#000";
	ctx = canvas.getContext("2d");
}

function drawVector(x, y, Vec, style) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + Vec.x, y + Vec.y);
	ctx.closePath();
	ctx.strokeStyle = style;
	ctx.stroke();
}

function vectorTest() {
	init();

	let a = new Vector(200, 100);

	drawVector(canvas.width / 2, canvas.height / 2, a, "red");

	console.log(a.length());
	let b = a.setLength(500);
	console.log(b.length());

	console.log(a.getAngle(b));

	drawVector(canvas.width / 2, canvas.height / 2, a, "blue");
}

vectorTest();