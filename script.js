const canvas = document.querySelector('#canv');
const ctx = canvas.getContext('2d');
let point = {
	x: 0,
	y: 0
};

var getCoordinates = function (evt) {
	point.x = evt.offsetX;
	point.y = evt.offsetY;
};

var system = {
	currentTool : '',
	currentColor : document.querySelector('#color').value,
	brushSize : 10
};

var renderSystem = function (obj, elem, action) { 
	obj[elem] = action;
};

var switchTool = function (el) {
	if (el.id === 'pencil') {
		return 'pencil'
	} else if (el.id === 'dots') {
		return 'dots'
	} else if (el.id === 'spray') {
		return 'spray'
	} else if (el.id === 'sets') {
		return 'sets'
	} else if (el.id === 'perspective'){
		return 'perspective';
	}
	return 'eraser';
};

var switchSize = function (list) {
	return list.value
};

var switchColor = function () {
	return document.getElementById('color').value;
};

var clicker = function (evt) {
	if (evt.target.classList.contains('toolButton')) {
		switchTool(evt.target);
		renderSystem (system, 'currentTool', switchTool (evt.target));
	} else if (evt.target.id === 'sizeSelect') {
		renderSystem (system, 'brushSize', switchSize (evt.target));
	} else if (evt.target.id === 'color') {
		window.oninput = function oninputColor() {
			renderSystem(system, 'currentColor', switchColor());
		};
	}
};

var startDraw = function () {
	ctx.strokeStyle = system.currentColor;
	ctx.fillStyle = system.currentColor;

	switch (system.currentTool) {
		case 'pencil':
			pencil();
			break;
		case 'dots':
			dots();
			break;
		case 'spray':
			spray();
			break;
		case 'sets':
			sets();
			break;
		case 'perspective':
			perspective();
			break;
		default:
			eraser();
	}
};

var endDraw = function () {
	ctx.restore();
	canvas.onmousemove = null;
};

var pencil = function () {
	ctx.globalAlpha = 0.08;
	ctx.lineWidth = system.brushSize;
	ctx.beginPath();

	canvas.onmousemove = function () {
		ctx.lineTo(point.x, point.y);
		ctx.stroke ();
	};
	ctx.closePath();
};

var dots = function () {
	canvas.onmousemove = function () {
		ctx.beginPath();
		for (let i = 0; i < 1; i+=0.2) {
			ctx.globalAlpha = 1 - i;
			ctx.arc(point.x, point.y, (0.6 + i)/2 * system.brushSize, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.stroke();
		}
		ctx.closePath();
	};
};

function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

var spray = function () {
	canvas.onmousemove = function () {
		for (let i = 0; i < 1; i+=0.2) {
			ctx.globalAlpha = 1 - i;
			dot(point.x, point.y, 1 + i)
		}
	};

	let dot = function (x, y, radius) {
		ctx.lineWidth = null;
		for (let i = 0; i < 30 / (system.brushSize * radius); i++) {
			ctx.beginPath();
			let newX = randomInteger(point.x - system.brushSize * radius, point.x + system.brushSize * radius);
			let newY = randomInteger(point.y - system.brushSize * radius, point.y + system.brushSize * radius);

			ctx.arc(newX, newY, 1, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
};

var sets = function () {
	canvas.onmousemove = function () {
		for (let i = 0; i < 1; i+=0.2) {
			ctx.globalAlpha = 0.6 - i;
			set(point.x, point.y, 1 + i)
		}
	};

	let set = function (x, y, radius) {
		ctx.beginPath();
		for (let i = 0; i < 0.1 * system.brushSize * radius; i++) {
			let newX = randomInteger(point.x - system.brushSize * radius, point.x + system.brushSize * radius);
			let newY = randomInteger(point.y - system.brushSize * radius, point.y + system.brushSize * radius);

			ctx.arc(newX, newY, 1, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.stroke();
		}
		ctx.closePath();
	}
};

var perspective = function () {
	ctx.globalAlpha = 0.3;
	ctx.lineWidth = system.brushSize;

	let startX = point.x;
	let startY = point.y;
	canvas.onmousemove = function () {
		ctx.beginPath();
		ctx.lineTo(point.x, point.y);
		ctx.stroke ();

		ctx.lineTo(startX, startY);
		ctx.stroke ();
		ctx.closePath();
	};
};

var eraser = function () {
	ctx.strokeStyle = 'white';
	ctx.fillStyle = 'white';
	ctx.globalAlpha = 1;
	ctx.beginPath();
	canvas.onmousemove = function () {
		ctx.fillRect (point.x - system.brushSize/2, point.y - system.brushSize/2, system.brushSize, system.brushSize);
		ctx.fill();
		ctx.stroke();
	};
	ctx.closePath();
};

function zoom(e) {
	e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}

canvas.addEventListener("wheel", zoom);
canvas.addEventListener ('mousemove', getCoordinates);
canvas.addEventListener ('mousedown', startDraw);
canvas.addEventListener ('mouseup', endDraw);
window.addEventListener ('click', clicker);


