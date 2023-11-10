let width, height, canvas, ctx, baseScaling, dynamicScalingFactor, k;

export function setupCanvas() {
    canvas = document.getElementById("graphCanvas");
    if (!canvas) {
        throw new Error("Canvas element not found");
    }
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    k = 1.4;
    baseScaling = width / 6;
    dynamicScalingFactor = baseScaling * k / 3; // base for R = 3;
}

export function setDynamicScalingFactor(R) {
    dynamicScalingFactor = getBaseScaling() * getK() / R;
}

export function getCanvas() {
    return canvas; 
}
export function getContext() {
    return ctx; 
}
export function getWidth() {
    return width; 
}
export function getHeight() {
    return height; 
}
export function getBaseScaling() {
    return baseScaling; 
}
export function getDynamicScalingFactor() {
    return dynamicScalingFactor; 
}
export function getK() {
    return k; 
}
