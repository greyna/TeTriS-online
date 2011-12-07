function Physics() { // Physics des pièces déposées sous forme matricielle (1 si cube présent, 0 sinon)
	this.matrice = new Array(); // 30*22*20pixels dans le canvas
	var him = this;
	this.init = function() {
		for (var i=0; i < 23; i++) { // 22+1 ligne pour le sol
			him.matrice[i] = new Array();
			for (var j=0; j<32; j++) { // 30+2 colonnes pour les murs
				if ((i!==22)&&(j!==0)&&(j!==31)) him.matrice[i][j]=0;
				else him.matrice[i][j]=1; // sol ou mur
			}
		}
	};
	this.add = function(piece) { // ajoute une pièce à la physic
		var x = (piece.xp/20)|0; // cast from double vers integer
		var y = (piece.yp/20)|0; // ici on récupère la position dans la matrice en fonction de la position sur le canvas (en pixels)
		for (var i=y; i < y+4; i++)
			for (var j=x+1; j < x+5; j++)
				if (piece.matrice[i-y][j-x-1]) him.matrice[i][j]=piece.matrice[i-y][j-x-1];
	};
	this.display = function() { // affiche la matrice avec les 0 et 1 (pour le développeur)
		articlep.innerHTML='';
		for (var i=0; i < 23; i++) {
			articlep.innerHTML+='<br/>';
			for (var j=0; j<32; j++)
				articlep.innerHTML+=him.matrice[i][j];
		}
	};
	this.collisionVerticale = function(piece) { // retourne vrai si une collision verticale arrivera au prochain appel de moveToBot
		var x = (piece.xp/20)|0; // cast from double to integer
		var y = (piece.yp/20)|0;
		for (var i=y; i < y+4; i++)
			for (var j=x+1; j < x+5; j++)
				if (piece.matrice[i-y][j-x-1]) // s'il y a un cube de la piece ici,
					if (him.matrice[i+1][j]) // s'il y a un cube de la physic en-dessous,
						return true; // alors la gravité créerait une collision
		return false;
	};
	this.collisionHorizontale = function(piece) { // retourne vrai si une collision horizontale arrivera au prochain appel de moveToBot
		var x = (piece.xp/20)|0; // cast from double to integer
		var y = (piece.yp/20)|0;
		for (var i=y; i < y+4; i++)
			for (var j=x+1; j < x+5; j++)
				if (piece.matrice[i-y][j-x-1]) { // s'il y a un cube de la piece ici,
					if (him.matrice[i][j-1]) // et s'il y a un cube de la physic à gauche
						return -1;
					if (him.matrice[i][j+1]) // et s'il y a un cube de la physic à droite
						return 1;
				}
		return 0;
	};
	// pour modifier la matrice lorsqu'une ligne est complète (tombée des lignes au-dessus)
	this.solve = function() { // renvoie false si game over
		var complete, gameOver=0;
		
		for (var i=0; i < 22; i++) { // pour chaque ligne de haut en bas
			complete = 1;
			for (var j=1; (j<31)&&(complete); j++) { // pour chaque élément de chaque ligne
				if (!him.matrice[i][j]) complete = 0; // s'il n'y a pas de cube, alors la ligne n'est pas complète
			}
			if (complete) {
				score++;
				articlep.innerHTML='SCORE : '+score;
				for (var k=i; k > 0; k--) // pour chaque ligne depuis la ligne complète de bas en haut
						him.matrice[k]=him.matrice[k-1]; // on copie la ligne d'au dessus en dessous
			}
		}
		
		//game over s'il existe des cubes dans l'emplacement d'arrivée d'une nouvelle pièce
		for (var i=0; (i<4)&&(!gameOver); i++)
			for (var j=12; (j<16)&&(!gameOver); j++)
				if (him.matrice[i][j]) gameOver=1;
		if (gameOver) return false;
		else return true;
	};
	
	this.draw = function() {
		ctx.clearRect(0,0,600,440);
		for (var i=0; i < 22; i++)
			for (var j=1; j < 31; j++)
				if (him.matrice[i][j]) drawCube((j-1)*20,i*20,him.matrice[i][j]);
	};
}


function Piece() { // class Piece
  this.xp = 260; // position milieu
  this.yp = 0;
  this.matrice = new Array(); // état représenté par matrice (1 présent 0 sinon)
  this.matrice[0] = [1,0,0,0]; // colonne y=0
  this.matrice[1] = [1,0,0,0];
  this.matrice[2] = [1,0,0,0];
  this.matrice[3] = [1,0,0,0];
  var him = this;
  
  this.init = function() {
	him.xp=260;
	him.yp=0;
	
	var randomNumber=Math.floor(Math.random()*7);
	var randomColor=Math.floor(Math.random()*3)+1;
	switch(randomNumber) {
		case 0: // T
			him.matrice[0] = [randomColor,randomColor,randomColor,0];
			him.matrice[1] = [0,randomColor,0,0];
			him.matrice[2] = [0,0,0,0];
			him.matrice[3] = [0,0,0,0];
			break;
		case 1: // I
			him.matrice[0] = [randomColor,0,0,0];
			him.matrice[1] = [randomColor,0,0,0];
			him.matrice[2] = [randomColor,0,0,0];
			him.matrice[3] = [randomColor,0,0,0];
			break;
		case 2: // Z
			him.matrice[0] = [randomColor,randomColor,0,0];
			him.matrice[1] = [0,randomColor,randomColor,0];
			him.matrice[2] = [0,0,0,0];
			him.matrice[3] = [0,0,0,0];
			break;
		case 3: // S
			him.matrice[0] = [0,randomColor,randomColor,0];
			him.matrice[1] = [randomColor,randomColor,0,0];
			him.matrice[2] = [0,0,0,0];
			him.matrice[3] = [0,0,0,0];
			break;
		case 4: // L
			him.matrice[0] = [randomColor,0,0,0];
			him.matrice[1] = [randomColor,0,0,0];
			him.matrice[2] = [randomColor,randomColor,0,0];
			him.matrice[3] = [0,0,0,0];
			break;
		case 5: // J
			him.matrice[0] = [0,randomColor,0,0];
			him.matrice[1] = [0,randomColor,0,0];
			him.matrice[2] = [randomColor,randomColor,0,0];
			him.matrice[3] = [0,0,0,0];
			break;
		case 6: // O
			him.matrice[0] = [randomColor,randomColor,0,0];
			him.matrice[1] = [randomColor,randomColor,0,0];
			him.matrice[2] = [0,0,0,0];
			him.matrice[3] = [0,0,0,0];
			break;
	}
  };
  
  // Routine graphique
  this.clear = function() {
    for (var i=0; i < 4; i++)
		for (var j=0; j < 4; j++)
			if (him.matrice[i][j]) ctx.clearRect(him.xp+j*20,him.yp+i*20,20,20);
  };
  this.draw = function() {
    for (var i=0; i < 4; i++)
		for (var j=0; j < 4; j++)
			if (him.matrice[i][j]) drawCube(him.xp+j*20,him.yp+i*20,him.matrice[i][j]);
  };
  
  this.turn = function() {
	var tmp; // ci-dessous l'algorithme permettant de faire une rotation de centre (i=1,j=1)de la matrice 4x4 représentant la pièce
	for (var i=0; i < 2; i++)
		for (var j=0; j < 2; j++) {					
			tmp=him.matrice[i][j];
			him.matrice[i][j]=him.matrice[j][3-i];
			him.matrice[j][3-i]=him.matrice[3-i][3-j];
			him.matrice[3-i][3-j]=him.matrice[3-j][i];
			him.matrice[3-j][i]=tmp;
		}
	if ((physic.collisionHorizontale(him)!==0)) { // dans le cas où tourner impliquerait une collision
		for (var i=0; i < 2; i++) // on applique l'algorithme inverse
			for (var j=0; j < 2; j++) {					
				tmp=him.matrice[3-j][i];
				him.matrice[3-j][i]=him.matrice[3-i][3-j];
				him.matrice[3-i][3-j]=him.matrice[j][3-i];
				him.matrice[j][3-i]=him.matrice[i][j];
				him.matrice[i][j]=tmp;
			}
	}
  };
  
  /* Méthode récursive s'arrêtant quand la piece subit une collision selon la physic, on l'enregistre alors dans la physic puis on réinitialise la piece,
  pour enfin réappeller la méthode sur le même objet afin qu'une nouvelle piece apparaisse au joueur et descende à son tour */
  this.moveToBot = function (period) {
	him.clear(); // on efface le dessin de la pièce actuel avant modification
	
	//affichage coordonnées pièce en direct (waow lé fort le tutur), décommentez ci-dessous
	//articlep.innerHTML='x: '+him.xp+'<br/>y: '+him.yp;
	
    him.yp+=1; // descente d'un pixel
	// Les variables changent d'état en fonction des évènements (voir document.EventListener)
	if (moveR) {
		moveR=0;
		if (physic.collisionHorizontale(him)!==1) him.xp+=20;	// translation Right d'un cube (+20px)
	}
	else if (moveL) { // si l'utilisateur va à gauche et à droite en même temps, ben il ira à droite et ça bugera pas :p
		moveL=0;
		if (physic.collisionHorizontale(him)!==-1) him.xp-=20;	// translation Left d'un cube (-20px)
	}
	if (turn) {
		turn=0;
		him.turn();
	}
	
	
    him.draw(); // on dessine la pièce modifiée
	
	
    if ((!physic.collisionVerticale(him))) {
// appel récursif qui s'effectuera dans (period)millisecondes, permet de gérer la vitesse de descente (v=1/period)
		if (!straightToBot) setTimeout(him.moveToBot,period,period);

// si l'utilisateur appuie sur 'bas' (straightToBot=1), la pièce doit filer jusqu'en bas :
// period = 1ms minimum   <=> vitesse maximum donc pour l'augmenter encore il faudra créer une nouvelle fonction
		else {
			setTimeout(him.moveToBot,1,period);
		}
	}
	else {
		physic.add(him);
		//physic.display();
		straightToBot = 0;
		if (physic.solve()) {
			physic.draw();
			him.init();
			him.moveToBot(period);
		}
		else articlep.innerHTML='GAME OVER<br/>SCORE : '+score;
	}
  };
}

function drawCube(x,y,couleur) {
	switch (couleur) {
		case 1: ctx.fillStyle = "rgb(255,0,0)"; break;
		case 2: ctx.fillStyle = "rgb(0,255,0)"; break;
		case 3: ctx.fillStyle = "rgb(0,0,255)"; break;
		case 4: ctx.fillStyle = "rgb(255,0,255)"; break;
	}
	ctx.fillRect(x,y,20,20);
}

function Game () {
	this.ctx = document.getElementById('tetris').getContext('2d');
	this.ctxInfo = document.getElementById('info').getContext('2d');
	this.articlep = document.querySelector('#game p');
	this.straightToBot = 0, this.moveL=0, this.moveR=0, this.turn=0, this.score=0;
	
}




// INIT
var canvasJeu = document.getElementById('tetris');
var canvasInfo = document.getElementById('info');
var articlep = document.querySelector('#game p');
var straightToBot = 0, moveL=0, moveR=0, turn=0, score=0;
if (canvasJeu.getContext){
	var ctx = canvasJeu.getContext('2d');
}
if (canvasInfo.getContext){
	var ctxInfo = canvasInfo.getContext('2d');
}
ctx.fillStyle = "rgb(200,0,0)";
ctxInfo.fillStyle = "rgb(255,255,255)";
document.addEventListener('keydown', function(e){
	switch (e.keyCode) {
		//case 38 : turn=; break;
		case 37 : moveL=1; break;
		case 39 : moveR=1; break;
		case 40 : straightToBot=1; break;
		default : break;
	}
}, false);
document.addEventListener('keyup', function(e){
	switch (e.keyCode) {
		case 38 : turn=1; break;
		//case 37 : moveL=; break;
		//case 39 : moveR=; break;
		case 40 : straightToBot=0; break;
		default : break;
	}
}, false);

// ----------
var newGame = new Game();

// ----------
var physic = new Physics();
physic.init();
var firstPiece = new Piece();
firstPiece.init();
articlep.innerHTML='SCORE : '+score;
ctxInfo.fillText("Sample String", 10, 50);  
firstPiece.moveToBot(20);