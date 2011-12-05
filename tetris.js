// <canvas id="tutorial" width="600" height="440"></canvas>

function Map() { // Map des pièces déposées
	this.matrice = new Array(); // 30*22*20pixels dans le canvas
	var him = this;
	this.init = function() {
		for (var i=0; i < 23; i++) {
			him.matrice[i] = new Array();
			for (var j=0; j<30; j++) {
				if (i!==22) him.matrice[i][j]=0;
				else him.matrice[i][j]=1; // sol
			}
		}
	};
	this.add = function(piece) {
		var x = (piece.xp/20)|0; // cast from double vers integer
		var y = (piece.yp/20)|0; // cast from double vers integer
		for (var i=y; i < y+4; i++)
			for (var j=x; j < x+4; j++)
				if (piece.matrice[i-y][j-x]) him.matrice[i][j]=piece.matrice[i-y][j-x];
	};
	this.display = function() {
		articlep.innerHTML='';
		for (var i=0; i < 23; i++) {
			articlep.innerHTML+='<br/>';
			for (var j=0; j<30; j++)
				articlep.innerHTML+=him.matrice[i][j];
		}
	};
	this.collision = function(piece) {
		var x = (piece.xp/20)|0; // cast from double vers integer
		var y = (piece.yp/20)|0; // cast from double vers integer
		for (var i=y; i < y+4; i++)
			for (var j=x; j < x+4; j++)
				if (piece.matrice[i-y][j-x])
					if (him.matrice[i+1][j])
						return true;
		return false;
	};
	this.solve = function() {
		var complete;
		for (var i=0; i < 22; i++) {
			complete = 1;
			for (var j=0; (j<30)&&(complete); j++) {
				if (!him.matrice[i][j]) complete = 0;
			}
			if (complete) {
				for (var i=ligne; i > 0; i--)
					for (var j=0; j<30; j++)
						him.matrice[i][j]=him.matrice[i-1][j];
			}
		}
	};
	this.draw = function() {
		ctx.clearRect(0,0,600,440);
		for (var i=0; i < 22; i++)
			for (var j=0; j < 30; j++)
				if (him.matrice[i][j]) ctx.fillRect(j*20,i*20,20,20);
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
	articlep.innerHTML=''+him.xp+'<br/>'+him.yp;
    him.yp+=1;
    him.draw();
    if ((!map.collision(him))) {
		if (!straightToBot) setTimeout(him.moveToBot,(10/v)|0,v);
		else him.moveToBot(v);
	} else {
		map.add(him);
		map.solve();
		map.draw();
		t = new Piece(300,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
		straightToBot = 0;
		t.moveToBot(v);
	}
  };
  this.moveY = function(y, v) { // y déplacement, v vitesse
    him.clear();
    him.yp+=1;
    him.draw();
    if ((y > 0)&&(!map.collision(him))) setTimeout(him.moveY,(10/v)|0,y-1,v);
	else return false;
  };
  
  //fonction a ameliorer (détection forme pièce en fonction déplacement possible
  this.moveLR = function (s) { // sens
	him.clear();
	if (s===1) {
		if (him.xp<560) him.xp+=20*s;
	}
	else {
		if (him.xp>0) him.xp+=20*s;
	}
	him.draw();
  };
  
  this.turn = function() { // non fonctionnelle, rotationne comme un débile
	him.clear();
	
	var tmp;
		for (var i=0; i < 2; i++) {
			for (var j=0; j < 2; j++) {					
				tmp=him.matrice[i][j];
				him.matrice[i][j]=him.matrice[j][3-i];
				him.matrice[j][3-i]=him.matrice[3-i][3-j];
				him.matrice[3-i][3-j]=him.matrice[3-j][i];
				him.matrice[3-j][i]=tmp;
			}
		}
	him.draw();
  };
}


// INIT
var canvas = document.getElementById('tutorial');
var articlep = document.querySelector('article p');
var straightToBot = 0;
var bot = 0;
if (canvas.getContext){
	var ctx = canvas.getContext('2d');
}
ctx.fillStyle = "rgb(200,0,0)";
document.addEventListener('keyup', function(e){
	switch (e.keyCode) {
		case 38 : t.turn(); break;
		case 37 : t.moveLR(-1); break;
		case 39 : t.moveLR(1); break;
		case 40 : straightToBot=1; break;
		default : break;
	}
}, false);
	
	
// ----------
var map = new Map();
map.init();
var cube = new Piece(200,300,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0); // positionx, positiony, (4*y,) pour x=1..4
var t2 = new Piece(100,300,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0);
var cube2 = new Piece(0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0);
var t = new Piece(100,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0);
//map.display();
t.moveToBot(0.5);
//map.draw();