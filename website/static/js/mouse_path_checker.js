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
  
    function checkCollisionWithMappedLine(pointsArray, mouseX, mouseY, tolerance = 1) {
      for (let i = 0; i < pointsArray.length; i++) {
        const point = pointsArray[i];
        const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2));
        if (distance <= tolerance) {
          return true;
        }
      }
      return false;
    }
  
    svg.addEventListener("mousemove", (event) => {
      const svgRect = svg.getBoundingClientRect();
      const mouseX = event.clientX - svgRect.left;
      const mouseY = event.clientY - svgRect.top;

      // Provjera je li miš prešao start liniju
      if (mouseX >= startLineX - lineTolerance && mouseX <= startLineX + lineTolerance && mouseY >= startLineY1 && mouseY <= startLineY2 && !passedStart) {
        if (lastMouseX !== -1 && mouseX > lastMouseX) {
          passedStart = true;
          console.log("Start linija pređena");
        }
      }

      if (!passedStart) {
        console.log("Čekam na start");
        lastMouseX = mouseX; 
        return; 
      }
      
      // Provjera kolizije s gornjom i donjom linijom
      if(passedStart && !passedStop){
            if (checkCollisionWithMappedLine(upperLinePoints, mouseX, mouseY)) {
            console.log("Kolizija s gornjom linijom!");
        } else if (checkCollisionWithMappedLine(lowerLinePoints, mouseX, mouseY)) {
            console.log("Kolizija s donjom linijom!");
        } else {
            console.log("Nema kolizije.");
        }
      }


      // Provjera je li miš prešao stop liniju
      if (mouseX >= stopLineX - lineTolerance && mouseX <= stopLineX + lineTolerance && mouseY >= stopLineY1 && mouseY <= stopLineY2 && !passedStop) {
        if (lastMouseXStop !== -1 && mouseX > lastMouseXStop) {
          passedStop = true;
          console.log("Stop linija pređena.");
        }
      }
  
      // Ako je prešao stop liniju, prestajemo s ispisivanjem pozicije miša
      if (passedStop) {
        console.log("Zaustavljeno praćenje, stop linija pređena.");
        return; 
      }
  
      lastMouseX = mouseX;
      lastMouseXStop = mouseX;
    });