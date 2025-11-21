document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const circles = document.querySelectorAll(".circle");
  const currentScoreElement = document.getElementById("current-score");
  const highScoreElement = document.getElementById("high-score");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");
  function playClickSound() {
    const sound = new Audio("sounds/click.mp3");
    sound.currentTime = 0;
    sound.play();
  }
  // Overlay and modal elements
  const playOverlay = document.getElementById("play-overlay");
  const startBtn = document.getElementById("start-game");
  const modalBackdrop = document.getElementById("app-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalCancel = document.getElementById("modal-cancel");
  const modalConfirm = document.getElementById("modal-confirm");

  let currentScore = 0;
  let highScore = parseInt(localStorage.getItem("highScore")) || 0;
  let currentDifficulty = "easy";
  let animationFrameId = null;
  let isRunning = false;

  // Initialize high score display
  highScoreElement.textContent = highScore;

  // Set initial difficulty
  container.dataset.difficulty = currentDifficulty;

  // Initialize ball states with random positions and velocities
  const ballStates = new Map();

  function initializeBallState(circle) {
    const containerRect = container.getBoundingClientRect();

    return {
      x: Math.random() * (containerRect.width - 50), // Using fixed initial size
      y: Math.random() * (containerRect.height - 50),
      dx: (Math.random() * 2 - 1) * getDifficultySpeed(),
      dy: (Math.random() * 2 - 1) * getDifficultySpeed(),
    };
  }

  // Initialize all circles
  circles.forEach((circle) => {
    ballStates.set(circle, initializeBallState(circle));
  });

  // Handle difficulty buttons
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      difficultyButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update difficulty
      currentDifficulty = button.dataset.difficulty;
      container.dataset.difficulty = currentDifficulty;

      // Reset score when changing difficulty
      currentScore = 0;
      currentScoreElement.textContent = currentScore;

      // Reset ball speeds for new difficulty
      circles.forEach((circle) => {
        const state = ballStates.get(circle);
        state.dx = (Math.random() * 2 - 1) * getDifficultySpeed();
        state.dy = (Math.random() * 2 - 1) * getDifficultySpeed();
      });
    });
  });

  // Reset High Score button
  const resetHighScoreBtn = document.getElementById("reset-high-score");
  const pauseBtn = document.getElementById("pause-game");
  const newGameBtn = document.getElementById("new-game");
  if (resetHighScoreBtn) {
    resetHighScoreBtn.addEventListener("click", () => {
      openModal({
        title: "Reset High Score",
        message:
          "Are you sure you want to reset your high score? This cannot be undone.",
        confirmText: "Yes, reset",
        onConfirm: () => {
          try {
            localStorage.removeItem("highScore");
          } catch (_) {}
          highScore = 0;
          highScoreElement.textContent = highScore;
        },
      });
    });
  }

  // Modal helpers
  function openModal({
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Confirm",
    onConfirm = null,
  }) {
    if (!modalBackdrop) return;
    modalTitle && (modalTitle.textContent = title);
    modalMessage && (modalMessage.textContent = message);
    if (modalConfirm) modalConfirm.textContent = confirmText;

    const handleCancel = () => {
      closeModal();
    };
    const handleConfirm = () => {
      closeModal();
      if (typeof onConfirm === "function") onConfirm();
    };

    modalBackdrop.classList.add("show");
    modalCancel &&
      modalCancel.addEventListener("click", handleCancel, { once: true });
    modalConfirm &&
      modalConfirm.addEventListener("click", handleConfirm, { once: true });
    // Close on backdrop click
    modalBackdrop.addEventListener(
      "click",
      (e) => {
        if (e.target === modalBackdrop) closeModal();
      },
      { once: true }
    );
  }

  function closeModal() {
    modalBackdrop && modalBackdrop.classList.remove("show");
  }

  // New Game helper
  function resetGame() {
    // Stop movement
    isRunning = false;
    // Reset score
    currentScore = 0;
    currentScoreElement.textContent = currentScore;

    // Reposition circles and reset velocities
    const containerRect = container.getBoundingClientRect();
    circles.forEach((circle) => {
      const rect = circle.getBoundingClientRect();
      const w = rect.width || 40;
      const h = rect.height || w;
      const maxX = Math.max(0, containerRect.width - w);
      const maxY = Math.max(0, containerRect.height - h);
      let state = ballStates.get(circle);
      if (!state) {
        state = { x: 0, y: 0, dx: 0, dy: 0 };
        ballStates.set(circle, state);
      }
      state.x = Math.random() * maxX;
      state.y = Math.random() * maxY;
      const sp = getDifficultySpeed();
      state.dx = (Math.random() * 2 - 1) * sp;
      state.dy = (Math.random() * 2 - 1) * sp;
      circle.style.transform = `translate(${state.x}px, ${state.y}px)`;
    });

    // Reset overlay to Start state
    if (playOverlay) {
      playOverlay.classList.remove("hidden");
      const h2 = playOverlay.querySelector("h2");
      const p = playOverlay.querySelector("p");
      const btn = playOverlay.querySelector("#start-game");
      if (h2) h2.textContent = "Ready to Play?";
      if (p) p.textContent = "Tap Start to begin. Choose a difficulty anytime.";
      if (btn) btn.textContent = "Start";
    }
    if (pauseBtn) pauseBtn.textContent = "Pause";
  }

  // Handle circle clicks
  circles.forEach((circle) => {
    circle.addEventListener("click", () => {
      // Increment score
      playClickSound();
      currentScore += parseInt(circle.dataset.score);
      currentScoreElement.textContent = currentScore;

      // Check and update high score
      if (currentScore > highScore) {
        highScore = currentScore;
        highScoreElement.textContent = highScore;
        localStorage.setItem("highScore", highScore);
      }

      // Change direction and increase speed slightly on click
      const state = ballStates.get(circle);
      const speed = getDifficultySpeed() * 1.1; // 10% faster on click
      state.dx = (Math.random() * 1.8 - 1) * speed;
      state.dy = (Math.random() * 2.5 - 1) * speed;
    });
  });

  // Animation loop
  function updateBalls() {
    const containerRect = container.getBoundingClientRect();

    if (isRunning) {
      circles.forEach((circle) => {
        const state = ballStates.get(circle);
        let circleWidth = 50; // Default size

        // Adjust size based on difficulty
        switch (currentDifficulty) {
          case "easy":
            circleWidth = 50;
            break;
          case "medium":
            circleWidth = 40;
            break;
          case "hard":
            circleWidth = 30;
            break;
        }

        // Update position
        state.x += state.dx;
        state.y += state.dy;

        // Bounce off walls with proper boundary checking
        if (state.x < 0) {
          state.x = 0;
          state.dx *= -1;
        } else if (state.x > containerRect.width - circleWidth) {
          state.x = containerRect.width - circleWidth;
          state.dx *= -1;
        }

        if (state.y < 0) {
          state.y = 0;
          state.dy *= -1;
        } else if (state.y > containerRect.height - circleWidth) {
          state.y = containerRect.height - circleWidth;
          state.dy *= -1;
        }

        // Apply position
        circle.style.transform = `translate(${state.x}px, ${state.y}px)`;
      });
    }

    animationFrameId = requestAnimationFrame(updateBalls);
  }

  // Helper function to get speed based on difficulty
  function getDifficultySpeed() {
    switch (currentDifficulty) {
      case "easy":
        return 2;
      case "medium":
        return 4;
      case "hard":
        return 6;
      default:
        return 2;
    }
  }

  // Start overlay logic
  if (startBtn && playOverlay) {
    startBtn.addEventListener("click", () => {
      isRunning = true;
      // Hide overlay
      playOverlay.classList.add("hidden");
      // Begin animation loop
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateBalls);
      }
    });
  } else {
    // Fallback: if overlay missing, start automatically
    isRunning = true;
    animationFrameId = requestAnimationFrame(updateBalls);
  }

  // Pause/Resume logic
  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      if (isRunning) {
        // Pause game
        isRunning = false;
        pauseBtn.textContent = "Resume";
        // Show overlay as pause screen
        if (playOverlay) {
          playOverlay.classList.remove("hidden");
          const h2 = playOverlay.querySelector("h2");
          const p = playOverlay.querySelector("p");
          const btn = playOverlay.querySelector("#start-game");
          if (h2) h2.textContent = "Paused";
          if (p) p.textContent = "Tap Resume to continue";
          if (btn) btn.textContent = "Resume";
          if (btn) {
            // Make overlay button also resume
            const resumeHandler = () => {
              isRunning = true;
              pauseBtn.textContent = "Pause";
              playOverlay.classList.add("hidden");
            };
            btn.addEventListener("click", resumeHandler, { once: true });
          }
        }
      } else {
        // Resume game
        isRunning = true;
        pauseBtn.textContent = "Pause";
        if (playOverlay) playOverlay.classList.add("hidden");
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updateBalls);
        }
      }
    });
  }

  // New Game button logic
  if (newGameBtn) {
    newGameBtn.addEventListener("click", () => {
      resetGame();
    });
  }
});
