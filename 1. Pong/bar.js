class bar
{
    constructor(x, y, w, h, color, upKey, downKey, minY, maxY)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.upKey = upKey;
        this.downKey= downKey;

        this.up = false;
        this.down = false;

        this.minY = minY;
        this.maxY = maxY;

        this.keyEvents();
    }

    draw(contexto)
    {
        contexto.fillStyle = this.color;
        contexto.fillRect(this.x, this.y, this.w, this.h);
    }

    keyEvents()
    {
        document.addEventListener('keydown', event =>{
            if(event.key == this.upKey)
                this.up = true;
            if(event.key == this.downKey)
                this.down = true;
        });

        document.addEventListener('keyup', event =>{
            if(event.key == this.upKey)
                this.up = false;
            if(event.key == this.downKey)
                this.down = false;
        });
    }

    update()
    {        
        if(this.up) this.y -= 5;
        if(this.down) this.y += 5;
        
        // Prevenir que se salga por arriba
        if(this.y < this.minY)
            this.y = this.minY;
        // Prevenir que se salga por abajo
        if(this.y > (this.maxY-this.h))
            this.y = this.maxY-this.h;
    }
}

export { bar };