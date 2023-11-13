import {
    setupCanvas,
    getCanvas,
    getContext,
    getWidth,
    getHeight,
    getDynamicScalingFactor,
    getK,
    getGraphSetup,
    getDrawModeState,
    getMagnetModeState,
    setWidth,
    setHeight,
    setDynamicScalingFactor,
    setK,
    setDrawModeState,
    setMagnetModeState
} from "./canvas-setup.js";

document.addEventListener("DOMContentLoaded", () => {
    setupCanvas(3); // R = 3; base value for showcasing the graph to user
    attachCanvasListeners();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setupSmoothScrolling();
    setupZoomButtons();
    setupGraphModes();
});

window.onload = () => {
    drawGraph(3); // R = 3; base value for showcasing the graph to user
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

export function drawGraph(R) {
    setDynamicScalingFactor(R);
    const { ctx, width, height, k, dynamicScalingFactor } = getGraphSetup();

    // Setup axes
    const yAxisOffset = 15;
    const xAxisStartX = (width / 2) - ((width / 4) * k);
    const xAxisEndX = (width / 2) + ((width / 4) * k);
    const yAxisStartY = (height / 2) + ((height / 4) * k);
    const yAxisEndY = (height / 2) - ((height / 4) * k);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.font = "15px Arial";
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
    ctx.fillText("X", width / 2 + (3.12 * R / 2) * dynamicScalingFactor, height / 2 + 5);

    // Y-axis labels
    ctx.fillText(R.toString(), width / 2 + yAxisOffset, height / 2 - R * dynamicScalingFactor);
    ctx.fillText((R / 2).toString(), width / 2 + yAxisOffset, height / 2 - (R / 2) * dynamicScalingFactor);
    ctx.fillText((-R).toString(), width / 2 + yAxisOffset, height / 2 + R * dynamicScalingFactor);
    ctx.fillText((-R / 2).toString(), width / 2 + yAxisOffset, height / 2 + (R / 2) * dynamicScalingFactor);
    ctx.fillText("Y", width / 2 - 5, height / 2 - (3.15 * R / 2) * dynamicScalingFactor);

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

export function translateCanvasCoordsToReal(canvasX, canvasY) {
    const width = getWidth();
    const height = getHeight();
    const dynamicScalingFactor = getDynamicScalingFactor();

    let graphX = (canvasX - width / 2) / dynamicScalingFactor;
    let graphY = (height / 2 - canvasY) / dynamicScalingFactor;
    return { x: graphX, y: graphY };
}

export function translateRealCoordsToCanvas(x, y) {
    const width = getWidth();
    const height = getHeight();
    const dynamicScalingFactor = getDynamicScalingFactor();

    let canvasX = x * dynamicScalingFactor + width / 2;
    let canvasY = height / 2 - y * dynamicScalingFactor;
    return { canvasX, canvasY };
}


export function setupSmoothScrolling() {
    document.getElementById("scrollToTop").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // had to comment this one because a bit annoying
    // document.getElementById("scrollToGraph").addEventListener("click", () => {
    //     document.getElementById("scrollToGraph").scrollIntoView({ behavior: "smooth" });
    // }); 

    document.getElementById("scrollToTable").addEventListener("click", () => {
        document.getElementById("scrollToTable").scrollIntoView({ behavior: "smooth" });
    });
}

export function attachCanvasListeners() {
    const canvas = getCanvas();
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let canvasX = (e.clientX - rect.left) * scaleX;
        let canvasY = (e.clientY - rect.top) * scaleY;

        let { x, y } = translateCanvasCoordsToReal(canvasX, canvasY);
        
        // Snap coordinates if magnet mode is active
        if (getMagnetModeState()) {
            x = snapToGrid(x);
            y = snapToGrid(y);
        }
        
        ({ canvasX, canvasY } = translateRealCoordsToCanvas(x, y));
        drawDotOnCanvas(canvasX, canvasY);

        console.log(x, y);
        // sendCoordinates(x, y);
        // drawDotOnCanvas(1.5, 1.5, 3, true, true);
    });

    window.addEventListener("resize", () => {
        setWidth(canvas.width);
        setHeight(canvas.height);

        let r = 3; // TODO: get this from input form
        drawGraph(r);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!getDrawModeState()) return;

        const boundingRect = canvas.getBoundingClientRect();
        const scaleMouseX = canvas.width / boundingRect.width;
        const scaleMouseY = canvas.height / boundingRect.height;

        const mouseX = (e.clientX - boundingRect.left) * scaleMouseX;
        const mouseY = (e.clientY - boundingRect.top) * scaleMouseY;

        // Convert mouse coordinates to real graph coordinates
        let { x, y } = translateCanvasCoordsToReal(mouseX, mouseY);

        // Snap coordinates if magnet mode is active
        if (getMagnetModeState()) {
            x = snapToGrid(x);
            y = snapToGrid(y);
        }

        // Convert back to canvas coordinates if necessary
        const { canvasX, canvasY } = translateRealCoordsToCanvas(x, y);

        // Draw a semi-transparent dot at the calculated position
        drawDot(canvasX, canvasY);

        // sendToServer
    });
}

export function snapToGrid(value) {
    let r = 3; // TODO: get this from input form
    const step = r / 2;
    return Math.round(value / step) * step;
}

function drawDot(x, y) {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");

    // Set the style for the dot
    ctx.fillStyle = "rgba(128, 128, 128, 0.5)"; // Semi-transparent gray

    // Draw the dot
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

export function drawDotOnCanvas(x, y, r, result, isRealCoords = false) {
    const ctx = getContext();
    let canvasX, canvasY;

    if (isRealCoords) {
        setDynamicScalingFactor(r);
        ({ canvasX, canvasY } = translateRealCoordsToCanvas(x, y));
    } else {
        canvasX = x;
        canvasY = y;
    }

    ctx.fillStyle = result === undefined ? "gray" : result ? "green" : "red";
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
    ctx.fill();
}

export function setupZoomButtons() {
    document.getElementById("zoomInBtn").addEventListener("click", () => {
        setK(getK()*1.1);
        
        let r = 3; // // TODO: get this from input form
        drawGraph(r);
    });
    document.getElementById("zoomOutBtn").addEventListener("click", () => {
        setK(getK()/1.1);

        let r = 3; // // TODO: get this from input form
        drawGraph(r);
    });
    document.getElementById("rValue").addEventListener("input", (e) => {
        let r = parseFloat(e.target.value);
        console.log(r);
        
        if (isNaN(r)) {
            r = 3;
        } else if (r >= 1 && r <= 4) {
            drawGraph(parseFloat(r));
        }
    });
    document.getElementById("restoreZoom").addEventListener("click", () => {
        setK(1.7); // base scaling constant

        let r = 3; // TODO: get this from input form
        drawGraph(r);
    });
}

export function setupGraphModes() {
    document.getElementById("drawModeBtn").addEventListener("click", () => {
        setDrawModeState(!getDrawModeState());
        document.getElementById("drawModeBtn").classList.toggle("pressed");
    });
    document.getElementById("magnetModeBtn").addEventListener("click", () => {
        setMagnetModeState(!getMagnetModeState());
        document.getElementById("magnetModeBtn").classList.toggle("pressed");
    });
}