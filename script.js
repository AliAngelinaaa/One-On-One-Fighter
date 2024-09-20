// Global variables
let battleLog = "";
let turns = 0;
let moves = 0;
let playerTurn = true;
let cvar = 0;

// Player stats
let STRENGTH, CUNNING, SPEED, FATIGUE, oFATIGUE;

// Computer stats
let CSTRENGTH, CCUNNING, CSPEED, CFATIGUE, CoFATIGUE;

// Game values
let attackingd, defendingd, finishingd, cattackingd, cdefendingd, cfinishingd;

// DOM elements
const elements = {
    attackingOutput: null,
    defendingOutput: null,
    finishingMoveOutput: null,
    yourStrengthOutput: null,
    yourSpeedOutput: null,
    yourCunningOutput: null,
    yourFatigueOutput: null,
    youroriginalFatigueOutput: null,
    cattackingOutput: null,
    cdefendingOutput: null,
    cfinishingMoveOutput: null,
    computerStrengthOutput: null,
    computerSpeedOutput: null,
    computerFatigueOutput: null,
    computerCunningOutput: null,
    coriginalFatigueOutput: null,
    battleLogOutput: null,
    roundOutput: null,
    finishingMoveBtn: null
};

const getRandomInteger = (lower, upper) => {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

function initializeElements() {
    elements.attackingOutput = document.getElementById("attackingdd");
    elements.defendingOutput = document.getElementById("defendingdd");
    elements.finishingMoveOutput = document.getElementById("finishingdd");
    elements.yourStrengthOutput = document.getElementById("measuredSTRENGTH");
    elements.yourSpeedOutput = document.getElementById("measuredSPEED");
    elements.yourCunningOutput = document.getElementById("measuredCUNNING");
    elements.yourFatigueOutput = document.getElementById("measuredFATIGUE");
    elements.youroriginalFatigueOutput = document.getElementById("originalFATIGUE");
    elements.cattackingOutput = document.getElementById("cattackingdd");
    elements.cdefendingOutput = document.getElementById("cdefendingdd");
    elements.cfinishingMoveOutput = document.getElementById("cfinishingdd");
    elements.computerStrengthOutput = document.getElementById("measuredCSTRENGTH");
    elements.computerSpeedOutput = document.getElementById("measuredCSPEED");
    elements.computerFatigueOutput = document.getElementById("measuredCFATIGUE");
    elements.computerCunningOutput = document.getElementById("measuredCCUNNING");
    elements.coriginalFatigueOutput = document.getElementById("originalCFATIGUE");
    elements.battleLogOutput = document.getElementById("battleLog");
    elements.roundOutput = document.getElementById("turns");
    elements.finishingMoveBtn = document.getElementById("FMBtn");
}

function initialize() {
    // Reset game state
    battleLog = "";
    turns = 0;
    moves = 0;
    playerTurn = true;
    cvar = 0;

    // Generate player stats
    STRENGTH = 6 + getRandomInteger(-1, 1);
    CUNNING = 6 + getRandomInteger(-1, 1);
    SPEED = 6 + getRandomInteger(-1, 1);
    FATIGUE = 30 + getRandomInteger(-6, 6);
    oFATIGUE = FATIGUE;

    // Generate computer stats
    CSTRENGTH = 6 + getRandomInteger(-1, 1);
    CCUNNING = 6 + getRandomInteger(-1, 1);
    CSPEED = 6 + getRandomInteger(-1, 1);
    CFATIGUE = 30 + getRandomInteger(-6, 6);
    CoFATIGUE = CFATIGUE;

    // Initialize game values
    if (elements.finishingMoveBtn) {
        elements.finishingMoveBtn.disabled = true;
    }
    attackingd = 0;
    defendingd = 0;
    finishingd = STRENGTH + SPEED;
    cattackingd = 0;
    cdefendingd = 0;
    cfinishingd = CSPEED + CSTRENGTH;

    display();
}

function makeComputerMove() {
    if (!playerTurn) {
        cvar = getRandomInteger(1, 3);

        if (cvar === 3 && (CFATIGUE > FATIGUE * 2 || FATIGUE < 0)) {
            gameOver();
            return;
        }

        if (cvar === 1) {
            cattackingd = (CSTRENGTH + CCUNNING + CSPEED) / getRandomInteger(1, 3);

            if (moves === 2 && cattackingd > defendingd) {
                FATIGUE -= (cattackingd - (SPEED + getRandomInteger(1, 6)));
                FATIGUE = Math.min(FATIGUE, oFATIGUE);
                battleLog = `The computer attacked you and now your fatigue is ${FATIGUE}.<br/>${battleLog}`;
            } else {
                battleLog = `The computer attacked you but you defended yourself successfully so nothing changed.<br/>${battleLog}`;
            }
        } else if (cvar === 2) {
            cdefendingd = CCUNNING + CSPEED;
            battleLog = `The computer is defending itself.<br/>${battleLog}`;
        } else {
            cdefendingd = CSPEED + getRandomInteger(1, 6);
        }

        if (CoFATIGUE !== CFATIGUE && (CoFATIGUE - CFATIGUE) % 5 === 0) {
            CSTRENGTH--;
            CSPEED--;
            CCUNNING--;
        }

        turns++;
        playerTurn = true;
    }
    display();
    console.log(cvar);
}

function makeMove() {
    if (playerTurn) {
        FinishingBtn();

        if (moves === 1) {
            attackingd = (STRENGTH + CUNNING + SPEED) / getRandomInteger(1, 3);

            if (cvar === 2) {
                if (attackingd > cdefendingd) {
                    CFATIGUE -= (attackingd - (SPEED + getRandomInteger(1, 6)));
                    CFATIGUE = Math.min(CFATIGUE, CoFATIGUE);
                    battleLog = `You attacked your opponent and now their fatigue is ${CFATIGUE}.<br/>${battleLog}`;
                } else {
                    battleLog = `You attacked your opponent but they defended themselves successfully so nothing changed.<br/>${battleLog}`;
                }
            } else {
                battleLog = `You attacked your opponent.<br/>${battleLog}`;
            }
        } else if (moves === 2) {
            defendingd = CUNNING + SPEED;
            battleLog = `You are now defending.<br/>${battleLog}`;
        } else if (moves === 3) {
            defendingd = SPEED + getRandomInteger(1, 6);
            if (FATIGUE > CFATIGUE * 2 || CFATIGUE < 0) {
                gameOver();
            } else {
                battleLog = `You can't do anything yet so you just lost a turn.<br/>${battleLog}`;
            }
        }

        if (oFATIGUE !== FATIGUE && (oFATIGUE - FATIGUE) % 5 === 0) {
            STRENGTH--;
            SPEED--;
            CUNNING--;
        }

        turns++;
        playerTurn = false;
    }
    display();
    makeComputerMove();
}

function FinishingBtn() {
    const canFinish = FATIGUE > CFATIGUE * 2 || CFATIGUE < 0;
    if (elements.finishingMoveBtn) {
        elements.finishingMoveBtn.disabled = !canFinish;
    }
    if (!canFinish) {
        battleLog = `You cannot perform finishing move<br/>${battleLog}`;
    }
}

function gameOver() {
    if (cvar === 3 || FATIGUE <= 0) {
        battleLog = `You lost. The computer won.<br/>${battleLog}`;
    } else if (moves === 3 || CFATIGUE <= 0) {
        battleLog = `You won!<br/>${battleLog}`;
    }
    initialize();
}

function display() {
    if (elements.attackingOutput) {
        elements.attackingOutput.innerHTML = attackingd;
    }
    if (elements.defendingOutput) {
        elements.defendingOutput.innerHTML = defendingd;
    }
    if (elements.finishingMoveOutput) {
        elements.finishingMoveOutput.innerHTML = finishingd;
    }
    if (elements.cattackingOutput) {
        elements.cattackingOutput.innerHTML = cattackingd;
    }
    if (elements.cdefendingOutput) {
        elements.cdefendingOutput.innerHTML = cdefendingd;
    }
    if (elements.cfinishingMoveOutput) {
        elements.cfinishingMoveOutput.innerHTML = cfinishingd;
    }
    if (elements.roundOutput) {
        elements.roundOutput.innerHTML = turns;
    }
    if (elements.yourStrengthOutput) {
        elements.yourStrengthOutput.innerHTML = STRENGTH;
    }
    if (elements.yourSpeedOutput) {
        elements.yourSpeedOutput.innerHTML = SPEED;
    }
    if (elements.yourCunningOutput) {
        elements.yourCunningOutput.innerHTML = CUNNING;
    }
    if (elements.yourFatigueOutput) {
        elements.yourFatigueOutput.innerHTML = FATIGUE;
    }
    if (elements.youroriginalFatigueOutput) {
        elements.youroriginalFatigueOutput.innerHTML = oFATIGUE;
    }
    if (elements.computerStrengthOutput) {
        elements.computerStrengthOutput.innerHTML = CSTRENGTH;
    }
    if (elements.computerSpeedOutput) {
        elements.computerSpeedOutput.innerHTML = CSPEED;
    }
    if (elements.computerCunningOutput) {
        elements.computerCunningOutput.innerHTML = CCUNNING;
    }
    if (elements.computerFatigueOutput) {
        elements.computerFatigueOutput.innerHTML = CFATIGUE;
    }
    if (elements.coriginalFatigueOutput) {
        elements.coriginalFatigueOutput.innerHTML = CoFATIGUE;
    }
    if (elements.battleLogOutput) {
        elements.battleLogOutput.innerHTML = battleLog;
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initialize();
});
