// <canvas id="tutorial" width="600" height="440"></canvas>

function game() { // non fonctionnelle, boucle à l'infini (apparamment)
	var endgame = 1;
	var i = 1;
	var t = new Piece(33,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0);
	t.moveToBot(2);
	while (i=3) {
		if (!map.collision(t)) {
			map.add(t);
			var t = new Piece(33,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0);
			t.moveToBot(2);
			i++;
		}
	}
} 


function Map() { // Map des pièces déposées
	this.matrice = new Array(); // 30*23*20pixels dans le canvas
	var him = this;
	this.init = function() {
		for (var i=0; i < 30; i++) {
			him.matrice[i] = new Array();
			for (var j=0; j<22; j++)
				him.matrice[i][j]=0;
			him.matrice[i][23]=1; // sol
		}
	};
	this.add = function(piece) {
		var x = (piece.xp/20)|0; // cast from double vers integer
		var y = (piece.yp/20)|0; // cast from double vers integer
		for (var i=x; i < x+4; i++)
			for (var j=y; j < y+4; j++)
				him.matrice[i][j]=piece.matrice[i-x][j-y];
	};
	this.display = function() {
		for (var i=0; i < 30; i++) {
			articlep.innerHTML+='<br/>';
			for (var j=0; j<23; j++)
				articlep.innerHTML+=him.matrice[i][j];
		}
	};
	this.collision = function(piece) {
		var x = (piece.xp/20)|0; // cast from double vers integer
		var y = (piece.yp/20)|0; // cast from double vers integer
		for (var i=x; i < x+4; i++)
			for (var j=y; j < y+4; j++)
				if (piece.matrice[i-x][j-y])
					if (him.matrice[i][j+1])
						return true;
		return false;
	};
}


function Piece(xp,yp,x1,x2,x3,x4,y1,y2,y3,y4,z1,z2,z3,z4,v1,v2,v3,v4) {
  this.xp = xp; //position
  this.yp = yp;
  this.matrice = new Array(); // état représenté par matrice (1 présent 0 sinon)
  this.matrice[0] = [x1,x2,x3,x4]; // colonne y=0
  this.matrice[1] = [y1,y2,y3,y4];
  this.matrice[2] = [z1,z2,z3,z4];
  this.matrice[3] = [v1,v2,v3,v4];
  var him = this;
  
  this.init = function() {
	
  };
  this.clear = function() {
    for (var i=0; i < 4; i++)
		for (var j=0; j < 4; j++)
			if (him.matrice[i][j]) ctx.clearRect(him.xp+j*20,him.yp+i*20,20,20);
  };
  this.draw = function() {
    for (var i=0; i < 4; i++)
		for (var j=0; j < 4; j++)
			if (him.matrice[i][j]) ctx.fillRect(him.xp+j*20,him.yp+i*20,20,20);
  };
  this.moveToBot = function (v) {
	him.clear();
    him.yp+=1;
    him.draw();
    if (!map.collision(him)) setTimeout(him.moveToBot,(10/v)|0,v);
	else return false;
  };
  this.moveY = function(y, v) { // y déplacement, v vitesse
    him.clear();
    him.yp+=1;
    him.draw();
    if ((y > 0)&&(!map.collision(him))) setTimeout(him.moveY,(10/v)|0,y-1,v);
	else return false;
  };
  
  this.turn = function() { // non fonctionnelle, rotationne comme un débile
	him.clear();
	
	var tmp;
		for (var i=0; i < 4; i++) {
			for (var j=0; j < 4; j++) {
				tmp=him.matrice[i][j];
				him.matrice[i][j]=him.matrice[j][3-i];
				him.matrice[j][3-i]=tmp;
			}
		}
	him.draw();
  };
}


// INIT
var canvas = document.getElementById('tutorial');
var articlep = document.querySelector('article p');
if (canvas.getContext){
	var ctx = canvas.getContext('2d');
}
ctx.fillStyle = "rgb(200,0,0)";
document.addEventListener('keyup', function(e){
	switch (e.keyCode) {
		case 38 : t.turn(); break;
		default : break;
	}
}, false);

	
	
// ----------
var map = new Map();
map.init();
var cube = new Piece(100,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0); // positionx, positiony, (4*y,) pour x=1..4
var t2 = new Piece(100,300,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0);
var t = new Piece(100,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0);
t2.draw();
t2.turn();
map.add(t2);
t.moveToBot(0.5);