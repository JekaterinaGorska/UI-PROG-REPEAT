export class Player{
    
    constructor(x,y,spriteSheet){
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        this.speed = 5;

        this.move = this.move.bind(this);

        window.addEventListener('keydown', this.move);
    }
    move(event){
        switch(event.key){
            case 'w':
                this.y -= this.speed;
                break;
            case 's':
                this.y += this.speed;
                break;
            case 'a':
                this.x -= this.speed;
                break;
            case 'd':
                this.x += this.speed;
                break;
        }
    }

    draw(ctx){
        ctx.drawImage(this.spriteSheet, this.x, this.y);
    }
}