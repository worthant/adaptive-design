import {
    setupCanvas,
    getCanvas,
    getContext,
    getWidth,
    getHeight,
    setDynamicScalingFactor,
    getDynamicScalingFactor,
    getK
} from "./canvas-setup.js";

import $ from 'jquery';

document.addEventListener("DOMContentLoaded", () => {
    setupCanvas();
    attachCanvasClickListener();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setupSmoothScrolling();
});

window.onload = function () {
    drawGraph(3);
};

export function updateDateTime() {
    const now = new Date();
    const dateString = now.toUTCString().slice(0, 16);
    const timeString = now.toUTCString().slice(17, 25);

    $("#date").text(dateString);
    $("#time").text(timeString);

    $("#date-mobile").text(dateString);
    $("#time-mobile").text(timeString);
}

export function drawAxis(context, fromX, fromY, toX, toY, k) {
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

export function drawGraph(R) {
    setDynamicScalingFactor(R);
    const ctx = getContext();
    const width = getWidth();
    const height = getHeight();
    const k = getK();
    const dynamicScalingFactor = getDynamicScalingFactor();
    const yAxisOffset = 15;
    const xAxisStartX = (width / 2) - ((width / 4) * k);
    const xAxisEndX = (width / 2) + ((width / 4) * k);
    const yAxisStartY = (height / 2) + ((height / 4) * k);
    const yAxisEndY = (height / 2) - ((height / 4) * k);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.font = "15px Arial";

    // Draw x and y axes
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;

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

export function drawPoint(x, y, r, result) {
    setDynamicScalingFactor(r);
    const width = getWidth();
    const height = getHeight();
    const dynamicScalingFactor = getDynamicScalingFactor();
    const ctx = getContext();

    let canvasX = width / 2 + x * dynamicScalingFactor;
    let canvasY = height / 2 - y * dynamicScalingFactor;
    ctx.fillStyle = result === undefined ? "gray" : result ? "green" : "red";

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
    ctx.fill();
}

export function translateCanvasCoordsToReal(canvasX, canvasY) {
    const canvas = getCanvas();
    const dynamicScalingFactor = getDynamicScalingFactor();

    let graphX = (canvasX - canvas.width / 2) / dynamicScalingFactor;
    let graphY = (canvas.height / 2 - canvasY) / dynamicScalingFactor;
    return { x: graphX, y: graphY };
}

export function setupSmoothScrolling() {
    document.getElementById("scrollToTop").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("scrollToGraph").addEventListener("click", () => {
        document.getElementById("scrollToGraph").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("scrollToTable").addEventListener("click", () => {
        document.getElementById("scrollToTable").scrollIntoView({ behavior: "smooth" });
    });
}

export function attachCanvasClickListener() {
    const canvas = getCanvas();
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Деструктуризация
        const { x, y } = translateCanvasCoordsToReal(canvasX, canvasY);
        // sendCoordinates(x, y);
        drawPoint(x, y, 3, undefined);
    });
}