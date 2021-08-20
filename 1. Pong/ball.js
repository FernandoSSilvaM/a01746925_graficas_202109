class ball
{



    constructor(x, y, radio, color,maxX, maxY)
    {
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color;
        this.maxX = maxX;
        this.maxY = maxY;

        var startY = Math.random();
        var startX = Math.random();

        if (startY == 0) {
            this.speedY = 3;
        } else{
            this.speedY = -3;
        }

        if (startX == 0) {
            this.speedX = 3;
        } else{
            this.speedX = -3;
        }



    }

    draw(contexto)
    {
        contexto.fillStyle = this.color;
        contexto.beginPath();
        contexto.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        contexto.fill();
    }

    update(barraIzq, barraDer)
    {


        let tempX = this.x;
        let tempY = this.y;
        
        tempX += this.speedX;
        tempY += this.speedY;



        let coordLeft =  tempX - this.radio;
        let coordRight = tempX + this.radio;
        let coordTop =   tempY - this.radio;
        let coordBot =   tempY + this.radio;

        let coordLeftBarL =  barraIzq.x;
        let coordRightBarL = barraIzq.x + barraIzq.w;
        let coordTopBarL =   barraIzq.y;
        let coordBotBarL =   barraIzq.y + barraIzq.h;

        let coordLeftBarR =  barraDer.x;
        let coordRightBarR = barraDer.x + barraDer.w;
        let coordTopBarR =   barraDer.y;
        let coordBotBarR =   barraDer.y + barraDer.h;

        //Rebota en la pared de arriba y de abajo
        if(coordTop < 0 || coordBot > this.maxY){
            this.speedY *= -1;

        }

        //Reinicia de lugar si la bola llega a alguno de los extremos
        if(coordLeft < 0 || coordRight > this.maxX){
            this.x = this.maxX/2;
            this.y = this.maxY/2;
        }

        //Revisa Colision barra izquierda
        if(coordLeft < coordRightBarL && coordBot > coordTopBarL && coordTop < coordBotBarL){
            console.log(barraIzq.x)
            this.speedX *= -1;
        }

        //Revisa Colision barra derecha
        if(coordRight > coordLeftBarR && coordBot > coordTopBarR && coordTop < coordBotBarR){
            this.speedX *= -1;
        }

        this.x += this.speedX;
        this.y += this.speedY;

    }
}

export { ball };