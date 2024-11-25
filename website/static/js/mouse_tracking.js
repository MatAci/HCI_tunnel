const svg = document.querySelector("svg");
const upperLine = document.getElementById("upperLine");
const lowerLine = document.getElementById("lowerLine");

const startLine = document.getElementById("startLine");
const startData = startLine.getAttribute("d");
const stopLine = document.getElementById("stopLine");
const stopData = stopLine.getAttribute("d");

const coordinatesStart = startData.split(' ');
const coordinatesStop = stopData.split(' ');

const startLineX = parseFloat(coordinatesStart[1]);
const startLineY1 = parseFloat(coordinatesStart[2]);
const startLineY2 = parseFloat(coordinatesStart[5]);

const stopLineX = parseFloat(coordinatesStop[1]);
const stopLineY1 = parseFloat(coordinatesStop[2]);
const stopLineY2 = parseFloat(coordinatesStop[5]);

const lineTolerance = 5;

let passedStart = false;
let passedStop = false; 
let lastMouseX = -1;
let lastMouseY = -1; // Dodano za praćenje Y koordinate
let lastMouseXStop = -1;

const upperLinePoints = [];
const lowerLinePoints = [];

function mapLinePoints(path, pointsArray) {
  const pathLength = path.getTotalLength();
  for (let i = 0; i <= pathLength; i += 1) { 
    const point = path.getPointAtLength(i);
    pointsArray.push({ x: point.x, y: point.y });
  }
}

mapLinePoints(upperLine, upperLinePoints);
mapLinePoints(lowerLine, lowerLinePoints);

function checkCollisionWithMappedLine(pointsArray, x, y, tolerance = 1) {
  for (let i = 0; i < pointsArray.length; i++) {
    const point = pointsArray[i];
    const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
    if (distance <= tolerance) {
      return true;
    }
  }
  return false;
}

function interpolatePoints(x1, y1, x2, y2, steps) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      x: x1 + (x2 - x1) * t,
      y: y1 + (y2 - y1) * t,
    });
  }
  return points;
}

svg.addEventListener("mousemove", (event) => {
  const svgRect = svg.getBoundingClientRect();
  const mouseX = event.clientX - svgRect.left;
  const mouseY = event.clientY - svgRect.top;

  if (lastMouseX !== -1 && lastMouseY !== -1) {
    // Interpoliraj između prethodne i trenutne pozicije miša
    const interpolatedPoints = interpolatePoints(lastMouseX, lastMouseY, mouseX, mouseY, 30);

    for (const point of interpolatedPoints) {
      const x = point.x;
      const y = point.y;

      // Ako start linija nije pređena, čekaj
      if (x >= startLineX - lineTolerance && x <= startLineX + lineTolerance && y >= startLineY1 && y <= startLineY2 && !passedStart) {
        if (lastMouseX !== -1 && x > lastMouseX) {
          passedStart = true;
          startTimer();
          console.log("Start linija pređena");
        }
      }

      // Ako start nije pređen, ništa ne radimo
      if (!passedStart) {
        console.log("Čekam na start");
        continue;
      }

      // Provjera kolizije s gornjom i donjom linijom
      if (passedStart && !passedStop) {
        if (checkCollisionWithMappedLine(upperLinePoints, x, y)) {
          console.log("Kolizija s gornjom linijom!");
          errorCount++;
          resetGame();
          return;
        } else if (checkCollisionWithMappedLine(lowerLinePoints, x, y)) {
          console.log("Kolizija s donjom linijom!");
          errorCount++;
          resetGame();
          return;
        }
      }

      // Provjera ako je pređena stop linija
      if (x >= stopLineX - lineTolerance && x <= stopLineX + lineTolerance && y >= stopLineY1 && y <= stopLineY2 && !passedStop) {
        if (lastMouseXStop !== -1 && x > lastMouseXStop) {
          passedStop = true;
          console.log("Stop linija pređena.");
          clearInterval(timerInterval);
          taskCompletedSuccessfully();
        }
      }

      if (passedStop) {
        console.log("Zaustavljeno praćenje, stop linija pređena.");
        return;
      }
    }
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY; // Ažuriranje Y koordinate
  lastMouseXStop = mouseX;
});
