# Ball Chase Challenge 🎯

A fun, interactive browser-based game where players click bouncing balls to score points. Features multiple difficulty levels, smooth animations, and responsive design.

![Ball Chase Challenge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎮 Demo

[Play the game here](#) _(Add your deployment link)_

## ✨ Features

- **Multiple Difficulty Levels**: Choose between Easy, Medium, and Hard modes
  - Easy: Larger, slower balls
  - Medium: Medium-sized balls with moderate speed
  - Hard: Smaller, faster balls for an extra challenge
- **Score Tracking**: Real-time score updates with high score persistence using localStorage
- **Game Controls**:
  - Start/Pause/Resume functionality
  - New Game option to restart anytime
  - Reset high score with confirmation modal
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Sound Effects**: Click sound feedback for ball interactions
- **Smooth Animations**: Optimized using requestAnimationFrame for 60fps gameplay
- **Modern UI**: Glass-morphism design with gradient backgrounds

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ball-chase-challenge.git
```

2. Navigate to the project directory:
```bash
cd ball-chase-challenge
```

3. Open `index.html` in your web browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

Or simply double-click the `index.html` file.

## 🎯 How to Play

1. Click the **Start** button to begin
2. Click on the bouncing balls to score points
3. Each click adds 1 point to your score
4. Balls change direction and speed slightly when clicked
5. Try to beat your high score!
6. Use the **Pause** button to take a break
7. Click **New Game** to restart at any time
8. Challenge yourself with different difficulty levels

## 📁 Project Structure

```
ball-chase-challenge/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── game.js             # Game logic and mechanics
├── sounds/             # Sound effects directory
│   └── click.mp3       # Click sound effect
├── favicon.png         # Game favicon (if available)
└── README.md           # Project documentation
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Advanced styling with:
  - Flexbox layouts
  - CSS animations and transitions
  - Glass-morphism effects
  - Responsive design
- **Vanilla JavaScript**: 
  - DOM manipulation
  - Event handling
  - requestAnimationFrame for smooth animations
  - localStorage for data persistence

## 🎨 Key Features Implementation

### Ball Physics
- Collision detection with boundary walls
- Dynamic velocity calculations
- Smooth position updates using transform properties

### Difficulty System
- Dynamic ball sizing and speed adjustments
- Score reset on difficulty change
- Visual feedback for selected difficulty

### State Management
- Game states: Start, Running, Paused
- Persistent high score using localStorage
- Confirmation modals for destructive actions

## 🌐 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 📱 Mobile Support

Fully optimized for touch devices with:
- Touch event handling
- Responsive layout
- Tap highlight removal for better UX
- Mobile-friendly controls

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Portfolio: [your-portfolio-link](#)

## 🙏 Acknowledgments

- Font: [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts
- Sound effects: Click sound for ball interaction
- Inspired by classic arcade games

## 📈 Future Enhancements

- [ ] Add power-ups and special balls
- [ ] Implement timer mode
- [ ] Add multiplayer support
- [ ] Create leaderboard system
- [ ] Add more sound effects and background music
- [ ] Implement different game modes
- [ ] Add particle effects on ball clicks

---

⭐ Star this repository if you enjoyed the game!
