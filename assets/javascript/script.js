/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/
let tablero = document.getElementById('tablero');
let lanzarDadoBtn = document.getElementById('lanzarDado');
let resultadoDadoDiv = document.getElementById('resultadoDado');
let jugador1Div = document.getElementById('jugador1');
let jugador2Div = document.getElementById('jugador2');
let mensajeDiv = document.getElementById('mensaje');
let jugador1Indicador = document.getElementById('jugador1-indicador');
let jugador2Indicador = document.getElementById('jugador2-indicador');
let imagenDado = document.getElementById('imagenDado');

let jugador1Pos = 0;
let jugador2Pos = 0;
let turnoJugador1 = true;
let animacionDado;

function crearTablero() {
    let tablero = document.getElementById('tablero');
    let posiciones = [
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
        [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
        [7, 6], [7, 5], [7, 4], [7, 3], [7, 2], [7, 1], [7, 0],
        [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0],
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
        [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
        [6, 5], [6, 4], [6, 3], [6, 2], [6, 1],
        [5, 1], [4, 1], [3, 1], [2, 1],
        [2, 2], [2, 3], [2, 4], [2, 5],
        [3, 5], [4, 5], [5, 5],
        [5, 4], [5, 3], [5, 2],
        [4, 2], [3, 2], [3, 3], [3, 4],
        [4, 4], [4, 3]
    ];

    for (let i = 0; i < 63; i++) {
        let casilla = document.createElement('div');
        casilla.classList.add('casilla');
        casilla.innerText = i + 1;
        casilla.style.gridColumn = posiciones[i][1] + 1;
        casilla.style.gridRow = posiciones[i][0] + 1;
        tablero.appendChild(casilla);
    }

    let casillaFinal = document.createElement('div');
    casillaFinal.classList.add('casilla', 'final');
    casillaFinal.innerText = 'Final';
    tablero.appendChild(casillaFinal);
}

function actualizarTablero() {
    let casillas = document.querySelectorAll('.casilla');
    casillas.forEach(casilla => {
        casilla.classList.remove('jugador1-posicion', 'jugador2-posicion');
    });

    if (jugador1Pos < 100) {
        casillas[jugador1Pos].classList.add('jugador1-posicion');
    }
    if (jugador2Pos < 100) {
        casillas[jugador2Pos].classList.add('jugador2-posicion');
    }
}

function moverJugador(jugador, posicion) {
    let ocaCasillas = [4, 8, 13, 17, 22, 26, 31, 35, 40, 44, 49, 53, 58];
    let puenteCasillas = [5, 11];
    let posadaCasilla = 18;
    let pozoCasilla = 30;
    let laberintoCasilla = 41;
    let carcelCasilla = 55;
    let dadosCasillas = [25, 52];
    let calaveraCasilla = 57;
    let jardinCasilla = 63;

    // Mover al jugador
    let nuevaPosicion;
    if (jugador === 1) {
        jugador1Pos += posicion;
        nuevaPosicion = jugador1Pos;
        jugador1Div.innerText = `Jugador 1: Posición ${jugador1Pos + 1}`;
    } else {
        jugador2Pos += posicion;
        nuevaPosicion = jugador2Pos;
        jugador2Div.innerText = `Jugador 2: Posición ${jugador2Pos + 1}`;
    }

    // Verificar reglas de las casillas especiales
    if (ocaCasillas.includes(nuevaPosicion)) {
        // Mover a la siguiente casilla de oca
        while (!ocaCasillas.includes(nuevaPosicion)) {
            nuevaPosicion++;
        }
    } else if (puenteCasillas.includes(nuevaPosicion)) {
        nuevaPosicion = 18; // Posada
    } else if (nuevaPosicion === posadaCasilla) {
        // Pierde un turno en la posada
        if (turnoJugador1 && jugador === 1 || !turnoJugador1 && jugador === 2) {
            turnoJugador1 = !turnoJugador1;
            actualizarTurno();
        }
    } else if (nuevaPosicion === pozoCasilla) {
        // No se puede volver a jugar hasta que no pase otro jugador
        if (turnoJugador1 && jugador === 1 || !turnoJugador1 && jugador === 2) {
            turnoJugador1 = !turnoJugador1;
            actualizarTurno();
        }
    } else if (nuevaPosicion === laberintoCasilla) {
        nuevaPosicion = 29; // Retroceder al laberinto
    } else if (nuevaPosicion === carcelCasilla) {
        // Permanecer dos turnos en la cárcel
        if (turnoJugador1 && jugador === 1 || !turnoJugador1 && jugador === 2) {
            turnoJugador1 = !turnoJugador1;
            actualizarTurno();
        }
    } else if (dadosCasillas.includes(nuevaPosicion)) {
        // Sumar la marcación de la casilla de los dados
        nuevaPosicion += nuevaPosicion === 25 ? 1 : 2;
    } else if (nuevaPosicion === calaveraCasilla) {
        nuevaPosicion = 0; // Volver al inicio
    } else if (nuevaPosicion > jardinCasilla) {
        // Retroceder tantas casillas como puntos sobrantes
        nuevaPosicion = jardinCasilla - (nuevaPosicion - jardinCasilla);
    }

    // Actualizar posición del jugador
    if (jugador === 1) {
        jugador1Pos = nuevaPosicion;
    } else {
        jugador2Pos = nuevaPosicion;
    }

    // Verificar si se alcanzó la casilla final
    if (nuevaPosicion >= 62) {
        mensajeDiv.innerText = `¡Jugador ${jugador} ha ganado!`;
        lanzarDadoBtn.disabled = true;
    }

    // Actualizar tablero y turno
    actualizarTablero();
    actualizarTurno();
}

function actualizarTurno() {
    if (turnoJugador1) {
        jugador1Indicador.classList.add('turno');
        jugador2Indicador.classList.remove('turno');
    } else {
        jugador1Indicador.classList.remove('turno');
        jugador2Indicador.classList.add('turno');
    }
}

function animarDado() {
    let contador = 0;
    animacionDado = setInterval(() => {
        let numero = Math.floor(Math.random() * 6) + 1;
        imagenDado.src = `assets/img/dado${numero}.webp`;
        contador++;
        if (contador > 20) {
            clearInterval(animacionDado);
        }
    }, 100);
}
lanzarDadoBtn.addEventListener('click', () => {
    animarDado();
    fetch('CalcularTirada.php')
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                clearInterval(animacionDado);
                let dado = data.tirada;
                imagenDado.src = `assets/img/dado${dado}.webp`;
                resultadoDadoDiv.innerText = `Dado: ${dado}`;
                if (turnoJugador1) {
                    moverJugador(1, dado);
                } else {
                    moverJugador(2, dado);
                }
                turnoJugador1 = !turnoJugador1; // Invertir el turno después de resolver quién mueve la ficha
                actualizarTurno(); // Actualizar los indicadores de turno después de invertir el turno
            }, 2000);
        })
        .catch(error => {
            console.error('Error al lanzar el dado:', error);
        });
});

crearTablero();
actualizarTurno();
/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/