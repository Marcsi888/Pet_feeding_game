/**
 * Main Application Controller for Super Pet Feeder Game
 */

console.log("🎮 Loading main.js...");

class GameApp {
    constructor() {
        console.log("🎮 App constructor called");
        this.currentScreen = 'loading';
        this.selectedPet = 'cat';
        this.init();
    }

    init() {
        console.log("🎮 App init called");
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        console.log('🎮 Super Pet Feeder - Initializing...');
        
        // Loading screen just for a bit-> it will simulate initlaization and then straight direct to the game
        setTimeout(() => {
            console.log("🎮 Hiding loading screen...");
            this.hideLoadingScreen();
            this.showMainMenu();
            this.setupEventListeners();
        }, 1500);
    }

    hideLoadingScreen() {
        console.log("🎮 Hiding loading screen");
        const loadingScreen = DOM.get('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showMainMenu() {
        console.log("🎮 Showing main menu");
        const mainMenu = DOM.get('main-menu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
        }
        this.currentScreen = 'menu';
        this.setupPetSelection();
        this.updateHighScoreDisplay();
    }

    setupPetSelection() {
        console.log("🎮 Setting up pet selection");
        const petContainer = DOM.get('pet-selection');
        if (!petContainer) {
            console.error("❌ Pet selection container was not successfully found!");
            return;
        }

        const petTypes = {
            cat: { emoji: '😸', name: 'Kitty' },
            bunny: { emoji: '🐰', name: 'Bunny' },
            panda: { emoji: '🐼', name: 'Panda' }
        };

        petContainer.innerHTML = '';

        Object.entries(petTypes).forEach(([key, pet]) => {
            const button = document.createElement('button');
            button.className = 'pet-button';
            button.dataset.pet = key;
            
            if (key === 'cat') {
                button.classList.add('selected');
            }
            
            button.innerHTML = `
                <div class="pet-emoji">${pet.emoji}</div>
                <div class="pet-name">${pet.name}</div>
            `;
            
            button.addEventListener('click', () => this.selectPet(key));
            petContainer.appendChild(button);
        });
    }

    selectPet(petType) {
        console.log("🎮 Selected pet:", petType);
        document.querySelectorAll('.pet-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        const selectedButton = document.querySelector(`[data-pet="${petType}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
        this.selectedPet = petType;
    }

    setupEventListeners() {
        console.log("🎮 Setting up event listeners");
        
        const classicBtn = DOM.get('classic-mode');
        const challengeBtn = DOM.get('challenge-mode');
        const zenBtn = DOM.get('zen-mode');
        const backBtn = DOM.get('back-to-menu');
        
        if (classicBtn) classicBtn.addEventListener('click', () => this.startGame('classic'));
        if (challengeBtn) challengeBtn.addEventListener('click', () => this.startGame('challenge'));
        if (zenBtn) zenBtn.addEventListener('click', () => this.startGame('zen'));
        if (backBtn) backBtn.addEventListener('click', () => this.backToMenu());
    }

    startGame(mode) {
        console.log(`🎮 Starting ${mode} mode`);
        
        // Hide main menu, show game screen
        DOM.hide('main-menu');
        DOM.show('game-screen');
        DOM.get('game-screen').style.display = 'flex';
        
        // Update game title
        DOM.setText('game-title', `Feed ${this.selectedPet}!`);
        
        // For now, just show the game screen - we'll add game logic later
        alert(`${mode} mode started! Game logic coming next...`);
    }

    backToMenu() {
        console.log("🎮 Back to menu");
        DOM.hide('game-screen');
        DOM.show('main-menu');
        DOM.get('main-menu').style.display = 'flex';
    }

    updateHighScoreDisplay() {
        console.log("🎮 Updating high score display");
        DOM.setText('high-score-display', '0');
        DOM.setText('total-treats-display', '0');
    }
}

// App initalized after the DOM loads
console.log("🎮 Setting up DOMContentLoaded listener");
window.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 DOM loaded, creating App");
    window.gameApp = new GameApp();
    console.log('🎮 Super Pet Feeder - Ready!');
});
