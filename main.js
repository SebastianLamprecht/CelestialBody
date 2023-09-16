//const G = 0.0001;
const G = 6.6743015 * 10 ** -11;
const AU = 149597870.7;

var timeScale = 0.2;
var radiusScale = 20;
// So 1 AE = 200px
var KmPerPixel = AU / 400;

var canvas;
var ctx;

var animationRunning = true;

var Sun;

$(document).ready(function() {
	canvas = document.getElementById("main-canvas");

	this.animationRunning = true;

	CelestialBodyUI.init(canvas);

	Sun = new CelestialBody({"name" : "Sun", "mass" : 1.9885 * 10 ** 30, "density" : 1.408, "color" : "#fff", "x" : 0, "y" : 0});
	new CelestialBody({"name" : "Mercury", "mass" : 3.3011 * 10 ** 23, "density" : 5.427, "color" : "#666564"}).setOrbit(Sun, 0.387 * AU);
	new CelestialBody({"name" : "Venus", "mass" : 4.875 * 10 ** 24, "density" : 5.243, "color" : "#e8e1c0"}).setOrbit(Sun, 0.723 * AU);
	new CelestialBody({"name" : "Earth", "mass" : 5.9772 * 10 ** 24, "density" : 5.514, "color" : "#3b66cc"}).setOrbit(Sun, AU);
    new CelestialBody({"name" : "Mars", "mass" : 6.417 * 10 ** 23, "density" : 3.933, "color" : "#cc521e"}).setOrbit(Sun, 1.524 * AU);
	new CelestialBody({"name" : "Jupiter", "mass" : 1.899 * 10 ** 27, "density" : 15, "color" : "#f9e581"}).setOrbit(Sun, 5.204 * AU);

	CelestialBodyUI.tick();
});

function drawVector(x, y, Vec, style) {
	ctx.beginPath();
	ctx.moveTo(x / KmPerPixel, y / KmPerPixel);
	ctx.lineTo((x + Vec.x) / KmPerPixel, (y + Vec.y) / KmPerPixel);
	ctx.strokeStyle = style;
	ctx.closePath();
	ctx.stroke();
}

class CelestialBodyUI {

	static init(canvas) {
		this.canvas = canvas;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.background = "#000";
		this.c = canvas.getContext("2d");
		this.animationRunning = true;

		CelestialBody.prototype.render = this.render;
	}

	static tick() {
		CelestialBodyUI.c.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < CelestialBody.Bodies.length; i++) {
			CelestialBody.Bodies[i].tick();
		}

		if (CelestialBodyUI.animationRunning) window.requestAnimationFrame(CelestialBodyUI.tick);
	}

	static render() {
		var c = CelestialBodyUI.c;

		let x = (canvas.width / 2) + (this.x / KmPerPixel);
		let y = (canvas.height / 2) + (this.y / KmPerPixel);
		let r = Math.log10(1 + (radiusScale * this.radius / KmPerPixel)) * radiusScale;

		c.beginPath();
		c.arc(x, y, r, 0, Math.PI * 2, true);
		c.closePath();
		c.fillStyle = this.color;
		c.fill();

		if (this.highlighted) {
			// Show info
			c.font = "12px Consolas";
			c.fillText(this.name, x + 15, y + 4);
			c.fillStyle = "#fff";
			c.fillText(Math.round(this.Velocity.length()) + " km/s", x + 15, y + 20);
			c.fillText((new Vector(Sun.x - this.x, Sun.y - this.y).length() / AU).toFixed(5) + " AU", x + 15, y + 36);

			// Draw breadcrumbs
			c.beginPath();
			c.arc(x, y, r + 5, 0, Math.PI * 2, true);
			c.closePath();
			c.strokeStyle = "rgba(255, 255, 255, 0.5)";
			c.stroke();

			this.breadcrumbs.push({"x" : x, "y" : y});
			if (this.breadcrumbs.length > 1024)
				this.breadcrumbs.shift();

			c.beginPath();
			c.moveTo(this.breadcrumbs[0].x, this.breadcrumbs[0].y);
			for (let i = 1; i < this.breadcrumbs.length; i++) {
				c.lineTo(this.breadcrumbs[i].x, this.breadcrumbs[i].y);
			}
			//this.c.closePath();
			c.strokeStyle = "rgba(255, 255, 255, 0.3)";
			c.setLineDash([4, 2]);
			c.stroke();
		}
	}
}

class CelestialBody {
	static Bodies = [];

	constructor(params) {
		this.name = params.name;
		this.mass = params.mass;
		this.density = params.density;
		this.x = params.x == undefined ? 0 : params.x;
		this.y = params.y == undefined ? 0 : params.y;
		this.color = params.color;

		this.Acceleration = new Vector();
		this.Velocity = new Vector();
		this.highlighted = false;
		this.breadcrumbs = [];
		this.timestamp = Date.now();

		this.calculateSize();

		CelestialBody.Bodies.push(this);
	}

	calculateAcceleration() {
		var NetForce = new Vector();

		for (let i = 0; i < CelestialBody.Bodies.length; i++) {
			let B = CelestialBody.Bodies[i];

			if (B == this) continue;
			
			let Force = new Vector((B.x - this.x), (B.y - this.y));
			let f = G * (this.mass * B.mass / Math.pow(Force.length(), 2));
			
			//if (Force.length() <= this.radius + B.radius) this.handleCollision(B);

			Force.setLength(f);
			NetForce.add(Force);
		}

		// F = m * a
		this.Acceleration = NetForce.multiply(1/this.mass);
	}

	calculateVelocity() {
		let now = Date.now();
		//let timeDiff = now - this.timestamp;
		let timeDiff = 1;
		this.timestamp = Date.now();

		// Make it time dependant
		this.Acceleration.multiply(timeDiff * timeScale)
		this.Velocity.add(this.Acceleration);

		this.x += this.Velocity.x * timeDiff * timeScale;
		this.y += this.Velocity.y * timeDiff * timeScale;
	}

	calculateSize() {
		// V = 4/3 * pi * rpow3
		let volume = this.mass / (this.density * 1000);
		this.radius = Math.pow( (3 * volume) / (4 * Math.PI), 1/3 ) / 1000;
		this.radius = Math.round(this.radius);
	}

	handleCollision(Body) {
		console.log("Collision!");
		if (Body.mass <= this.mass) {
			let oldMass = this.mass;
			this.mass += Body.mass;
			this.density = (Body.mass / (this.mass + Body.mass) * Body.density) + (this.mass / (this.mass + Body.mass) * this.density);
			this.density = this.density * Math.sqrt(this.mass / oldMass);

			this.calculateSize();

		} else {
			// Body swallows this
		}

		// TODO: Calculate impact in speed
	}

	tick() {
		this.calculateAcceleration();
		this.calculateVelocity();
		this.render();
	}

	render() {}

	setOrbit(Body, r) {
		this.x = Body.x;
		this.y = Body.y - r;

		this.Velocity.x = Body.Velocity.x + Math.sqrt((G * (this.mass + Body.mass)) / r);
		this.Velocity.y = Body.Velocity.y;

		return this;
	}
}