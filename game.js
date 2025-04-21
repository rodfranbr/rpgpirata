// Variáveis globais
const gameState = {
    playerGold: 1000,
    isExploring: false,
    currentCountdown: 0
};

// Controlador de temporizadores - evita memory leaks
const timers = {
    exploration: null,
    event: null,
    navigation: null,
    message: null,
    clearAll() {
        Object.entries(this).forEach(([key, timer]) => {
            if (key !== 'clearAll' && timer !== null) {
                clearInterval(timer);
                clearTimeout(timer);
                this[key] = null;
            }
        });
    }
};

// Recursos de imagens
const resources = {
    explorationImages: [...Array(7)].map((_, i) => 
        `https://raw.githubusercontent.com/rodfranbr/rpgpirata/refs/heads/main/navegando000${i+1}.jpeg`)
};

// Seletores DOM cacheados - acesso mais rápido
const DOM = {
    goldDisplay: document.getElementById('gold-display'),
    consoleElement: document.getElementById('console'),
    actionButtons: document.getElementById('action-buttons'),
    timerDisplay: document.getElementById('timer-display'),
    gameImage: document.getElementById('game-image'),
    loadingOverlay: document.getElementById('loading-overlay'),
    gameContainer: document.getElementById('game-container'),
    exploreButton: document.getElementById('explore-button')
};

// Sistema de armazenamento - Salvar/Carregar
const saveSystem = {
    save(immediate = false) {
        try {
            const currentState = {
                gold: gameState.playerGold,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('pirateRPGSave', JSON.stringify(currentState));
        } catch (e) { 
            console.error('Erro ao salvar: ', e); 
        }
    },
    
    load() {
        try {
            const saved = localStorage.getItem('pirateRPGSave');
            if (saved) {
                const data = JSON.parse(saved);
                gameState.playerGold = data.gold;
                uiManager.updateGoldDisplay();
                uiManager.logMessage(`Jogo carregado! Última jogada: ${new Date(data.lastSaved).toLocaleString()}`);
            }
        } catch (e) { 
            console.error('Erro ao carregar: ', e); 
        }
    }
};

// Gerenciador de UI e exibição
const uiManager = {
    updateGoldDisplay() {
        DOM.goldDisplay.textContent = `${gameState.playerGold} ouros`;
        DOM.goldDisplay.classList.remove('gold-gained', 'damage-taken');
        void DOM.goldDisplay.offsetWidth;
    },
    
    updateGoldWithAnimation(amount) {
        gameState.playerGold += amount;
        this.updateGoldDisplay();
        DOM.goldDisplay.classList.add(amount > 0 ? 'gold-gained' : amount < 0 ? 'damage-taken' : '');
        saveSystem.save(true);
    },
    
    logMessage(message, isEventTitle = false) {
        const p = document.createElement('p');
        if (isEventTitle) p.classList.add('event-title');
        p.innerHTML = message;
        DOM.consoleElement.appendChild(p);
        DOM.consoleElement.scrollTop = DOM.consoleElement.scrollHeight;
    },
    
    updateTimerDisplay() {
        DOM.timerDisplay.textContent = `${Math.floor(gameState.currentCountdown / 60)}:${(gameState.currentCountdown % 60).toString().padStart(2, '0')}`;
    },
    
    preloadImages() {
        const uniqueImages = new Set([
            ...resources.explorationImages,
            ...events.flatMap(event => {
                const imgs = event.images || [];
                event.actions.forEach(action => {
                    if (action.image) imgs.push(action.image);
                    if (action.result) {
                        const r = action.result;
                        ['image', 'treasureImage', 'emptyChestImage', 
                         'noTreasureImage', 'successImage', 'failureImage']
                            .forEach(prop => { if (r[prop]) imgs.push(r[prop]); });
                    }
                });
                return imgs;
            })
        ]);
        
        uniqueImages.forEach(src => new Image().src = src);
    }
};

// Controlador de exploração
const explorationController = {
    start() {
        if (gameState.playerGold < 10) {
            return uiManager.logMessage("Você não tem ouro suficiente para explorar! (custo: 10 ouros)");
        }
        
        uiManager.updateGoldWithAnimation(-10);
        DOM.actionButtons.innerHTML = '';
        
        const stopButton = document.createElement('button');
        stopButton.textContent = "Parar Exploração";
        stopButton.addEventListener('click', () => this.stop());
        DOM.actionButtons.appendChild(stopButton);
        
        gameState.isExploring = true;
        uiManager.logMessage("Seu navio zarpou em busca de aventuras! A cada 60 segundos, algo poderá acontecer...");
        
        this.rotateNavigationImages();
        timers.exploration = setInterval(() => eventController.checkForEvent(), 60000);
        timers.message = setInterval(() => this.showRandomNavigationMessage(), 10000);
    },
    
    stop() {
        if (!gameState.isExploring) return;
        
        timers.clearAll();
        gameState.isExploring = false;
        
        DOM.actionButtons.innerHTML = '';
        const exploreBtn = document.createElement('button');
        exploreBtn.id = 'explore-button';
        exploreBtn.innerHTML = `INICIAR Exploração Marítima (custo: <span class="gold-cost">10 ouros</span>)`;
        exploreBtn.addEventListener('click', () => this.start());
        DOM.actionButtons.appendChild(exploreBtn);
        
        uiManager.logMessage("Você interrompeu sua exploração e retornou ao porto.");
        DOM.timerDisplay.textContent = '';
        saveSystem.save();
    },
    
    rotateNavigationImages() {
        if (!gameState.isExploring) return;
        DOM.gameImage.src = resources.explorationImages[Math.floor(Math.random() * resources.explorationImages.length)];
        timers.navigation = setTimeout(() => this.rotateNavigationImages(), 5000);
    },
    
    showRandomNavigationMessage() {
        if (!gameState.isExploring || document.querySelector('#action-buttons button').textContent !== "Parar Exploração") return;
        uiManager.logMessage(navigationMessages[Math.floor(Math.random() * navigationMessages.length)]);
    },
    
    resetToExploration() {
        DOM.actionButtons.innerHTML = '';
        
        const continueButton = document.createElement('button');
        continueButton.textContent = "Continuar Exploração";
        continueButton.addEventListener('click', () => {
            uiManager.logMessage("Sua tripulação está descansada e pronta para continuar a exploração!");
            
            DOM.actionButtons.innerHTML = '';
            const stopButton = document.createElement('button');
            stopButton.textContent = "Parar Exploração";
            stopButton.addEventListener('click', () => this.stop());
            DOM.actionButtons.appendChild(stopButton);
            
            timers.exploration = setInterval(() => eventController.checkForEvent(), 60000);
            this.rotateNavigationImages();
        });
        DOM.actionButtons.appendChild(continueButton);
        
        const returnButton = document.createElement('button');
        returnButton.textContent = "Retornar ao Porto";
        returnButton.addEventListener('click', () => {
            gameState.isExploring = false;
            uiManager.logMessage("Você decidiu retornar ao porto após sua aventura.");
            
            DOM.actionButtons.innerHTML = '';
            const exploreBtn = document.createElement('button');
            exploreBtn.id = 'explore-button';
            exploreBtn.innerHTML = `INICIAR Exploração Marítima (custo: <span class="gold-cost">10 ouros</span>)`;
            exploreBtn.addEventListener('click', () => this.start());
            DOM.actionButtons.appendChild(exploreBtn);
            
            saveSystem.save();
        });
        DOM.actionButtons.appendChild(returnButton);
    }
};

// Controlador de eventos
const eventController = {
    checkForEvent() {
        if (!gameState.isExploring) return;
        
        if (Math.random() * 100 <= 10) {
            this.determineEvent();
        } else {
            uiManager.logMessage("Nada de interessante no horizonte. A jornada continua...");
        }
    },
    
    determineEvent() {
        const roll = Math.random() * 100;
        const totalChance = events.reduce((sum, e) => sum + e.chance, 0);
        
        let threshold = 0;
        for (const event of events) {
            threshold += (event.chance / totalChance) * 100;
            if (roll <= threshold) {
                this.triggerEvent(event);
                return;
            }
        }
    },
    
    triggerEvent(event) {
        clearInterval(timers.exploration);
        
        uiManager.logMessage(event.title, true);
        uiManager.logMessage(event.descriptions[Math.floor(Math.random() * event.descriptions.length)]);
        
        if (event.images && event.images.length) {
            DOM.gameImage.src = event.images[Math.floor(Math.random() * event.images.length)];
        }
        
        DOM.actionButtons.innerHTML = '';
        
        event.actions.forEach(action => {
            const button = document.createElement('button');
            button.innerHTML = `${action.name} ${action.cost > 0 ? `(custo: <span class="gold-cost">${action.cost} ouros</span>)` : ''}`;
            
            if (action.cost > gameState.playerGold) {
                button.disabled = true;
                button.title = "Ouro insuficiente";
            }
            
            button.addEventListener('click', () => this.executeAction(action, event));
            DOM.actionButtons.appendChild(button);
        });
    },
    
    executeAction(action, parentEvent) {
        if (action.cost > 0) {
            uiManager.updateGoldWithAnimation(-action.cost);
            uiManager.logMessage(`Você gastou <span class="gold-cost">${action.cost} ouros</span> para ${action.name.toLowerCase()}.`);
        }
        
        DOM.actionButtons.innerHTML = '';
        if (action.image) DOM.gameImage.src = action.image;
        
        this.startCountdown(action.duration, () => this.processActionResult(action, parentEvent));
        uiManager.logMessage(action.startMessage || `Aguarde enquanto ${action.name.toLowerCase()}...`);
    },
    
    startCountdown(seconds, callback) {
        gameState.currentCountdown = seconds;
        uiManager.updateTimerDisplay();
        
        timers.event = setInterval(() => {
            gameState.currentCountdown--;
            uiManager.updateTimerDisplay();
            
            if (gameState.currentCountdown <= 0) {
                clearInterval(timers.event);
                timers.event = null;
                DOM.timerDisplay.textContent = '';
                callback();
            }
        }, 1000);
    },
    
    processActionResult(action, parentEvent) {
        const result = this.calculateResult(action);
        
        if (result.gold !== 0) {
            uiManager.updateGoldWithAnimation(result.gold);
            const goldMessage = result.gold > 0 
                ? `Você ganhou <span class="highlight">+${result.gold} ouros</span>!` 
                : `Você perdeu <span class="highlight">${Math.abs(result.gold)} ouros</span>!`;
            uiManager.logMessage(goldMessage);
        }
        
        uiManager.logMessage(result.message);
        if (result.image) DOM.gameImage.src = result.image;
        
        explorationController.resetToExploration();
        
        if (result.gold > 100) {
            DOM.consoleElement.classList.add('treasure-found');
            setTimeout(() => DOM.consoleElement.classList.remove('treasure-found'), 3000);
        }
        
        if (parentEvent.id === 'tempestade') {
            DOM.gameContainer.classList.add('storm-active');
            setTimeout(() => DOM.gameContainer.classList.remove('storm-active'), 3000);
        }
    },
    
    calculateResult(action) {
        const roll = Math.random() * 100;
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        let resultObj = { gold: 0, message: "Nada aconteceu.", image: null };
        
        if (action.result) {
            if (action.result.type === 'chance') {
                if (roll <= action.result.successChance) {
                    resultObj.gold = randomInt(action.result.successGoldMin, action.result.successGoldMax);
                    resultObj.message = action.result.successMessage;
                    resultObj.image = action.result.successImage;
                } else {
                    if (action.result.failureGoldPercent) {
                        const lossPercent = randomInt(action.result.failureGoldPercent.min, action.result.failureGoldPercent.max);
                        resultObj.gold = -Math.floor(gameState.playerGold * (lossPercent / 100));
                    } else if (action.result.failureGoldMin !== undefined) {
                        resultObj.gold = -randomInt(action.result.failureGoldMin, action.result.failureGoldMax);
                    }
                    resultObj.message = action.result.failureMessage;
                    resultObj.image = action.result.failureImage;
                }
            } else if (action.result.type === 'loot') {
                if (roll <= action.result.findChance) {
                    resultObj.gold = randomInt(action.result.goldMin, action.result.goldMax);
                    
                    if (resultObj.gold <= action.cost) {
                        resultObj.image = action.result.emptyChestImage;
                        resultObj.message = "Você encontrou um baú, mas ele contém pouco ouro. Mal cobre seus custos!";
                    } else {
                        resultObj.image = action.result.treasureImage;
                        resultObj.message = "Você encontrou um baú cheio de ouro! Sua sorte está lançada!";
                    }
                } else {
                    resultObj.gold = 0;
                    resultObj.image = action.result.noTreasureImage;
                    resultObj.message = "Você escavou bastante, mas não encontrou nenhum tesouro.";
                }
            } else if (action.result.type === 'resource') {
                resultObj.gold = randomInt(action.result.goldMin, action.result.goldMax);
                resultObj.message = action.result.message;
                resultObj.image = action.result.image;
            }
        }
        
        return resultObj;
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    saveSystem.load();
    uiManager.updateGoldDisplay();
    uiManager.preloadImages();
    
    setTimeout(() => {
        DOM.loadingOverlay.style.opacity = '0';
        setTimeout(() => DOM.loadingOverlay.style.display = 'none', 500);
    }, 2000);
    
    DOM.exploreButton.addEventListener('click', () => explorationController.start());
    setInterval(() => saveSystem.save(), 60000);
});
