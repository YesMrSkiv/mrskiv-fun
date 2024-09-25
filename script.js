let canvas, ctx, isDrawing = false, points = [], radius = 100, centerX, centerY;
let startTime, endTime, score = 0, bestScore = 0;

window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    // Hide game screen initially
    document.querySelector('.game-screen').style.display = 'none';

    // Handle mouse down event
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', drawCircle);
};

function startGame() {
    // Hide start screen, show game screen
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'block';

    // Start the game
    resetGame();
}

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    points = []; // Reset the points array
    score = 0; // Reset the score
    document.getElementById("percentage").innerHTML = "";
    document.getElementById("new-best").innerHTML = "";
}

function startDrawing(e) {
    isDrawing = true;
    points = [];
    startTime = new Date();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    endTime = new Date();

    calculateScore();
}

function drawCircle(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.push({x, y});

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Draw reference perfect circle
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw user's freehand circle
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function calculateScore() {
    let totalDistance = 0;

    for (let i = 0; i < points.length; i++) {
        let dx = points[i].x - centerX;
        let dy = points[i].y - centerY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        totalDistance += Math.abs(distance - radius); // Compare user's radius to reference radius
    }

    const averageError = totalDistance / points.length;
    score = Math.max(0, 100 - averageError); // Calculate score (100% is perfect)

    if (score > bestScore) {
        bestScore = score;
        document.getElementById("new-best").innerHTML = "New best score";
    }

    document.getElementById("percentage").innerHTML = score.toFixed(1) + "%";
}
