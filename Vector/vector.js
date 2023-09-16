class Vector {
	constructor(x, y) {
		this.x = x == undefined ? 0 : x;
		this.y = y == undefined ? 0 : y;

		return this;
	}

	add(Vec) {
		this.x += Vec.x;
		this.y += Vec.y;

		return this;
	}

	subtract(Vec) {
		this.x -= Vec.x;
		this.y -= Vec.y;

		return this;
	}

	multiply(num) {
		this.x *= num;
		this.y *= num;

		return this;
	}

	dotProduct(Vec) {
		return this.x * Vec.x + this.y + Vec.y;
	}

	// TODO: Implement
	crossProduct(Vec) {

	}

	// TODO: Implement
	getAngle(Vec) {
		return Math.acos(this.dotProduct(Vec) / (this.length() * Vec.length()));
	}

	normalize() {
		let l = this.length();

		this.x = this.x / l;
		this.y = this.y / l;

		return this;
	}

	length() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	toPolar() {
		// TODO: implement angle
		return VectorP(this.length(), 0);
	}

	setLength(num) {
		let l = this.length();
		this.x = (this.x * num) / l;
		this.y = (this.y * num) / l;

		return this;
	}
}

class VectorP extends Vector {
	constructor(r, a) {
		this.r = r == undefined ? 0 : r;
		this.a = a == undefined ? 0 : a;

		return this;
	}


	// TODO: implement
	add(Vec) {
		
		return this;
	}

	// TODO: implement
	subtract(Vec) {
		this.x -= Vec.x;
		this.y -= Vec.y;

		return this;
	}

	multiply(num) {
		this.r *= num;

		return this;
	}

	// TODO: Implement
	dotProduct(Vec) {
		
	}

	// TODO: Implement
	crossProduct(Vec) {

	}

	// TODO: Implement
	getAngle(Vec) {

	}

	normalize() {
		this.r = 1;

		return this;
	}

	setLength(num) {
		this.r = num;

		return this;
	}
}