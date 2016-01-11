function GameOfLife() {
	var c = document.getElementById("myCanvas");
	var context = c.getContext("2d");
	var map = [];
	var percentDensity = 0.2;
	var previousMap = [];
	var myInterval;
	/*
	1    2   3
	4  (x,y) 5
    6    7   8
	*/
	var neighbourMap = [[-1,-1], [0, -1], [1, -1], [-1,0], [1,0], [-1,1], [0,1], [1,1]];
	
	this.init = function () {
		//draw grid
		for (var x = 0; x < c.width; x += 10) {
		  context.moveTo(x, 0);
		  context.lineTo(x, c.height);
		}

		for (var y = 0; y < c.height; y += 10) {
		  context.moveTo(0, y);
		  context.lineTo(c.width, y);
		}

		context.moveTo(0,0);
		context.strokeStyle = "#FFF";
		context.stroke();	

		//add click event listener
		c.addEventListener('click', function(e) {
			//round to nearest 10
			var x = Math.round(e.clientX/10) * 10;
			var y = Math.round(e.clientY/10) * 10;

			console.log('clientX, clientY = ' + e.clientX + ',' + e.clientY + ' -- x,y = ' + x + ',' + y);
			//draw cell
			context.fillStyle = "#0F0";
			context.fillRect(x,y,8,8);
		});
	}

	this.togglePlay = function() {
		if (document.getElementById("togglePlayButton").value == "Stop") {
			document.getElementById("togglePlayButton").value = "Start!"
			clearInterval(myInterval);
		}
		else {
			document.getElementById("togglePlayButton").value = "Stop";
			if (map.length == 0) {
				spawnCells();	
			};
			myInterval = setInterval(function(){
				//duplicating array by slice(). This should be done to prevent duplicating array by Reference
				for (var i = 0; i < map.length; i++)
	    			previousMap[i] = map[i].slice();

				for (var x = 0; x < map.length; x++) {
					for (var y = 0; y < map[x].length; y++) {
						processCell(x, y);
					};
				};
			}, 200);
		}
	}

	this.resetMap = function() {
		document.getElementById("togglePlayButton").value = "Start!"
		clearInterval(myInterval);
		map = [];
		for (var x = 0; x < c.width; x += 10) {
			for (var y = 0; y < c.height; y += 10) {
				context.fillStyle = "#000";
				context.fillRect(x,y,8,8);
			}
		}
	}

	var spawnCells = function() {
		for (var x = 0; x < c.width; x+= 10) {
			var tmp = [];
			for (var y = 0; y < c.height; y+= 10) {
				var number = Math.random();
				number = number < percentDensity ? 1 : 0;

				//draw green rect
				if (number == 1) {
					context.fillStyle = "#0F0";
					context.fillRect(x,y,8,8);
				}
				tmp.push(number);
			}
			map.push(tmp);
		}
	}

	//state = 0 (unpopulated), state = 1 (populated)
	var processCell = function(x, y) {
		var state = previousMap[x][y];
		var neighbors = get8Neighbors(x,y);
		
		if (state == 0) {
			if (neighbors.populated == 3) {
				//reproduction
				map[x][y] = 1;
				//draw green rect
				context.fillStyle = "#0F0";
				context.fillRect(x*10,y*10,8,8);
			}
		} else {
			if (neighbors.populated <= 1 || neighbors.populated >= 4) {
				//die due to solitary or overpopulation
				map[x][y] = 0;
				// //draw black rect
				context.fillStyle = "#000";
				context.fillRect(x*10,y*10,8,8);
			} 
		};
	}

	var get8Neighbors = function (x,y) {
		var populated = 0;
		var unpopulated = 0;

		var xIndex;
		var yIndex;

		for (var i = 0; i < neighbourMap.length; i++) {
			xIndex = x + neighbourMap[i][0];
			yIndex = y + neighbourMap[i][1];
			
			xIndex = xIndex == -1 ? (map.length - 1) : xIndex;
			xIndex = xIndex == map.length ? 0 : xIndex;

			yIndex = yIndex == -1 ? (map[0].length - 1) : yIndex;
			yIndex = yIndex == map[0].length ? 0 : yIndex;
			
			previousMap[xIndex][yIndex] == 0 ? unpopulated++ : populated++;
		};
		
		return {"populated":populated, "unpopulated":unpopulated};
	}
}

var gol = new GameOfLife();
gol.init();