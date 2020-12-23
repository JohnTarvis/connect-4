/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

var dropPieceSound = document.getElementById("drop-piece-sound"); 

function playDropPieceSound() { 
  dropPieceSound.play(); 
} 

function makeBoard() {
	board = [];
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }));
	}
	//console.log('orig',board);
}

/** makeHtmlBoard: make HTML table and row of column tops. */


function makeHtmlBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
		const cell = document.createElement('td');

		let cellCover = document.createElement('div');
		cellCover.classList.add('cell-cover');
		cell.append(cellCover);

		cell.setAttribute('id', `${y}-${x}`);
		//cell.classList.add("play-cell");
		row.append(cell);
    }

    board.append(row);
  }
  
  ///-create board cover
  // let boardCover = document.createElement("div");
  // boardCover.id = "board-cover";
  // board.append(boardCover);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */


function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
	alert(msg); 
	setTimeout(function(){
		makeBoard();
		makeHtmlBoard();
	},100);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	
	playDropPieceSound();
	
	// get x from ID of clicked cell
	var x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	var y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		setTimeout(function(){
			return endGame(`Player ${currPlayer} won!`);
		},2000);
	}
	
	// check for tie
	if (board.every(row => row.every(cell => cell))) {
		return endGame('Tie!');
	}

  // switch players
  // TODO: switch currPlayer 1 <-> 2
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }
  
  function _highlightWin(line){
	  for(cell of line){
		  //console.log(cell);
		  //console.log(`${cell[0]}-${cell[1]}`);
		  let cellElement = document.getElementById(`${cell[0]}-${cell[1]}`);
		  cellElement.style.borderColor = "white";
	  }
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
	  
	  if(_win(horiz)){
		  _highlightWin(horiz);
	  }
	  if(_win(vert)){
		  _highlightWin(vert);
	  }
	  if(_win(diagDR)){
		  _highlightWin(diagDR);
	  }
	  if(_win(diagDL)){
		  _highlightWin(diagDL);
	  }	  
	  

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
		return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();


/* function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	let htmlBoard = document.querySelector("#board");

	// TODO: add comment for this code
	///-create a top row that each player can click to add their
	///-piece to a specific column
	var top = document.createElement("tr");
	top.setAttribute("id", "column-top");
	top.addEventListener("click", handleClick);

	///-add individual cells to top row with ids matched to column
	for (var x = 0; x < WIDTH; x++) {
		var headCell = document.createElement("td");
		headCell.setAttribute("id", x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: add comment for this code
	///-add each cell in a 6x7 grid
	for (var y = 0; y < HEIGHT; y++) {
		const row = document.createElement("tr");
		for (var x = 0; x < WIDTH; x++) {
			const cell = document.createElement("td");
			cell.setAttribute("id", `${y}-${x}`);								
			row.append(cell);
		}
		htmlBoard.append(row);																	
	}
} */

/* function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
    let y = -1;
    while(board[x][y + 1] === 0){
        y++;
    }
	if(y === -1){
		return null;
	} else {
		return y;
	}
} */

/* function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
	let piece = document.createElement("div");
	piece.classList.add(`p${currPlayer}`);
	let cell = document.getElementById(`${x}-${y}`);
	board[x][y] = currPlayer;
} */

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
/* 	let tie = true;
	for(let col = 0; col < 7; col++){
		for(let row = 0; row < 6; row++){
			if(board[col][row] === 0){
				tie = false;
			}
		}
	}
	if(tie){
		return endGame("TIE!!!");
	} */

/* function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
	let cols = [];
    for(let col = 0; col < 7; col++){
		let rows = [];
		for(let row = 0; row < 6; row++){
			rows.push(0);
		}		
        cols.push(rows);
    }
    board = cols;	
} */

/* function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(
		  ([y, x]) =>
			y >= 0 &&
			y < HEIGHT &&
			x >= 0 &&
			x < WIDTH &&
			board[y][x] === currPlayer
		);
	}

  // TODO: read and understand this code. Add comments to help you.

	for (var y = 0; y < HEIGHT; y++) {
		for (var x = 0; x < WIDTH; x++) {
			var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
			var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
			var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
			var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
} */
