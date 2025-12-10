
document.addEventListener('DOMContentLoaded', function() {
  const holes = document.querySelectorAll('.hole');
  const scoreSpan = document.getElementById('score');
  const timeSpan = document.getElementById('time');
  const highSpan = document.getElementById('high');
  const startBtn = document.getElementById('start');
  const gameover = document.getElementById('gameover');
  const finalSpan = document.getElementById('final');
  const restartBtn = document.getElementById('restartBtn');
  const bgm = document.getElementById('bgm');
  const hitSound = document.getElementById('hitSound');

  let score = 0;
  let timeLeft = 30;
  let highScore = parseInt(localStorage.getItem('whacAMoleHigh') || '0');
  let gameRunning = false;
  let moleTimer = null;
  let timeTimer = null;
  let popSpeed = 1300;

  function updateUI() {
    scoreSpan.textContent = score.toString().padStart(2, '0');
    timeSpan.textContent = timeLeft.toString().padStart(2, '0');
    highSpan.textContent = highScore.toString().padStart(2, '0');
    finalSpan.textContent = score.toString().padStart(2, '0');
  }

function playHitSound() {
  const hit = new Audio('sounds/hit.wav');  
  hit.volume = 0.6;                        
  hit.play();
}

  function randomMole() {
    const availableHoles = Array.from(holes).filter(hole => !hole.querySelector('.mole'));
    if (availableHoles.length === 0 || !gameRunning) return;

    const hole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    const mole = document.createElement('div');
    mole.classList.add('mole');
    mole.onclick = hitMole;

    hole.appendChild(mole);

    setTimeout(() => {
      if (mole.parentNode) mole.classList.add('pop');
    }, 50);

    const moleLife = popSpeed + Math.random() * 500;
    setTimeout(() => {
      if (mole.parentNode) mole.remove();
    }, moleLife);
  }

  function hitMole(e) {
    e.stopPropagation();
    const mole = e.target;
    mole.classList.add('hit');
    score++;
    if (score > highScore) highScore = score;
    updateUI();
    playHitSound();
    setTimeout(() => {
      if (mole.parentNode) mole.remove();
    }, 300);
  }

  function tick() {
    timeLeft--;
    updateUI();
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    if (timeLeft % 5 === 0 && popSpeed > 500) {
      popSpeed = Math.max(500, popSpeed - 75);
      clearInterval(moleTimer);
      moleTimer = setInterval(randomMole, popSpeed);
    }
  }

  function startGame() {
    gameRunning = true;
    score = 0;
    timeLeft = 30;
    popSpeed = 1300;
    startBtn.style.display = 'none';
    gameover.style.display = 'none';
    document.body.classList.add('playing');   
    updateUI();
    moleTimer = setInterval(randomMole, popSpeed);
    timeTimer = setInterval(tick, 1000);
    bgm.volume = 0.4;
    bgm.play().catch(() => {});   
  }

  function endGame() {
    gameRunning = false;
    clearInterval(moleTimer);
    clearInterval(timeTimer);
    localStorage.setItem('whacAMoleHigh', highScore);
    updateUI();
    gameover.style.display = 'flex';    
    document.body.classList.remove('playing');  
    holes.forEach(hole => hole.querySelector('.mole')?.remove());
    bgm.pause();
    bgm.currentTime = 0;
  }

  function restart() {
    startGame();
  }

  
  startBtn.onclick = startGame;
  restartBtn.onclick = restart;

  updateUI();
});