var c = document.getElementById("canvas");
var context = c.getContext("2d");
let pipe = [], Bird, Background, Floor;
var jump=false, framerate=15, jumpheight=0, bird_angle=0, keyframe=0, score=0, restart=false, moveup=true, dead=false, Ping;

function main() {
	Ping = document.getElementById("ping"); 
	
	Background = new Sprite("res/back.png");
	Background.Render(0,0, 500, 525, 0, 0, 500, 525);
	Floor = new Sprite("res/floor.png");
	Floor.Render(0, 0, 533, 100, 0, 525, 533, 100);
	
	for(var i=0; i<=2; ++i) {
		pipe[i] = new Sprite("res/pipe.png");
		pipe[i].Render(0, 0, 120, 866, 1000+(300*i), Math.floor(Math.random() * 150)-200, 120, 866);
	}
	
	Bird = new Sprite("res/bird.png");
	Bird.Render(0, 0, 68, 48, 225, 250, 68, 48);
	Bird.setOrigin(34, 24);
	interval = setInterval(Start, framerate);
}

function Start() {
	document.addEventListener('keyup', Release);
	document.addEventListener('keydown',Press);
	
	if(jump==true) {
		document.removeEventListener('keydown',Press);
		document.removeEventListener('keyup', Release);
		clearInterval(interval);
		interval = setInterval(Loop, framerate);
		return;
	}
	
	++keyframe;
	switch(keyframe) {
		case 1:
		Bird.Render(0, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		break;
		case 10:
		Bird.Render(68, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		break;
		case 20:
		Bird.Render(68*2, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		break;
		case 30:
		Bird.Render(68, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		keyframe=0;
		break;
	}
	if(Floor.dx <= -33) {
		Floor.dx = 0;
	} else {
		Floor.dx -= 3;
	}
	
	if(Bird.dy <= 225) {
		moveup=false;
	} else if(Bird.dy >= 275) {
		moveup=true;
	}
	
	if(moveup==true) {
		Bird.dy -= 2;
	} else {
		Bird.dy += 2;
	}
	
	context.clearRect(0,0,canvas.width,canvas.height);
	Background.Update();
	pipe[0].Update();
	pipe[1].Update();
	pipe[2].Update();
	Floor.Update();
	Bird.Update();
}

function Loop() {
	document.addEventListener('keyup', Release);
	document.addEventListener('keydown',Press);
	
	++keyframe;
	switch(keyframe) {
		case 1:
		Bird.Render(0, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		break;
		case 10:
		Bird.Render(68, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		break;
		case 20:
		Bird.Render(68*2, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		break;
		case 30:
		Bird.Render(68, 0, 68, 48, Bird.dx, Bird.dy, 68, 48);
		keyframe=0;
		break;
	}
	if(bird_angle < 90) {
		bird_angle += 3;
	}
	Bird.Rotate(bird_angle);
	if(jump == true) {
		jumpheight=-14;
		jump=false;
		Bird.Rotate(-bird_angle-45);
		bird_angle = -45;
	} else if(jumpheight < 10) {
		jumpheight += 1;
	}
	Bird.dy += jumpheight;
	if(Floor.dx <= -33) {
		Floor.dx = 0;
	} else {
		Floor.dx -= 3;
	}
	if(Bird.dy+Bird.dh >= 550) {
		dead=true;
	}
	for(var i=0; i<=2; ++i) {
		if(Bird.dy-(Bird.dh/2) <= pipe[i].dy+314 && (Bird.dx+(Bird.dw/2) >= pipe[i].dx && Bird.dx <= pipe[i].dx+pipe[i].dw)) {
			dead=true;
		} else if(Bird.dy+(Bird.dh/2) >= pipe[i].dy+506 && (Bird.dx+(Bird.dw/2) >= pipe[i].dx && Bird.dx <= pipe[i].dx+pipe[i].dw)) {
			dead=true;
		}
		
		if(Bird.dx >= pipe[i].dx+pipe[i].dw && Bird.dx <= pipe[i].dx+pipe[i].dw+2) {
			++score;
			Ping.play();
			Ping.currentTime = 0;
		}
	}
	if(dead==true) {
		restart=false;
		document.removeEventListener('keydown',Press);
		document.removeEventListener('keyup', Release);
		clearInterval(interval);
		interval = setInterval(End, framerate);
	}
	
	pipe[0].dx -= 3;
	pipe[1].dx -= 3;
	pipe[2].dx -= 3;
    if(pipe[0].dx <= -120) {
        pipe[0].dy = Math.floor(Math.random() * 150)-200;
        pipe[0].dx=780;
    } else if(pipe[1].dx <= -120) {
        pipe[1].dy = Math.floor(Math.random() * 150)-200;
        pipe[1].dx=780;
    } else if(pipe[2].dx <= -120) {
        pipe[2].dy = Math.floor(Math.random() * 150)-200;
        pipe[2].dx=780;
    }
	
	context.clearRect(0,0,canvas.width,canvas.height);
	Background.Update();
	pipe[0].Update();
	pipe[1].Update();
	pipe[2].Update();
	Floor.Update();
	Bird.Update();
	
	context.font = "100px Arial";
	context.fillText(score,200,150);
}

function End() {
	if(Bird.dy+Bird.dh < 550) {
		if(bird_angle < 90) {
			bird_angle += 3;
		}
		if(jumpheight < 10) {
			jumpheight += 1;
		}
		Bird.dy += jumpheight;
	}
	Bird.Rotate(bird_angle);
	
	document.addEventListener('keydown',Pressy);
	if(restart==true) {
		Floor.Render(0, 0, 533, 100, 0, 525, 533, 100);
		for(var i=0; i<=2; ++i) {
			pipe[i].Render(0, 0, 120, 866, 1000+(300*i), Math.floor(Math.random() * 150)-200, 120, 866);
		}
		
		Bird.Render(0, 0, 68, 48, 225, 250, 68, 48);
		dead=false;
		score=0;
		document.removeEventListener('keydown',Pressy);
		document.removeEventListener('keyup', Release);
		restart=false;
		clearInterval(interval);
		interval = setInterval(Start, framerate);
		return;
	}
	
	context.clearRect(0,0,canvas.width,canvas.height);
	Background.Update();
	pipe[0].Update();
	pipe[1].Update();
	pipe[2].Update();
	Floor.Update();
	Bird.Update();
	
	context.font = "150px Arial";
	context.fillText(score,200,300);
}

function Rectangle(width, height, colour, x, y) {
	this.ctx = c.getContext("2d");
	this.width = width;
	this.height = height;
	this.colour = colour;
	this.x = x;
	this.y = y;
	this.move = [false/*up*/, true/*down*/, false/*left*/, false/*right*/];
	this.originx = 0;
	this.originy = 0;
	
	this.Rotate = function(angle) {
		this.angle = angle;
	}
	
	this.setOrigin = function(originx, originy) {
		this.originx = originx;
		this.originy = originy;
	}
	
	this.Update = function() {
		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.rotate(this.angle*Math.PI/180);
		this.ctx.fillStyle = this.colour;
		this.ctx.fillRect(0-this.originx, 0-this.originy, this.width, this.height);
		this.ctx.restore();
	}
}

function Sprite(imge) {
	this.ctx = c.getContext("2d");
	this.img=document.createElement('img');
	this.img.src=imge;
	this.originx = 0;
	this.originy = 0;
	
	this.Render = function(sx, sy, sw, sh, dx, dy, dw, dh) {
		this.sx = sx;
		this.sy = sy;
		this.sw = sw;
		this.sh = sh;
		this.dx = dx;
		this.dy = dy;
		this.dw = dw;
		this.dh = dh;
	}
	
	this.Rotate = function(angle) {
		this.angle = angle;
	}
	
	this.setOrigin = function(originx, originy) {
		this.originx = originx;
		this.originy = originy;
	}
	
	this.Update = function() {
		this.ctx.save();
		this.ctx.translate(this.dx, this.dy);
		this.ctx.rotate(this.angle*Math.PI/180);
		this.ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, 0-this.originx, 0-this.originy, this.dw, this.dh);
		this.ctx.restore();
		this.angle = 0;
	}
}
function Pressy(e) {
	if (e.keyCode === 32 && jump==false){
		restart=true;
	}
}

function Press(e) {
	if (e.keyCode === 32 && jump==false){
		jump=true;
	}
}
function Release(e) {
	if (e.keyCode === 32 && jump==true){
		jump=false; 
	}
}