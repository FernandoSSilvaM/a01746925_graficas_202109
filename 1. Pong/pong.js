import { bar } from './bar.js';
import { ball } from './ball.js';

let canvas = null, contexto = null;

function update(barraIzq, barraDer, bola)
{
    requestAnimationFrame(()=>update(barraIzq, barraDer, bola));

    contexto.clearRect(0, 0, canvas.width, canvas.height);

    barraIzq.update();
    barraDer.update();
    bola.update(barraIzq, barraDer);

    barraIzq.draw(contexto);
    barraDer.draw(contexto);
    bola.draw(contexto);
}

function main()
{
    canvas = document.getElementById('pongCanvas');
    contexto = canvas.getContext('2d');

    if(!contexto)
    {
        console.log("Error al iniciar el contexto");
    }

    let barraIzq = new bar(20, 50, 20, 50, 'red', 'q', 'a', 0, canvas.height);
    let barraDer = new bar(460, 100, 20, 50, 'red', 'o', 'l', 0, canvas.height);
    let bola = new ball(canvas.width/2, canvas.height/2, 15, 'blue',canvas.width, canvas.height);

    update(barraIzq, barraDer, bola);
}

main();