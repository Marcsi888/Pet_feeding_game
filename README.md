# Pet_feeding_game
This is a quick 1-2 hours long project that showcases basic game design skills. Designed as a desktop game, utilizing HTML, CSS and JavaScript.

## Overview
A simple browser-based arcade game where players catch falling treats to feed their chosen pet. The goal is to maintain your pet's happiness by catching food items while avoiding bombs and collecting power-ups.

## Features
- Choose from 3 different pets (Cat, Bunny, Panda)

- 3 game modes: Classic, Challenge, and Zen

- Power-up system with 5 different abilities
- Particle effects and smooth animations
- High score tracking with localStorage
- Responsive design for different screen sizes
## How to Play
- Select your pet and game mode
- Use arrow keys to move the basket
- Catch falling treats to feed your pet and earn points
- Avoid bombs that reduce your avatar's(the previously selected pet's) happiness
- Collect power-ups for temporary abilities
- Keep your pet's happiness above 0 to continue playing
## Structure behind: 
- HTML5 Canvas - Game rendering
- Vanilla JavaScript - Game logic and mechanics
- CSS3 - Styling and animations
- Tailwind CSS - Utility styling framework
  
File Structure

├── index.html          # Main game interface

├── css/

│   ├── styles.css      # Core styling

│   └── animations.css  # Animation effects

├── js/

│   ├── utils.js        # Utility functions

│   ├── particles.js    # Visual effects

│   ├── game.js         # Game logic

│   └── main.js         # Application controller

└── serve.py           # Development server

## Quick Start
bash
# Clone or download the repository
# Start the development server
python3 serve.py

# Open browser to http://localhost:8000
Alternatively, simply open index.html in your web browser.

## Game Controls
Arrow Keys/A/D:  movement controls for the basket
ESC: Pause/Resume game
## Development and Techniques Used
Built using vanilla web technologies without external frameworks, demonstrating:

Canvas-based 2D rendering

Real-time collision detection

Object-oriented JavaScript design

Responsive CSS layouts

Local storage integration

The game runs at 60 FPS using requestAnimationFrame and implements efficient particle systems for visual feedback.
## Happiness System

The pet happiness mechanic is the core gameplay driver that creates tension and urgency:

- Starting Value: 100% happiness at game start
- Passive Decay: Happiness decreases over time (0.5-1.1 per second based on level)
- Treat Rewards: +5 happiness per treat caught
- Bomb Penalties: -20 happiness when hit by bombs (unless shielded)
- Game Over Condition: Game ends when happiness reaches 0%

### Design Philosophy Behind "Happiness" :

The happiness system creates a risk-reward dynamic where players must balance aggressive treat catching (for points) with careful bomb avoidance (for survival). The increasing decay rate with levels ensures escalating difficulty without relying solely on speed increases.

### Technological Implementation and the Structuring of the Happiness System

The happiness system is implemented using JavaScript timers and state management:

javascript//
Happiness decay timer (runs every 60 frames = ~1 second at 60 FPS)

updateHappiness() {

    if (this.happinessTimer >= 60) {
    
        const decay = 0.5 + this.level * 0.1;  // Increases with level
        
        this.happiness = Math.max(0, this.happiness - decay);
        
        this.happinessTimer = 0;
        
        
        if (this.happiness <= 0) {
        
            this.endGame();  // Trigger game over
            
        }
        
    }
    
}


// Treat collection increases happiness

collectTreat(treat) {

    this.happiness = Math.min(100, this.happiness + 5);  // Cap at 100%
    
}

// Bomb collision decreases happiness

hitBomb() {

    if (this.activePowerUp !== 'shield') {
    
        this.happiness = Math.max(0, this.happiness - 20);  // Floor at 0%
        
    }
    
}





