
/**
 * This file I create to handle then main game logic
 */

class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }

    update() {
    }

    draw(ctx) {
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    checkCollision(other) {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();
        return Utils.rectCollision(
            bounds1.x, bounds1.y, bounds1.width, bounds1.height,
            bounds2.x, bounds2.y, bounds2.width, bounds2.height
        );
    }
}

class Treat extends GameObject {
    constructor(x, y, type, points, isSpecial = false) {
        super(x, y, 30, 30);
        this.type = type;
        this.points = points;
        this.isSpecial = isSpecial;
        this.emoji = this.getEmoji();
        this.animationOffset = Math.random() * Math.PI * 2;
    }

    getEmoji() {
        const treatEmojis = ['🍎', '🍌', '🍓', '🥕', '🍪', '🍇', '🍑', '🥭', '🍍', '🥝'];
        return treatEmojis[this.type % treatEmojis.length];
    }

    update(speed) {
        this.y += speed;
        this.animationOffset += 0.1;
        
        // Remove if off screen
        if (this.y > 550) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Special treats sparkle  effect -> differentiating between elements
        // adding isSpecial property for higher complexity
        if (this.isSpecial) {
            const sparkleOffset = Math.sin(this.animationOffset * 3) * 2;
            ctx.translate(sparkleOffset, sparkleOffset);
            CanvasUtils.drawEmoji(ctx, '✨', this.x - 10, this.y, 20);
            CanvasUtils.drawEmoji(ctx, '✨', this.x + 40, this.y, 20);
        }
        
        // Float animation
        const floatOffset = Math.sin(this.animationOffset) * 3;
        CanvasUtils.drawEmoji(ctx, this.emoji, this.x + 15, this.y + 15 + floatOffset, 30);
        
        ctx.restore();
    }
}

class PowerUp extends GameObject {
    constructor(x, y, type) {
        super(x, y, 30, 30);
        this.type = type;
        this.emoji = this.getEmoji();
        this.animationOffset = Math.random() * Math.PI * 2;
    }

    getEmoji() {
        const powerUpEmojis = {
            speed: '⚡',
            magnet: '🌟',
            double: '💎',
            shield: '🔥',
            freeze: '❄️'
        };
        return powerUpEmojis[this.type] || '⭐';
    }

    update(speed) {
        this.y += speed;
        this.animationOffset += 0.15;
        
        if (this.y > 550) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Bounce animation for power-ups
        // will create this popular bouncing effect when power up was collected-> activate
        const bounceOffset = Math.abs(Math.sin(this.animationOffset)) * 10;
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFD700';
        
        CanvasUtils.drawEmoji(ctx, this.emoji, this.x + 15, this.y + 15 - bounceOffset, 30);
        
        ctx.restore();
    }
}

class Bomb extends GameObject {
    constructor(x, y) {
        super(x, y, 30, 30);
        this.emoji = '💣';
        this.animationOffset = Math.random() * Math.PI * 2;
    }

    update(speed) {
        this.y += speed;
        this.animationOffset += 0.2;
        
        if (this.y > 550) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Shake animation
        // applying shakeX and shakeY since Math element reqquires both vertical and horizontal movement
        // will create this popular shake effect  for bomb-> bomb means danger
        // adding shakeX and shakeY properties for higher complexity

        const shakeX = Math.sin(this.animationOffset * 10) * 2;
        const shakeY = Math.cos(this.animationOffset * 12) * 2;
    
        // Warning glow
        // will create this popular warning glow effect when bomb was collected-> activate
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF4444';
        
        CanvasUtils.drawEmoji(ctx, this.emoji, this.x + 15 + shakeX, this.y + 15 + shakeY, 30);
        
        ctx.restore();
    }
}

class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 60, 60);
        this.emoji = '🧺';
        this.targetX = x;
        this.speed = 20;
        this.magneticRange = 50;
    }

    update(activePowerUp) {
        // Smooth movement to target
        const diff = this.targetX - this.x;
        this.x += diff * 0.3;
        
        // Update appearance based on power-up
        if (activePowerUp === 'shield') {
            this.emoji = '🛡️';
        } else {
            this.emoji = '🧺';
        }
        
        // Update magnetic range
        this.magneticRange = activePowerUp === 'magnet' ? 100 : 50;
    }

    moveTo(x) {
        this.targetX = Utils.clamp(x, 0, 340);
    }

    draw(ctx) {
        ctx.save();
        
        // Power-up effects
        if (this.emoji === '🛡️') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FF6B6B';
        }
        
        CanvasUtils.drawEmoji(ctx, this.emoji, this.x + 30, this.y + 30, 50);
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.magneticRange * 2,
            height: this.height
        };
    }
}

class Pet {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.mood = 'happy';
        this.animationOffset = Math.random() * Math.PI * 2;
        this.petData = this.getPetData();
    }

    getPetData() {
        const pets = {
            cat: { happy: '😸', neutral: '😺', sad: '😿', name: 'Kitty' },
            dog: { happy: '😊', neutral: '🐕', sad: '😢', name: 'Puppy' },
            bunny: { happy: '🐰', neutral: '🐰', sad: '😰', name: 'Bunny' },
            panda: { happy: '🐼', neutral: '🐼', sad: '😭', name: 'Panda' }
        };
        return pets[this.type] || pets.cat;
    }

    update(happiness) {
        this.animationOffset += 0.1;
        
        // Update mood based on happiness
        // how I determine mood based on happiness?
        // happiness is a specific val that can be in between 0 and 100
        // if happiness is above 70, pet is happy, if between 40 and 70, pet is neutral, below 40, pet is sad
        if (happiness > 70) {
            this.mood = 'happy';
        } else if (happiness > 40) {
            this.mood = 'neutral';
        } else {
            this.mood = 'sad';
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Animation based on mood
        // will create this popular animation effect when pet is happy, neutral or sad
        // adding offsetY property for higher complexity
        // I will use Math.sin to create a floating effect for happy and sad moods
        // differentiating between happy, neutral and sad moods based on the mood property assigned according to
        // how the happiness value was set
        // happy mood will float up and down, sad mood will float down slowly, neutral will stay still

        let offsetY = 0;
        if (this.mood === 'happy') {
            offsetY = Math.abs(Math.sin(this.animationOffset * 2)) * 10;
        } else if (this.mood === 'sad') {
            offsetY = Math.sin(this.animationOffset * 8) * 2;
        }
        
        CanvasUtils.drawEmoji(ctx, this.petData[this.mood], this.x, this.y - offsetY, 60);
        
        // Draw mood text
        const moodText = {
            happy: '💕 So Happy! 💕',
            neutral: '🤔 Getting Hungry...',
            sad: '😢 I am STARVING, Please HELP!'
        };
        
        CanvasUtils.drawText(ctx, moodText[this.mood], this.x, this.y + 40, 14, '#7c3aed', 'white', 1);
        
        ctx.restore();
    }
}

class Game {
    constructor(options = {}) {
        this.mode = options.mode || 'classic';
        this.petType = options.pet || 'cat';
        this.onGameOver = options.onGameOver || (() => {});
        this.onScoreUpdate = options.onScoreUpdate || (() => {});
        
        // Game constants
        this.CANVAS_WIDTH = 400;
        this.CANVAS_HEIGHT = 500;
        this.BASE_SPEED = 2;
        
        // Initialize game state
        this.initializeGame();
        this.setupCanvas();
        this.bindEvents();
    }

    initializeGame() {
        // Game statement defined 

        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.happiness = 100;
        this.combo = 0;
        this.maxCombo = 0;
        this.treatsCollected = 0;
        
        // Power-up system
        // adding the predefined powerup system to the game
        this.activePowerUp = null;
        this.powerUpTimer = 0;
        this.powerUpDuration = 300; // 5 seconds at 60fps
        
        // Game objects 
        // adding the predefined game objects to the game
        // player, pet, treats, power-ups, bombs
        // adding the player, pet, treats, power-ups and bombs to the game

        this.player = new Player(170, 440);
        this.pet = new Pet(this.petType, 200, 80);
        this.treats = [];
        this.powerUps = [];
        this.bombs = [];
        
        // Particle system
        this.particles = new ParticleSystem();
        
        // Timers
        this.treatTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.bombSpawnTimer = 0;
        this.happinessTimer = 0;
        
        // Input state
        this.keys = {};
        this.mouseX = 200;
    }

    setupCanvas() {
        this.canvas = DOM.get('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });
    }

    bindEvents() {
        // updating game title
        DOM.setText('game-title', `Feed ${this.pet.petData.name}!`);
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
        DOM.show('pause-game');
        console.log(`🎮 Game started in ${this.mode} mode with ${this.petType}`);
    }

    gameLoop() {
        if (!this.isRunning) return;
        
        if (!this.isPaused) {
            this.update();
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // updating game objects
        this.updatePlayer();
        this.updateGameObjects();
        this.updatePowerUps();
        this.updateTimers();
        this.checkCollisions();
        this.spawnObjects();
        this.updateUI();
        this.updateLevel();
        this.updateHappiness();
        this.particles.update();
        
        if (this.happiness <= 0) {
            this.endGame();
        }
    }

    updatePlayer() {
        // Keyboard controls
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.moveTo(this.player.targetX - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.moveTo(this.player.targetX + this.player.speed);
        }
        
        // Mouse controls
        this.player.moveTo(this.mouseX - 30);
        
        this.player.update(this.activePowerUp);
    }

    updateGameObjects() {
        const speed = this.getCurrentSpeed();
        
        // Update treats
        this.treats = this.treats.filter(treat => {
            treat.update(speed);
            return treat.active;
        });
        
        // Update power-ups
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.update(speed);
            return powerUp.active;
        });
        
        // Update bombs
        this.bombs = this.bombs.filter(bomb => {
            bomb.update(speed);
            return bomb.active;
        });
        
        // Update pet
        this.pet.update(this.happiness);
    }

    updatePowerUps() {
        if (this.powerUpTimer > 0) {
            this.powerUpTimer--;
            
            // Update power-up UI
            const percentage = (this.powerUpTimer / this.powerUpDuration) * 100;
            DOM.get('powerup-timer').style.width = `${percentage}%`;
            
            if (this.powerUpTimer <= 0) {
                this.activePowerUp = null;
                DOM.hide('powerup-indicator');
            }
        }
    }

    updateTimers() {
        this.treatTimer++;
        this.powerUpSpawnTimer++;
        this.bombSpawnTimer++;
        this.happinessTimer++;
    }

    spawnObjects() {
        const treatSpawnRate = Math.max(60 - this.level * 3, 20);
        const powerUpSpawnRate = 300;
        const bombSpawnRate = this.level >= 3 ? 180 : 999999;
        
        // Spawn treats
        if (this.treatTimer >= treatSpawnRate) {
            this.spawnTreat();
            this.treatTimer = 0;
        }
        
        // Spawn power-ups
        if (this.powerUpSpawnTimer >= powerUpSpawnRate) {
            this.spawnPowerUp();
            this.powerUpSpawnTimer = 0;
        }
        
        // Spawn bombs (only in higher levels)
        if (this.bombSpawnTimer >= bombSpawnRate) {
            this.spawnBomb();
            this.bombSpawnTimer = 0;
        }
    }

    spawnTreat() {
        const x = Utils.random(0, this.CANVAS_WIDTH - 30);
        const type = Utils.randomInt(0, 9);
        const points = Utils.randomInt(1, 3) + this.level;
        const isSpecial = Math.random() < 0.1; // 10% chance
        
        this.treats.push(new Treat(x, -30, type, points, isSpecial));
    }

    spawnPowerUp() {
        if (Math.random() < 0.3) { // 30% chance
            const x = Utils.random(0, this.CANVAS_WIDTH - 30);
            const types = ['speed', 'magnet', 'double', 'shield', 'freeze'];
            const type = types[Utils.randomInt(0, types.length - 1)];
            
            this.powerUps.push(new PowerUp(x, -30, type));
        }
    }

    spawnBomb() {
        if (Math.random() < 0.15) { // 15% chance
            const x = Utils.random(0, this.CANVAS_WIDTH - 30);
            this.bombs.push(new Bomb(x, -30));
        }
    }

    checkCollisions() {
        // Treat collisions
        this.treats.forEach((treat, index) => {
            if (treat.checkCollision(this.player)) {
                this.collectTreat(treat);
                this.treats.splice(index, 1);
            }
        });
        
        // Power-up collisions
        this.powerUps.forEach((powerUp, index) => {
            if (powerUp.checkCollision(this.player)) {
                this.collectPowerUp(powerUp);
                this.powerUps.splice(index, 1);
            }
        });
        
        // Bomb collisions
        this.bombs.forEach((bomb, index) => {
            if (bomb.checkCollision(this.player)) {
                this.hitBomb(bomb);
                this.bombs.splice(index, 1);
            }
        });
    }

    collectTreat(treat) {
        const basePoints = treat.points * 10;
        const comboBonus = Math.floor(this.combo * 0.1);
        const powerUpMultiplier = this.activePowerUp === 'double' ? 2 : 1;
        const specialMultiplier = treat.isSpecial ? 2 : 1;
        
        const points = (basePoints + comboBonus) * powerUpMultiplier * specialMultiplier;
        
        this.score += points;
        this.happiness = Math.min(100, this.happiness + treat.points * 2);
        this.combo++;
        this.treatsCollected++;
        
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        // Create particle effect
        this.particles.createTreatEffect(treat.x + 15, treat.y + 15, treat.isSpecial);
        
        this.onScoreUpdate(this.score);
    }

    collectPowerUp(powerUp) {
        this.activePowerUp = powerUp.type;
        this.powerUpTimer = this.powerUpDuration;
        
        // Show power-up UI
        const descriptions = {
            speed: 'Super Speed! ⚡',
            magnet: 'Magnetic Basket! 🌟',
            double: 'Double Points! 💎',
            shield: 'Bomb Shield! 🔥',
            freeze: 'Slow Motion! ❄️'
        };
        
        DOM.setText('powerup-text', descriptions[powerUp.type]);
        DOM.show('powerup-indicator');
        
        // Create particle effect
        this.particles.createPowerUpEffect(powerUp.x + 15, powerUp.y + 15, powerUp.type);
    }

    hitBomb(bomb) {
        if (this.activePowerUp !== 'shield') {
            this.happiness = Math.max(0, this.happiness - 20);
            this.combo = 0;
            
            // Screen shake effect could be added here
            this.particles.createBombEffect(bomb.x + 15, bomb.y + 15);
        }
    }

    getCurrentSpeed() {
        let speed = this.BASE_SPEED + (this.level - 1) * 0.5;
        
        // Mode modifications
        if (this.mode === 'challenge') {
            speed *= 1.5;
        } else if (this.mode === 'zen') {
            speed *= 0.7;
        }
        
        // Power-up modifications
        if (this.activePowerUp === 'freeze') {
            speed *= 0.3;
        }
        
        return speed;
    }

    updateLevel() {
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.particles.createLevelUpEffect(200, 250);
        }
    }

    updateHappiness() {
        if (this.happinessTimer >= 60) { // Every second
            const decay = 0.5 + this.level * 0.1;
            this.happiness = Math.max(0, this.happiness - decay);
            this.happinessTimer = 0;
        }
    }

    updateUI() {
        DOM.setText('score', Utils.formatNumber(this.score));
        DOM.setText('level', this.level);
        DOM.setText('combo', this.combo);
        
        const happinessElement = DOM.get('happiness');
        const happinessPercent = Math.round(this.happiness);
        DOM.setText('happiness', `${happinessPercent}%`);
        
        // Update happiness color
        if (this.happiness > 50) {
            happinessElement.className = 'text-lg text-green-600';
        } else {
            happinessElement.className = 'text-lg text-red-600';
        }
    }

    draw() {
        // Clear canvas
        CanvasUtils.clear(this.ctx, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.CANVAS_HEIGHT);
        gradient.addColorStop(0, '#dbeafe');
        gradient.addColorStop(1, '#bbf7d0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        
        // Draw game objects
        this.pet.draw(this.ctx);
        this.treats.forEach(treat => treat.draw(this.ctx));
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        this.bombs.forEach(bomb => bomb.draw(this.ctx));
        this.player.draw(this.ctx);
        
        // Draw particles
        this.particles.draw(this.ctx);
        
        // Draw pause overlay
        if (this.isPaused) {
            this.drawPauseOverlay();
        }
    }

    drawPauseOverlay() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        
        CanvasUtils.drawText(this.ctx, '⏸️ PAUSED', 200, 200, 40, 'white', 'black', 3);
        CanvasUtils.drawText(this.ctx, 'Press ESC or click Pause to resume', 200, 250, 16, 'white', 'black', 1);
        
        this.ctx.restore();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            DOM.setText('pause-game', '▶️ Resume');
        } else {
            DOM.setText('pause-game', '⏸️ Pause');
        }
    }

    handleKeyDown(e) {
        this.keys[e.code] = true;
        
        // Prevent default for arrow keys
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        this.keys[e.code] = false;
    }

    endGame() {
        this.isRunning = false;
        DOM.hide('pause-game');
        
        const stats = {
            score: this.score,
            level: this.level,
            maxCombo: this.maxCombo,
            treatsCollected: this.treatsCollected,
            petMood: this.pet.mood
        };
        
        this.onGameOver(stats);
    }

    destroy() {
        this.isRunning = false;
        this.particles.clear();
        
        // remove the event listeners-> not necessary anymore
        // preventing memory leaks
        // removing the event listeners from the canvas
        
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', () => {});
        }
    }
}

// Exporting classes for global acces in other files
window.Game = Game;
window.GameObject = GameObject;
window.Treat = Treat;
window.PowerUp = PowerUp;
window.Bomb = Bomb;
window.Player = Player;
window.Pet = Pet;
