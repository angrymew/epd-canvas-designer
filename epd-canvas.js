let canvas, ctx,
	clearButton,
	getCodeButton,
	colorSwatches,
	eraserToolButton,
	fillBlackButton,
	fillRedButton;

let isDrawing = false;
let selectedTool = "pencil";

document.addEventListener('DOMContentLoaded', function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	
	fill("#FFF");
	
	canvas.addEventListener("mousedown", startDrawing);
	canvas.addEventListener("mousemove", draw);
	canvas.addEventListener("mouseup", stopDrawing);
	canvas.addEventListener("mouseout", stopDrawing);
	
	clearButton = document.getElementById("clearButton");
	clearButton.addEventListener("click", function() {
	 ctx.clearRect(0, 0, canvas.width, canvas.height);
	});
	
	getCodeButton = document.getElementById("getCodeButton");
	getCodeButton.addEventListener("click", getBinaryEPDData);

	colorSwatches = document.querySelectorAll(".color-swatch");
	colorSwatches.forEach((swatch) => {
	 swatch.addEventListener("click", function() {
	  const color = this.style.backgroundColor;
	  ctx.strokeStyle = color;
	 });
	});

	eraserToolButton = document.getElementById("eraserTool");
	eraserToolButton.addEventListener("mousedown", function() {
	 selectedTool = "eraser";
	 ctx.strokeStyle = "#FFF";
	});
	
	fillBlackButton = document.getElementById("fillBlackButton");
	fillBlackButton.addEventListener("mousedown", function() {
		fill("#000");
	});
	
	fillRedButton = document.getElementById("fillRedButton");
	fillRedButton.addEventListener("mousedown", function() {
		fill("#F00");
	});
	
	fillWhiteButton = document.getElementById("fillWhiteButton");
	fillWhiteButton.addEventListener("mousedown", function() {
		fill("#FFF");
	});

});

function startDrawing(event) {
 isDrawing = true;
 draw(event);
}
function draw(event) {
 if (!isDrawing) return;
 const x = event.clientX - canvas.offsetLeft;
 const y = event.clientY - canvas.offsetTop;
 ctx.lineTo(x, y);
 ctx.stroke();
}
function stopDrawing() {
 isDrawing = false;
 ctx.beginPath();
}

function fill (color) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getBinaryEPDData() {
	const imageData = ctx.getImageData(0, 0, 152, 296).data;
	
	let binaryDataArrayBW = [],
		binaryDataArrayR = [];
	
	for (let i = 0; i < imageData.length; i+=4) {
		if (imageData[i] === 0 &&
			imageData[i + 1] === 0 &&
			imageData[i + 2] === 0) {
				binaryDataArrayBW.push(0);
				binaryDataArrayR.push(1);
			}
		else if (imageData[i] !== 0 &&
			imageData[i + 1] === 0 &&
			imageData[i + 2] === 0) {
			binaryDataArrayBW.push(1);
			binaryDataArrayR.push(0);
		} else {
			binaryDataArrayBW.push(1);
			binaryDataArrayR.push(1);
		}
	}
	
	let binaryOctectsBW = [],
		binaryOctectsR = [];
	
	for (let j = 0; j < 152 * 296; j += 8) {
		binaryOctectsBW.push("0x" +
			parseInt("" + binaryDataArrayBW[j] +
			binaryDataArrayBW[j+1] +
			binaryDataArrayBW[j+2] +
			binaryDataArrayBW[j+3] +
			binaryDataArrayBW[j+4] +
			binaryDataArrayBW[j+5] +
			binaryDataArrayBW[j+6] +
			binaryDataArrayBW[j+7], 2).toString(16));
			
		binaryOctectsR.push("0x" +
			parseInt("" + binaryDataArrayR[j] +
			binaryDataArrayR[j+1] +
			binaryDataArrayR[j+2] +
			binaryDataArrayR[j+3] +
			binaryDataArrayR[j+4] +
			binaryDataArrayR[j+5] +
			binaryDataArrayR[j+6] +
			binaryDataArrayR[j+7], 2).toString(16));
	}
	
	document.getElementById('code').value = "__code const uint8_t imageBW[] = {" + binaryOctectsBW.join(",") + "};\n\n__code const uint8_t imageR[] = {" + binaryOctectsR.join(",") + "};";
		
}
