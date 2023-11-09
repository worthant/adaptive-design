"use strict"

const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let baseScaling = width / 6;
let dynamicScalingFactor;

document.addEventListener("DOMContentLoaded", () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

window.onload = function () {
    drawGraph(3);
}

function updateDateTime() {
    const now = new Date();
    const dateString = now.toDateString();
    const timeString = now.toTimeString().substring(0, 8);

    // Update date and time for desktop
    document.getElementById("date").innerText = dateString;
    document.getElementById("time").innerText = timeString;

    // Update date and time for mobile
    document.getElementById("date-mobile").innerText = dateString;
    document.getElementById("time-mobile").innerText = timeString;
}

function drawAxis(context, fromX, fromY, toX, toY, k) {
    const headLength = 10 * k; // Scale the arrowhead size
    const angle = Math.atan2(toY - fromY, toX - fromX);

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    context.moveTo(toX, toY);
    context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

function drawGraph(R) {
    let k = 1.4;
    dynamicScalingFactor = baseScaling * k / R;
    let yAxisOffset = 15;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.font = "15px Arial";

    // Draw x and y axes
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;

    // Adjust the axis length by multiplying by the scaling factor k
    // Also adjust the start points to keep the axes centered
    let xAxisStartX = (width / 2) - ((width / 4) * k);
    let xAxisEndX = (width / 2) + ((width / 4) * k);
    let yAxisStartY = (height / 2) + ((height / 4) * k);
    let yAxisEndY = (height / 2) - ((height / 4) * k);

    // Draw scaled axes
    drawAxis(ctx, xAxisStartX, height / 2, xAxisEndX, height / 2, k);  // X-axis
    drawAxis(ctx, width / 2, yAxisStartY, width / 2, yAxisEndY, k); // Y-axis

    // Drawing the areas

    // Triangle (lower right)
    ctx.fillStyle = "#FFFF0010"; // yellow with 10% opacity
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2 + R / 2 * dynamicScalingFactor, height / 2);
    ctx.lineTo(width / 2, height / 2 + R * dynamicScalingFactor);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#FFFF00";
    ctx.stroke();

    // Rectangle (upper right)
    ctx.fillStyle = "#0000FF10"; // blue with 10% opacity
    ctx.fillRect(width / 2, height / 2 - R / 2 * dynamicScalingFactor, R * dynamicScalingFactor, R / 2 * dynamicScalingFactor);
    ctx.strokeStyle = "#0000FF";
    ctx.strokeRect(width / 2, height / 2 - R / 2 * dynamicScalingFactor, R * dynamicScalingFactor, R / 2 * dynamicScalingFactor);

    // Semicircle (lower left)
    ctx.fillStyle = "#39FF1410"; // green with 10% opacity
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, R / 2 * dynamicScalingFactor, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#39FF14";
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "white";
    // X-axis labels
    ctx.fillText(R.toString(), width / 2 + R * dynamicScalingFactor, height / 2 + 30);
    ctx.fillText((R / 2).toString(), width / 2 + (R / 2) * dynamicScalingFactor, height / 2 + 30);
    ctx.fillText((-R).toString(), width / 2 - R * dynamicScalingFactor, height / 2 + 30);
    ctx.fillText((-R / 2).toString(), width / 2 - (R / 2) * dynamicScalingFactor, height / 2 + 30);
    ctx.fillText("X", 3 * width / 4 + 55 * k, height / 2 + 5);

    // Y-axis labels
    ctx.fillText(R.toString(), width / 2 + yAxisOffset, height / 2 - R * dynamicScalingFactor);
    ctx.fillText((R / 2).toString(), width / 2 + yAxisOffset, height / 2 - (R / 2) * dynamicScalingFactor);
    ctx.fillText((-R).toString(), width / 2 + yAxisOffset, height / 2 + R * dynamicScalingFactor);
    ctx.fillText((-R / 2).toString(), width / 2 + yAxisOffset, height / 2 + (R / 2) * dynamicScalingFactor);
    ctx.fillText("Y", width / 2 - 4, height / (4 + k) - 35);

    // Draw ticks
    ctx.fillStyle = "white";
    // X-axis tics
    const tickLength = 10; // Length of the tick marks
    for (let tickValue = -R; tickValue <= R; tickValue += R / 2) {
        const xTickPosition = width / 2 + tickValue * dynamicScalingFactor;
        ctx.beginPath();
        ctx.moveTo(xTickPosition, height / 2 - tickLength / 2);
        ctx.lineTo(xTickPosition, height / 2 + tickLength / 2);
        ctx.stroke();
    }

    // Y-axis tics
    for (let tickValue = -R; tickValue <= R; tickValue += R / 2) {
        const yTickPosition = height / 2 - tickValue * dynamicScalingFactor;
        ctx.beginPath();
        ctx.moveTo(width / 2 - tickLength / 2, yTickPosition);
        ctx.lineTo(width / 2 + tickLength / 2, yTickPosition);
        ctx.stroke();
    }
}

function drawPoint(x, y, r, result) {
    dynamicScalingFactor = baseScaling / r;
    let canvasX = width / 2 + x * dynamicScalingFactor;
    let canvasY = height / 2 - y * dynamicScalingFactor;
    ctx.fillStyle = result ? "green" : "red";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
    ctx.fill();
}

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let graphX = (x - canvas.width / 2) / dynamicScalingFactor;
    let graphY = (canvas.height / 2 - y) / dynamicScalingFactor;

    // sendCoords(graphX, graphY);

    console.log(`Raw values: X: ${x}, Y: ${y}`);
    console.log(`Graph values: ${graphX}, ${graphY}`);
});

document.getElementById('scrollToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('scrollToGraph').addEventListener('click', () => {
    document.getElementById('scrollToGraph').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('scrollToTable').addEventListener('click', () => {
    document.getElementById('scrollToTable').scrollIntoView({ behavior: 'smooth' });
});
