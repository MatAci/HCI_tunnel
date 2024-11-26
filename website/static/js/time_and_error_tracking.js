let errorCount = 0; 
let startTime = 0; 
let elapsedTime = 0; 
let timerInterval = 0;

document.getElementById("timeDisplay").textContent = 'Vrijeme: 0.00 sekundi';
document.getElementById("errorCountDisplay").textContent = `Broj pogrešaka: ${errorCount}`;
document.getElementById("result-container").classList.remove("d-none");

function startTimer() {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTime, 10);
    }
}
  
function updateTime() {
    if (!startTime) return;
        elapsedTime = (Date.now() - startTime) / 1000;
        document.getElementById("timeDisplay").textContent = `Vrijeme: ${elapsedTime.toFixed(2)} sekundi`;
}
  
function resetGame() {
    passedStart = false;
    passedStop = false;
    elapsedTime = 0;
    startTime = null;
    clearInterval(timerInterval);
    document.getElementById("timeDisplay").textContent = 'Vrijeme: 0.00 sekundi';
    document.getElementById("errorCountDisplay").textContent = `Broj pogrešaka: ${errorCount}`;
    document.getElementById("result-container").classList.remove("d-none");
}


function taskCompletedSuccessfully() {
    document.getElementById('timeDisplay').textContent = `Vrijeme: ${elapsedTime} sekundi`;
    document.getElementById('errorCountDisplay').textContent = `Broj pogrešaka: ${errorCount}`;
  
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('d-none'); 
  
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('d-none'); 

    var username = document.getElementById('hiddenUsername').textContent;
    var trackId = document.getElementById('hiddenTrackID').textContent;

        const dataToSend = {
            elapsedTime: elapsedTime,
            errorCount: errorCount,
            username: username,
            trackId: trackId
        };

        fetch('/task-completed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                elapsedTime: elapsedTime,
                errorCount: errorCount,
                username: username,
                trackId: trackId
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
    
            if (data.finished) {
                alert("Sve stranice su završene!");
                window.location.href = '/home'; // Povratak na početnu
            } else {
                window.location.href = `/next-task`; // Redirekcija na sljedeći zadatak
            }
        })
        .catch(error => {
            console.error('Greška prilikom slanja podataka:', error);
        });
    }
    