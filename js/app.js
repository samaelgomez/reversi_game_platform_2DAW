window.addEventListener('load', () => {
    var boardLayout = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]
    const colors = [
        '#2196f3',
        '#e91e63',
        '#ffeb3b',
        '#74ff1d'
    ]

    const directions = [
        [0,1],
        [1,1],
        [1,0],
        [1,-1],
        [0,-1],
        [-1,-1],
        [-1,0],
        [-1,1]
    ]

    var tilesCaptured = [];

    const board = document.getElementById('board');
    const playerScore = document.getElementById('playerScore');
    const AIScore = document.getElementById('AIScore');
    const announcer = document.getElementById('announcer');
    const helpIcon = document.getElementById('helpIcon');
    const rules = document.getElementById('rules');
    const gotIt = document.getElementById('gotIt');
    const prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];
    let turn='black';

    function createLine() {
        const backgroundSection = document.getElementById('background');
        const backgroundLine = document.createElement('div');
        const backgroundCircle = document.createElement('div');
        const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 20;

        // Line customization
        backgroundLine.classList.add('backgroundLine');
        backgroundLine.style.height = size + 10 + 'vh';
        backgroundLine.style.width = (size + 10) / 3 + 'vh';
        backgroundLine.style.border = "0.3vh solid " + backgroundColor;
        backgroundLine.style.borderRadius = (size + 10) * 1.10 + 'vh';
        backgroundLine.style.top = Math.random() * 125 - 25 + '%';
        backgroundLine.style.left = Math.random() * 100 + 5 + '%';
        backgroundLine.style.boxShadow = 'inset 0 -0.5vh 0.5vh ' + backgroundColor + ', 0 1vh 1.5vh #000c, inset 0 1vh 1.5vh #000c';

        // Circle customization
        backgroundCircle.classList.add('backgroundCircle');
        backgroundCircle.style.height = backgroundLine.style.width;
        backgroundCircle.style.width = backgroundLine.style.width;
        backgroundCircle.style.backgroundColor = backgroundColor;
        backgroundLine.style.boxShadow = 'inset 0 -0.5vh 0.5vh ' + backgroundColor + ', 0 1vh 1.5vh #000c, inset 0 1vh 1.5vh #000c';
        
        backgroundLine.appendChild(backgroundCircle);
        backgroundSection.appendChild(backgroundLine);

        setTimeout(() => {
            backgroundLine.remove();
        }, 15000);
    }

    helpIcon.addEventListener('click', () => {
        if (rules.classList.contains('showRules')) {
            rules.classList.remove('showRules');
            rules.classList.add('hideRules');
            gotIt.classList.add('hidden');
            setTimeout(() => {
                rules.classList.add('hidden');
            }, 1300);
        } else {
            rules.classList.remove('hidden');
            rules.classList.remove('hideRules');
            rules.classList.add('showRules');
            setTimeout(() => {
                gotIt.classList.remove('hidden');
            }, 1300);
        }
    });

    gotIt.addEventListener('click', () => {
        rules.classList.remove('showRules');
        rules.classList.add('hideRules');
        gotIt.classList.add('hidden');
        setTimeout(() => {
            rules.classList.add('hidden');
        }, 1300);
    });
    
    function createBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                
                cell = document.createElement("div");
                cell.setAttribute("id", "cell" + i + "-" + j);
                cell.setAttribute("class", "cell");
                board.appendChild(cell);
            }
            
        }
        cells=document.getElementsByClassName('cell');
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', () => {
                if (!cells[i].querySelector(".tile validMove")) {
                    tilexy=cells[i].id.split('cell',2)[1].split('-',2);
                    row = parseInt(tilexy[0]);
                    column = parseInt(tilexy[1]);
                    if (boardLayout[row][column] == 3) {
                        if (turn == 'black') {
                            boardLayout[row][column]=1;
                            move=[row,column];
                            captureTiles(move);
                            turn='white';
                            updateBoard();
                            canmove();
                        } 
                        // Multiplayer
                        /* else if (turn == 'white'){
                            boardLayout[row][column]=2;
                            move=[row,column];
                            captureTiles(move);
                            turn='black';
                            updateBoard();
                            canmove();
                        } */
                    }
                }
            });
        }
    }

    function createTile(color) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (color == 'white') {
            tile.classList.add('white');
        } else if (color == 'black'){
            tile.classList.add('black');
        } else if (color == 'validMove'){
            tile.classList.add('validMove');
        }
        return tile;
    }

    function updateScore() {
        let playerScoreUpdate = 0;
        let AIScoreUpdate = 0;

        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                let value = boardLayout[row][column];
                if (value == 1) {
                    playerScoreUpdate++;
                } else if (value == 2) {
                    AIScoreUpdate++;
                }
            }
        }

        playerScore.innerHTML = "You: " + playerScoreUpdate;
        AIScore.innerHTML = "AI: " + AIScoreUpdate;

    }

    function updateBoard() {
        board.innerHTML="";
        resetValidMoves();
        createBoard();
        checkValidMoves();
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                const currentTile = boardLayout[row][column];
                if (currentTile == 3 && turn == 'black') {
                    document.getElementById('cell' + row + '-' + column).appendChild(createTile('validMove'));
                }else if (currentTile == 1){
                    document.getElementById('cell' + row + '-' + column).appendChild(createTile('black'));
                }
                else if (currentTile == 2){
                    document.getElementById('cell' + row + '-' + column).appendChild(createTile('white'));
                }
            }
        }

        if (tilesCaptured.length != 0) {
            for (let i = 0; i < tilesCaptured.length; i++) {
                rotateTile(tilesCaptured[i]);
            }
        }
        tilesCaptured=[];
        
        updateScore();

    }

    function gameFinish() {
        let finalPlayerScore = 0;
        let finalAIScore = 0;
        let scoreToSend = 0;

        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                let value = boardLayout[row][column];
                if (value == 1) {
                    finalPlayerScore++;
                } else if (value == 2) {
                    finalAIScore++;
                }
            }
        }

        if (finalPlayerScore > finalAIScore) {
            announcer.innerHTML = "YOU WIN";
            scoreToSend = finalPlayerScore*10;
        } else if (finalPlayerScore > finalAIScore) {
            announcer.innerHTML = "TIE";
        } else {
            announcer.innerHTML = "AI WINS";
            scoreToSend = -(finalAIScore*10);
        }

        announcer.style.visibility = "visible";
        send_score(scoreToSend);

    }

    function resetValidMoves() {
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                if (boardLayout[row][column] == 3) {
                    boardLayout[row][column] = 0;
                }
            }
        }
    }

    function canmove() {
        move=false;
        finish=true;
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                if (boardLayout[row][column] == 3) {
                    move=true;
                }
            }
        }
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                if (boardLayout[row][column] == 0 || boardLayout[row][column] == 3) {
                    finish=false;
                }
            }
        }
        if (finish==true) {
            gameFinish();
        }
        if (move==true && turn=='white' && finish==false) {
            playIA();
        }

        setTimeout(()=> {
            if (move==false && finish==false) {
                if (turn=='black') {
                    turn='white';
                    updateBoard();
                    for (let row = 0; row < 8; row++) {
                        for (let column = 0; column < 8; column++) {
                            if (boardLayout[row][column] == 3) {
                                move=true;
                            }
                        }
                    }
                    if (move==true) {
                        playIA();
                    }
                }else if (turn=='white') {
                    turn='black';
                    updateBoard();
                    for (let row = 0; row < 8; row++) {
                        for (let column = 0; column < 8; column++) {
                            if (boardLayout[row][column] == 3) {
                                move=true;
                            }
                        }
                    }
                }
            }
        }, 1000)
    }

    function checkValidMoves() {
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                cell=[row,column];
                if (boardLayout[cell[0]][cell[1]] != 2 && boardLayout[cell[0]][cell[1]] != 1) {
                    if (checkMoves(cell)) {
                        boardLayout[cell[0]][cell[1]]=3;
                    };
                }
            }
        }
    }

    function checkMoves(move) {
        for (let i = 0; i < 8; i++) {
            result=false;
            if (turn=='black') {
                if ( !(move[0]+directions[i][0] < 0) && !(move[0]+directions[i][0] > 7) && !(move[1]+directions[i][1] < 0) && !(move[0]+directions[i][0] > 7)) {
                    cellcheck=[move[0]+directions[i][0],move[1]+directions[i][1]];
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 2) {
                        if (checkDirections(directions[i],move)) {
                            result=true;
                            return result;
                        }
                    }
                }
            }else if (turn=='white') {
                if ( !(move[0]+directions[i][0] < 0) && !(move[0]+directions[i][0] > 7) && !(move[1]+directions[i][1] < 0) && !(move[0]+directions[i][0] > 7)) {
                    cellcheck=[move[0]+directions[i][0],move[1]+directions[i][1]];
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 1) {
                        if (checkDirections(directions[i],move)) {
                            result=true;
                            return result;
                        }
                    }
                }
            }
        }
        return result;
    }

    function checkDirections(direction,move) {
        let check=false;
        let found=false;
        rep=1;
        while (check==false) {
            if ( !((move[0]+(direction[0]*rep)) < 0) && !((move[0]+(direction[0]*rep)) > 7) && !((move[1]+(direction[1]*rep)) < 0) && !((move[1]+(direction[1]*rep)) > 7)) {
                if (turn=='black') {
                    cellcheck=[move[0]+(direction[0]*rep),move[1]+(direction[1]*rep)];
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 2) {
                        found=false;
                        check=false;
                    }else if (boardLayout[cellcheck[0]][cellcheck[1]] == 1) {
                        found=true;
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 0)){
                        found=false;
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 3)){
                        found=false;
                        check=true;
                    }
                }else if (turn=='white') {
                    cellcheck=[move[0]+(direction[0]*rep),move[1]+(direction[1]*rep)];
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 2) {
                        found=true;
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 0)){
                        found=false;
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 3)){
                        found=false;
                        check=true;
                    }
                }
            }else {
                found=false;
                check=true
            }
            rep++
        }
        return found;
    }

    function checkMove(move) {
        for (let i = 0; i < 8; i++) {
            if (turn=='black') {
                if ( !(move[0]+directions[i][0] < 0) && !(move[0]+directions[i][0] > 7) && !(move[1]+directions[i][1] < 0) && !(move[0]+directions[i][0] > 7)) {
                    cellcheck=[move[0]+directions[i][0],move[1]+directions[i][1]];
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 2) {
                        checkDirection(directions[i],move);
                    }
                }
            }else if (turn=='white') {
                if ( !(move[0]+directions[i][0] < 0) && !(move[0]+directions[i][0] > 7) && !(move[1]+directions[i][1] < 0) && !(move[0]+directions[i][0] > 7)) {
                    cellcheck=[move[0]+directions[i][0],move[1]+directions[i][1]];                    
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 1) {
                        checkDirection(directions[i],move);
                    }
                }
            }
        }
    }

    function checkDirection(direction,move) {
        check=false;
        found=false;
        rep=1;
        while (check==false) {
            if ( !((move[0]+(direction[0]*rep)) < 0) && !((move[0]+(direction[0]*rep)) > 7) && !((move[1]+(direction[1]*rep)) < 0) && !((move[1]+(direction[1]*rep)) > 7)) {                
                if (turn=='black') {
                    cellcheck=[move[0]+(direction[0]*rep),move[1]+(direction[1]*rep)];
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 1) {
                        found=true;
                        for (let i = 1; i <= rep; i++) {
                            cellcapture=[move[0]+(direction[0]*i),move[1]+(direction[1]*i)];
                            boardLayout[cellcapture[0]][cellcapture[1]]=1;
                            if (i != rep) {
                                tilesCaptured.push(cellcapture);
                            }
                        }
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 0)){
                        found=false;
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 3)){
                        found=false;
                        check=true;
                    }
                }else if (turn=='white') {
                    cellcheck=[move[0]+(direction[0]*rep),move[1]+(direction[1]*rep)];
                    if (boardLayout[cellcheck[0]][cellcheck[1]] == 2) {
                        found=true;
                        for (let i = 1; i <= rep; i++) {
                            cellcapture=[move[0]+(direction[0]*i),move[1]+(direction[1]*i)];
                            boardLayout[cellcapture[0]][cellcapture[1]]=2;
                            if (i != rep) {
                                tilesCaptured.push(cellcapture);
                            }
                        }
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 0)){
                        found=false;
                        check=true;
                    }else if ((boardLayout[cellcheck[0]][cellcheck[1]] == 3)){
                        found=false;
                        check=true;
                    }
                }
            }else {
                found=false;
                check=true
            }
            rep++
        }
    }

    function captureTiles(move) {
        checkMove(move);
    }

    function playIA() {
        posibleplays=[];
        boardLayout.map((lines,index) => {
            lines.map((cell,childindex) => {
                if (cell == 3) {
                    posibleplays[posibleplays.length]=[index,childindex];
                }
            })
        })
        indexplay=Math.floor(Math.random() * ((posibleplays.length -1) - 0 + 1) + 0);
        play=posibleplays[indexplay];
        row=play[0];
        column=play[1];
        boardLayout[row][column]=2;
        move=[row,column];
        setTimeout(()=> {
            captureTiles(move);
            turn='black';
            updateBoard();
            canmove();
        }, 1500)
    }

    function send_score(variableScore) {
        var token = localStorage.getItem("token");
        if (token) {
            var http = new XMLHttpRequest();
            var url = 'http://0.0.0.0:4000/api/rank/update';
            var params = JSON.stringify({
                nameGame: "Reversi",
                score: variableScore
            });
            http.open('POST', url, true);
    
            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.setRequestHeader('Authorization', 'Token ' + token);
    
            http.onreadystatechange = function() { //Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    console.log(http.responseText);
                }
            }
            http.send(params);
        }
    }

    function rotateTile(tile) {
        if (document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.contains('black')) {
            document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.remove('black');
            document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.add('white');
        } else {
            document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.remove('white');
            document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.add('black');
        }
        setTimeout(()=> {
            document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].style.transform= 'rotateY(180deg)';
        }, 20)

        setTimeout(()=> {
            if (document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.contains('black')) {
                document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.remove('black');
                document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.add('white');
            } else {
                document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.remove('white');
                document.getElementById('cell'+tile[0]+"-"+tile[1]).childNodes[0].classList.add('black');
            }
        }, 207)
    }

    setInterval(createLine, 750);
    updateBoard();

});