// <canvas id="tutorial" width="600" height="440"></canvas>

function Map() { // Map des pièces déposées sous forme matricielle (1 si cube présent, 0 sinon)
	this.matrice = new Array(); // 30*22*20pixels dans le canvas
	var him = this;
	this.init = function() {
		for (var i=0; i < 23; i++) { // 22+1 ligne pour le sol
			him.matrice[i] = new Array();
			for (var j=0; j<30; j++) { // 30 colonnes
				if (i!==22) him.matrice[i][j]=0;
				else him.matrice[i][j]=1; // sol
			}
		}
	};
	this.add = function(piece) { // ajoute une pièce à la map
		var x = (piece.xp/20)|0; // cast from double vers integer
		var y = (piece.yp/20)|0; // ici on récupère la position dans la matrice en fonction de la position sur le canvas (en pixels)
		for (var i=y; i < y+4; i++)
			for (var j=x; j < x+4; j++)
				if (piece.matrice[i-y][j-x]) him.matrice[i][j]=piece.matrice[i-y][j-x];
	};
	this.display = function() { // affiche la matrice avec les 0 et 1 (pour le développeur)
		articlep.innerHTML='';
		for (var i=0; i < 23; i++) {
			articlep.innerHTML+='<br/>';
			for (var j=0; j<30; j++)
				articlep.innerHTML+=him.matrice[i][j];
		}
	};
	this.collision = function(piece) { // retourne vrai si une collision arrivera au prochain appel de moveToBot
		var x = (piece.xp/20)|0; // cast from double to integer
		var y = (piece.yp/20)|0;
		for (var i=y; i < y+4; i++)
			for (var j=x; j < x+4; j++)
				if (piece.matrice[i-y][j-x]) // s'il y a un cube de la piece ici,
					if (him.matrice[i+1][j]) // s'il y a un cube de la map en-dessous,
						return true; // alors la gravité créerait une collision
		return false;
	};
	this.solve = function() { // pour modifier la matrice lorsqu'une ligne est complète
		var complete;
		for (var i=0; i < 22; i++) { // pour chaque ligne de haut en bas
			complete = 1;
			for (var j=0; (j<30)&&(complete); j++) { // pour chaque élément de chaque ligne
				if (!him.matrice[i][j]) complete = 0; // s'il n'y a pas de cube, alors la ligne n'est pas complète
			}
			if (complete) {
				for (var k=i; k > 0; k--) // pour chaque ligne depuis la ligne complète de bas en haut
						him.matrice[k]=him.matrice[k-1]; // on copie la ligne d'au dessus en dessous
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


function Piece(xp,yp,x1,x2,x3,x4,y1,y2,y3,y4,z1,z2,z3,z4,v1,v2,v3,v4) { // class Piece
  this.xp = xp; // position
  this.yp = yp;
  this.matrice = new Array(); // état représenté par matrice (1 présent 0 sinon)
  this.matrice[0] = [x1,x2,x3,x4]; // colonne y=0
  this.matrice[1] = [y1,y2,y3,y4];
  this.matrice[2] = [z1,z2,z3,z4];
  this.matrice[3] = [v1,v2,v3,v4];
  var him = this;
  
  // Routine graphique
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
  
  /* Méthode récursive s'arrêtant quand la piece subit une collision selon la map, on l'enregistre alors dans la map puis on réinitialise la piece,
  pour enfin réappeller la méthode sur le même objet afin qu'une nouvelle piece apparaisse au joueur et descende à son tour */
  this.moveToBot = function (period) {
	him.clear(); // on efface le dessin de la pièce actuel avant modification
	//affichage coordonnées pièce, décommentez ci-dessous
	//articlep.innerHTML='x: '+him.xp+'<br/>y: '+him.yp;
	
    him.yp+=1; // descente d'un pixel
	// Les variables changent d'état en fonction des évènements (voir document.EventListener)
	if (moveR) {
		moveR=0;
		if (him.xp<560) him.xp+=20; // translation Right d'un cube (20px)
	}
	if (moveL) {
		moveL=0;
		if (him.xp>0) him.xp-=20; // translation Left d'un cube (-20px)
    }
	if (turn) {
		turn=0;
		var tmp; // ci-dessous l'algorithme permettant de faire une rotation de centre (i=1,j=1)de la matrice 4x4 représentant la pièce
		for (var i=0; i < 2; i++) {
			for (var j=0; j < 2; j++) {					
				tmp=him.matrice[i][j];
				him.matrice[i][j]=him.matrice[j][3-i];
				him.matrice[j][3-i]=him.matrice[3-i][3-j];
				him.matrice[3-i][3-j]=him.matrice[3-j][i];
				him.matrice[3-j][i]=tmp;
			}
		}
	}
	
    him.draw(); // on dessine la pièce modifiée
	
	
    if ((!map.collision(him))) {
// appel récursif qui s'effectuera dans (period)millisecondes, permet de gérer la vitesse de descente (v=1/period)
		if (!straightToBot) setTimeout(him.moveToBot,period,period);

// si l'utilisateur appuie sur 'bas' (straightToBot=1), la pièce doit filer jusqu'en bas :
// period = 1ms minimum   <=> vitesse maximum donc pour l'augmenter encore il faudra créer une nouvelle fonction
		else setTimeout(him.moveToBot,1,period);
	}
	else {
		map.add(him);
		//map.display();
		map.solve();
		map.draw();
		him = new Piece(300,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
		straightToBot = 0;
		him.moveToBot(period);
	}
  };
}


// INIT
var canvas = document.getElementById('tutorial');
var articlep = document.querySelector('article p');
var straightToBot = 0, bot = 0, moveL=0, moveR=0, turn=0;
if (canvas.getContext){
	var ctx = canvas.getContext('2d');
}
ctx.fillStyle = "rgb(200,0,0)";
document.addEventListener('keydown', function(e){
	switch (e.keyCode) {
		case 38 : turn=1; break;
		case 37 : moveL=1; break;
		case 39 : moveR=1; break;
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
t.moveToBot(10);
//map.draw();