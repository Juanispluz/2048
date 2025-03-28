// Cuando se hace clic en el boton de reinicio, se llama a resetGame()
document.getElementById("restart-btn").addEventListener("click", resetGame);

// Se crea un tablero de 4x4 con todas sus posiciones vacias
let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

// Se elige una posicion aleatoria vacia en el tablero y se coloca una ficha con valor 2/4
function addTile() {
    let emptySpaces = []; // Lista de posiciones vacias
    
    // Se recorren todas las casillas en busca de posiciones vacias
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptySpaces.push({ row, col });
            }
        }
    }
    
    // Si hay espacios vacios, se elige uno al azar y se coloca una ficha con valor2/4
    if (emptySpaces.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptySpaces.length);
        let position = emptySpaces[randomIndex];
        board[position.row][position.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Se desplazan y combinan las fichas en la direccion indicada
function move(direction) {
    if (checkGameOver()) return; //  No permite mover si el juego termino
    
    let moved = false; // Indica los cambios en el tablero
    
    for (let i = 0; i < 4; i++) {
        let line = []; // Lista temporal para almacenar los valores de la fila/columna actual
        
        // Se recorren los valores segun el movimiento
        for (let j = 0; j < 4; j++) {
            let value = (direction === 'left' || direction === 'right') ? board[i][j] : board[j][i];
            if (value !== 0) {
                line.push(value);
            }
        }
        
        if (direction === 'right' || direction === 'down') {
            line.reverse(); // Se invierta a  la lista el movimiento de derecha/abajo
        }
        
        let mergedLine = []; // Lista para almacenar los valores sumados
        let skip = false; // Evita combinar una ficha doblemente
        for (let j = 0; j < line.length; j++) {
            if (skip) {
                skip = false;
                continue;
            }
            if (j < line.length - 1 && line[j] === line[j + 1]) {
                mergedLine.push(line[j] * 2); // Solo combinar fichas iguales
                skip = true; // Se salta a la siguiente ficha para evitar doble sumados
            } else {
                mergedLine.push(line[j]);
            }
        }
        
        // Para mantener el tamaño de la fila/columna se agregan ceros
        while (mergedLine.length < 4) {
            mergedLine.push(0);
        }
        
        if (direction === 'right' || direction === 'down') {
            mergedLine.reverse(); // Se revierte la lista si el movimiento fue a la derecha o abajo
        }
        
        for (let j = 0; j < 4; j++) {
            if ((direction === 'left' || direction === 'right') && board[i][j] !== mergedLine[j]) {
                moved = true;
            }
            if ((direction === 'up' || direction === 'down') && board[j][i] !== mergedLine[j]) {
                moved = true;
            }
            if (direction === 'left' || direction === 'right') {
                board[i][j] = mergedLine[j];
            } else {
                board[j][i] = mergedLine[j];
            }
        }
    }
    
    if (moved) {
        addTile(); // Al haber un movimiento valido se agregara una nueva ficha
        draw(); // Actualizacion de la vista del tablero
        checkGameOver(); // Verificacion de game-over
    }
}

// Actualizacion de la vista del tablero
function draw() {
    let boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Limpieza el tablero
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.textContent = board[row][col] !== 0 ? board[row][col] : ""; // Muestra la ficha si esta no esta vacia
            boardElement.appendChild(tile);
        }
    }
}

//  Verificacion de game-over
function checkGameOver() {
    let isFull = true; // Indica si todas las casillas estan ocupadas
    let hasMoves = false; // Indica si hay movimientos disponibles

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                isFull = false;
            }
            if (col < 3 && board[row][col] === board[row][col + 1]) {
                hasMoves = true;
            }
            if (row < 3 && board[row][col] === board[row + 1][col]) {
                hasMoves = true;
            }
        }
    }
    
    if (isFull && !hasMoves) {
        document.getElementById("game-over").classList.remove("hidden");
        return true;
    }
    return false;
}

// Reinicio del tablero y oculta el mensaje de fin de juego
function resetGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    document.getElementById("game-over").classList.add("hidden");
    addTile();
    addTile();
    draw();
}

// Capturan de los movimientos del teclado
document.addEventListener("keydown", function (event) {
    let directions = {
        "ArrowLeft": "left",
        "ArrowRight": "right",
        "ArrowUp": "up",
        "ArrowDown": "down"
    };
    if (directions[event.key]) {
        move(directions[event.key]);
    }
});

// Inicia el juego cuando la pagina ha cargado completamente
document.addEventListener("DOMContentLoaded", function () {
    addTile();
    addTile();
    draw();
});
