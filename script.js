function initialize() {

    //player info

    attackingOutput = document.getElementById("attackingdd");
    defendingOutput = document.getElementById("defendingdd");
    finishingMoveOutput = document.getElementById("finishingdd");

    yourStrengthOutput = document.getElementById("measuredSTRENGTH");
    yourSpeedOutput = document.getElementById("measuredSPEED");
    yourCunningOutput = document.getElementById("measuredCUNNING");
    yourFatigueOutput = document.getElementById("measuredFATIGUE");
    youroriginalFatigueOutput = document.getElementById("originalFATIGUE");

    //computer info

    cattackingOutput = document.getElementById("cattackingdd");
    cdefendingOutput = document.getElementById("cdefendingdd");
    cfinishingMoveOutput = document.getElementById("cfinishingdd");

    computerStrengthOutput = document.getElementById("measuredCSTRENGTH");
    computerSpeedOutput = document.getElementById("measuredCSPEED");
    computerFatigueOutput = document.getElementById("measuredCFATIGUE");
    computerCunningOutput = document.getElementById("measuredCCUNNING");
    coriginalFatigueOutput = document.getElementById("originalCFATIGUE");

    //keep track info

    battleLogOutput = document.getElementById("battleLog");
    roundOutput = document.getElementById("turns");
    battleLog = "";
    turns = 0;
    moves = 0;

    //the player's status generate

    STRENGTH = 6 + getRandomInteger(-1, 1);
    CUNNING = 6 + getRandomInteger(-1, 1);
    SPEED = 6 + getRandomInteger(-1, 1);
    FATIGUE = 30 + getRandomInteger(-6, 6);
    oFATIGUE = FATIGUE;

    //the computer's status generate

    CSTRENGTH = 6 + getRandomInteger(-1, 1);
    CCUNNING = 6 + getRandomInteger(-1, 1);
    CSPEED = 6 + getRandomInteger(-1, 1);
    CFATIGUE = 30 + getRandomInteger(-6, 6);
    CoFATIGUE = CFATIGUE;
    //
    cvar = 0;
    document.getElementById("FMBtn").disabled = true;

    // these will be zeros for now
    attackingd = 0;
    defendingd = 0;
    finishingd = STRENGTH + SPEED;

    cattackingd = 0;
    cdefendingd = 0;
    cfinishingd = CSPEED + CSTRENGTH;

    playerTurn = true;

    display();
}
// computer portion
function makeComputerMove() {
    if (playerTurn == false) {
        cvar = getRandomInteger(1, 3);

        if (cvar == 3) {
            if (CFATIGUE > FATIGUE * 2) {
                gameOver();
            }
            else {
                if (FATIGUE < 0) {
                    gameOver();
                }
                else {
                    cvar = getRandomInteger(1, 2);
                }
            }
        }

        if (cvar == 1) {
            cattackingd = (CSTRENGTH + CCUNNING + CSPEED) / getRandomInteger(1, 3);

            if (moves == 2) {
                if (cattackingd > defendingd) {
                    FATIGUE = FATIGUE - (cattackingd - (SPEED + getRandomInteger(1, 6)));
                    if (FATIGUE > oFATIGUE) {
                        FATIGUE = oFATIGUE;
                    }

                    battleLog = "The computer attacked you and now your fatigue is now " + FATIGUE + ".<br/>" + battleLog;
                }
            }
            else {
                battleLog = "The computer attacked you but you defended yourself successfully so nothing changed. <br/>" + battleLog;
            }
        }
        else {
            if (cvar == 2) {
                cdefendingd = (CCUNNING + CSPEED);

                battleLog = "The computer is defending itself. <br/>" + battleLog;
            }
            else {
                cdefendingd = (CSPEED + getRandomInteger(1, 6));

                if (cvar == 3) {
                    if (CFATIGUE > FATIGUE * 2) {
                        gameOver();
                    }
                    else {
                        cvar = getRandomInteger(1, 2);
                    }
                }
                if (cvar == 3) {
                    if (FATIGUE < 0) {
                        gameOver();
                    }
                    else {
                        cvar = getRandomInteger(1, 2);
                    }

                }
            }
        }
        if (!(CoFATIGUE == CFATIGUE)) {
            if ((CoFATIGUE - CFATIGUE) % 5 == 0) {
                CSTRENGTH = CSTRENGTH - 1;
                CSPEED = CSPEED - 1;
                CCUNNING = CCUNNING - 1;
            }
        }
        turns += 1;
        playerTurn = true;
    }
    display();
    console.log(cvar);
}
function getRandomInteger(lower, upper) {
    var multiplier = upper - (lower - 1);
    var rnd = parseInt(Math.random() * multiplier) + lower;

    return rnd;
}
//player portion
function makeMove() {
    if (playerTurn == true) {
        FinishingBtn();

        if (moves == 1) {
            attackingd = (STRENGTH + CUNNING + SPEED) / getRandomInteger(1, 3);

            if (cvar == 2) {
                if (attackingd > cdefendingd) {
                    CFATIGUE = CFATIGUE - (attackingd - (SPEED + getRandomInteger(1, 6)));
                    if (CFATIGUE > CoFATIGUE) {
                        CFATIGUE = CoFATIGUE;
                    }

                    battleLog = "You attacked your opponent and now their fatigue is now " + CFATIGUE + ".<br/>" + battleLog;
                }
                else {
                    battleLog = "You attacked your opponent but they defended themselves successfully so nothing changed. <br/>" + battleLog;
                }
            }
            else {
                battleLog = "You attacked your opponent. <br/>" + battleLog;
            }

        }
        else {
            if (moves == 2) {
                defendingd = (CUNNING + SPEED);

                battleLog = "You are now defending. <br/>" + battleLog;
            }
            else {
                defendingd = (SPEED + getRandomInteger(1, 6));

                if (moves == 3) {
                    if (FATIGUE > CFATIGUE * 2) {
                        gameOver();
                    }
                    else {
                        if (CFATIGUE < 0) {
                            gameOver();
                        }
                        else {
                            battleLog = "You can't do anything yet so you just lost a turn. <br/>" + battleLog;
                        }
                    }
                }
            }
        }
        if (!(oFATIGUE == FATIGUE)) {
            if ((oFATIGUE - FATIGUE) % 5 == 0) {
                STRENGTH = STRENGTH - 1;
                SPEED = SPEED - 1;
                CUNNING = CUNNING - 1;
            }
        }
        turns += 1;
        playerTurn = false;
    }
    display();
    makeComputerMove();
}

//button function

function FinishingBtn() {
    if (FATIGUE > CFATIGUE * 2) {
        document.getElementById("FMBtn").disabled = false;
    }
    else {
        if (CFATIGUE < 0) {
            document.getElementById("FMBtn").disabled = false;
        }
        else {
            battleLog = "You cannot perform finishing move <br/>" + battleLog;
            document.getElementById("FMBtn").disabled = true;
        }
    }
}
//ending scenes and display
function gameOver() {
    if (cvar == 3) {
        battleLog = "You lost. The computer won. <br/>" + battleLog;
        initialize();
    }
    if (moves == 3) {
        battleLog = "You won! <br/>" + battleLog;
        initialize();
    }
}
function display() {
    attackingOutput.innerHTML = attackingd;
    defendingOutput.innerHTML = defendingd;
    finishingMoveOutput.innerHTML = finishingd;

    cattackingOutput.innerHTML = cattackingd;
    cdefendingOutput.innerHTML = cdefendingd;
    cfinishingMoveOutput.innerHTML = cfinishingd;

    roundOutput.innerHTML = turns;

    yourStrengthOutput.innerHTML = STRENGTH;
    yourSpeedOutput.innerHTML = SPEED;
    yourCunningOutput.innerHTML = CUNNING;
    yourFatigueOutput.innerHTML = FATIGUE;
    youroriginalFatigueOutput.innerHTML = oFATIGUE;

    computerStrengthOutput.innerHTML = CSTRENGTH;
    computerSpeedOutput.innerHTML = CSPEED;
    computerCunningOutput.innerHTML = CCUNNING;
    computerFatigueOutput.innerHTML = CFATIGUE;
    coriginalFatigueOutput.innerHTML = CoFATIGUE;

    battleLogOutput.innerHTML = battleLog;
}
