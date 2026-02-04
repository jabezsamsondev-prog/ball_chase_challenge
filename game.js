document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const circles = document.querySelectorAll(".circle");
  const currentScoreElement = document.getElementById("current-score");
  const highScoreElement = document.getElementById("high-score");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  // Game State Variables - Restored
  let currentScore = 0;
  let highScore = parseInt(localStorage.getItem("highScore")) || 0;
  let currentDifficulty = "easy";
  let animationFrameId = null;
  let isRunning = false;
  
  // Sound
  function playClickSound() {
    const sound = new Audio("sounds/click.mp3");
    sound.currentTime = 0;
    sound.play();
  }

  // Timer Variables
  const timerElement = document.getElementById("timer");
  let timerInterval = null;
  let timeLeft = 60;

  // Initialize high score display
  highScoreElement.textContent = highScore;
  
  // Set initial difficulty
  container.dataset.difficulty = currentDifficulty;

  // Initialize ball states map
  const ballStates = new Map();

  function initializeBallState(circle) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    // Default sizes for spawn boundary calculation
    let size = 50;
    if (window.innerWidth <= 600) {
        if (currentDifficulty === 'easy') size = 50;
        if (currentDifficulty === 'medium') size = 35;
        if (currentDifficulty === 'hard') size = 25;
    } else {
        if (currentDifficulty === 'easy') size = 80;
        if (currentDifficulty === 'medium') size = 60;
        if (currentDifficulty === 'hard') size = 40;
    }

    return {
      x: Math.random() * (width - size),
      y: Math.random() * (height - size),
      dx: (Math.random() * 2 - 1) * getDifficultySpeed(),
      dy: (Math.random() * 2 - 1) * getDifficultySpeed(),
    };
  }
  
  // Initialize all circles
  circles.forEach((circle) => {
    ballStates.set(circle, initializeBallState(circle));
  });
  
  // Game Duration Check
  function getDifficultyTime() {
    switch (currentDifficulty) {
      case "easy": return 60;
      case "medium": return 45;
      case "hard": return 30;
      default: return 60;
    }
  }

  function updateTimerDisplay() {
    timerElement.textContent = timeLeft;
    if (timeLeft <= 10) {
      timerElement.style.color = "#ff0055"; // Red warning
      timerElement.style.textShadow = "0 0 10px #ff0055";
    } else {
      timerElement.style.color = ""; 
      timerElement.style.textShadow = "";
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function endGame() {
    isRunning = false;
    stopTimer();
    
    // Show Game Over Overlay
    if (playOverlay) {
      playOverlay.classList.remove("hidden");
      const h2 = playOverlay.querySelector("h2");
      const p = playOverlay.querySelector("p");
      const btn = playOverlay.querySelector("#start-game");
      
      if (h2) h2.textContent = "Time's Up!";
      if (p) p.textContent = `You scored ${currentScore} points on ${currentDifficulty} mode!`;
      if (btn) btn.textContent = "Play Again";
      
      const restartHandler = () => {
         // resetGame is handled by start button click listener which calls... wait.
         // The start button logic simply sets isRunning=true. We need it to RESET too.
         resetGame();
         isRunning = true;
         startTimer();
      };
      // We need to ensure the existing listener doesn't conflict. 
      // Actually, the existing listener just hides overlay and starts loop.
      // We should probably rely on resetGame() being called before start if coming from Game Over.
    }
  }

  // Hook into existing functions
  
  // Difficulty change
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // ... existing code ...
      difficultyButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      currentDifficulty = button.dataset.difficulty;
      container.dataset.difficulty = currentDifficulty;

      // Reset score
      currentScore = 0;
      currentScoreElement.textContent = currentScore;
      
      // Update Timer for new difficulty
      timeLeft = getDifficultyTime();
      updateTimerDisplay();

      // Reset ball speeds
      circles.forEach((circle) => {
        const state = ballStates.get(circle);
        const newState = initializeBallState(circle); // Re-init to get correct speed/size logic if needed, or just update speed
        // The original code just updated speed, but let's be safe
        state.dx = (Math.random() * 2 - 1) * getDifficultySpeed();
        state.dy = (Math.random() * 2 - 1) * getDifficultySpeed();
      });
      
      // If game is running, restart timer? No, usually changing difficulty resets the game.
      // Let's force reset if running, or just update the time if not.
      if (isRunning) {
        resetGame(); // This stops the game
      }
    });
  });

  // Overlay and modal elements
  const playOverlay = document.getElementById("play-overlay");
  const modalBackdrop = document.getElementById("app-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalCancel = document.getElementById("modal-cancel");
  const modalConfirm = document.getElementById("modal-confirm");
  const pauseBtn = document.getElementById("pause-game");
  const newGameBtn = document.getElementById("new-game");

  // Hook Start Button
  // We need to fetch the button fresh from the DOM incase valid reference is lost
  // But for first initialization, we get it by ID
  let startBtn = document.getElementById("start-game");
  
  // Start Button Logic
  // Replace cloning with direct event listener management if possible, 
  // or stick to cloning to ensure no duplicate listeners from previous runs if this script re-runs (unlikely in simple web page)
  // Let's use the clone approach which is robust for "re-binding"
  if (startBtn) {
    const newStartBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newStartBtn, startBtn);
    startBtn = newStartBtn; // Update reference
    
    startBtn.addEventListener("click", () => {
      // If coming from Game Over (time=0), we need to reset first
      if (timeLeft <= 0) {
        resetGame();
      }
      
      isRunning = true;
      if (playOverlay) playOverlay.classList.add("hidden");
      startTimer();
      
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateBalls);
      }
    });
  }

  // Pause Button Logic
  if (pauseBtn) {
    // Clone to remove old listener
    const oldPauseBtn = document.getElementById("pause-game");
    const newPauseBtn = oldPauseBtn.cloneNode(true);
    oldPauseBtn.parentNode.replaceChild(newPauseBtn, oldPauseBtn);
    
    newPauseBtn.addEventListener("click", () => {
      if (isRunning) {
        // Pause
        isRunning = false;
        stopTimer();
        newPauseBtn.textContent = "Resume";
        
        if (playOverlay) {
          playOverlay.classList.remove("hidden");
          const h2 = playOverlay.querySelector("h2");
          const p = playOverlay.querySelector("p");
          const btn = playOverlay.querySelector("#start-game"); // This is now newStartBtn
          
          if (h2) h2.textContent = "Paused";
          if (p) p.textContent = "Tap Resume to continue";
          if (btn) {
             btn.textContent = "Resume";
             // The btn click will trigger the newStartBtn listener above
             // which sets isRunning=true and starts timer. Perfect.
          }
        }
      } else {
        // Resume (direct click on pause button)
        isRunning = true;
        startTimer();
        newPauseBtn.textContent = "Pause";
        if (playOverlay) playOverlay.classList.add("hidden");
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updateBalls);
        }
      }
    });
  }

  // Reset Game Logic
  // Modify resetGame to handle timer
  const originalResetGame = resetGame; // Keep ref if needed, but we'll redefine
  // Redefine isn't easy in this scope without access to internal vars of original... 
  // Wait, I am inside the DOMContentLoaded, so I have access to everything.
  // I will just overwrite the function or create a new wrapper if I could.
  // Since I am replacing the file content, I can rewrite the function.
  
  function resetGame() {
    isRunning = false;
    stopTimer();
    
    currentScore = 0;
    currentScoreElement.textContent = currentScore;
    
    timeLeft = getDifficultyTime();
    updateTimerDisplay();

    // Reset positions
    const containerRect = container.getBoundingClientRect();
    circles.forEach((circle) => {
       // ... ball reset logic ...
       // Re-using logic from original file roughly
      const w = circle.clientWidth || 50; 
      // Note: styled width logic is in CSS now, JS just positions.
      
      let state = ballStates.get(circle);
      if (!state) state = { x: 0, y: 0, dx: 0, dy: 0 };
      
      const maxX = containerRect.width - w;
      const maxY = containerRect.height - w;
      
      state.x = Math.random() * (maxX > 0 ? maxX : containerRect.width);
      state.y = Math.random() * (maxY > 0 ? maxY : containerRect.height);
      
      const sp = getDifficultySpeed();
      state.dx = (Math.random() * 2 - 1) * sp;
      state.dy = (Math.random() * 2 - 1) * sp;
      
      circle.style.transform = `translate(${state.x}px, ${state.y}px)`;
    });

    if (playOverlay) {
      playOverlay.classList.remove("hidden");
      const h2 = playOverlay.querySelector("h2");
      const p = playOverlay.querySelector("p");
      const btn = playOverlay.querySelector("#start-game"); // newStartBtn
      
      if (h2) h2.textContent = "Ready to Play?";
      if (p) p.textContent = "Tap Start to begin. Choose a difficulty anytime.";
      if (btn) btn.textContent = "Start";
    }
    const pBtn = document.getElementById("pause-game");
    if (pBtn) pBtn.textContent = "Pause";
  }

  // Hook New Game button
  if (newGameBtn) {
     const oldNewGameBtn = document.getElementById("new-game");
     const newNewGameBtn = oldNewGameBtn.cloneNode(true);
     oldNewGameBtn.parentNode.replaceChild(newNewGameBtn, oldNewGameBtn);
     
     newNewGameBtn.addEventListener("click", () => {
       resetGame();
     });
  }
  
  // Initial Timer Setup
  updateTimerDisplay();

  // Handle circle clicks
  circles.forEach((circle) => {
    circle.addEventListener("click", () => {
      // Increment score
      playClickSound();
      currentScore += parseInt(circle.dataset.score || 1);
      currentScoreElement.textContent = currentScore;
      
      // Update High Score
      if (currentScore > highScore) {
        highScore = currentScore;
        highScoreElement.textContent = highScore;
        localStorage.setItem("highScore", highScore);
      }
      
      // Boost speed interaction
      const state = ballStates.get(circle);
      if (state) {
         const speed = getDifficultySpeed() * 1.5;
         state.dx = (Math.random() * 2 - 1) * speed;
         state.dy = (Math.random() * 2 - 1) * speed;
      }
    });
  });

  // Animation loop
  function updateBalls() {
    // Use clientWidth/Height to exclude borders, preventing scrollbars
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (isRunning) {
      circles.forEach((circle) => {
        const state = ballStates.get(circle);
        if (!state) return;
        
        let circleWidth = 50;
        // Determine width based on difficulty AND screen size to match CSS
        if (window.innerWidth <= 600) {
            switch (currentDifficulty) {
              case "easy": circleWidth = 50; break;
              case "medium": circleWidth = 35; break;
              case "hard": circleWidth = 25; break;
            }
        } else {
            switch (currentDifficulty) {
              case "easy": circleWidth = 80; break;
              case "medium": circleWidth = 60; break;
              case "hard": circleWidth = 40; break;
            }
        }

        state.x += state.dx;
        state.y += state.dy;

        // Bounce
        if (state.x < 0) { 
          state.x = 0; 
          state.dx *= -1; 
        } else if (state.x > width - circleWidth) { 
          state.x = width - circleWidth; 
          state.dx *= -1; 
        }

        if (state.y < 0) { 
          state.y = 0; 
          state.dy *= -1; 
        } else if (state.y > height - circleWidth) { 
          state.y = height - circleWidth; 
          state.dy *= -1; 
        }

        circle.style.transform = `translate(${state.x}px, ${state.y}px)`;
      });
    }
    animationFrameId = requestAnimationFrame(updateBalls);
  }

  // Helper function to get speed based on difficulty
  function getDifficultySpeed() {
    switch (currentDifficulty) {
      case "easy":
        return 4;
      case "medium":
        return 8;
      case "hard":
        return 12;
      default:
        return 4;
    }
  }
});
