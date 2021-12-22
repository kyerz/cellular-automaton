let rows = 15;
let cols = 23;
const MIN_SIZE = 5;
const MAX_SIZE = 35;

let isPlaying = false;

let timer = null;
const reproductionTime = 100;

let currentGrid = new Array(rows);
let nextGrid = new Array(rows);

//initialize currentGrid & nextGrid
function initializeGrid() {
  for (let i = 0; i < rows; i++) {
    currentGrid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      currentGrid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

//copy nextGrid to grid & reset nextGrid for the next cycle
function updateGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      currentGrid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

//update view with new state
function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.getElementById(`${i}_${j}`);
      if (currentGrid[i][j] === 1) {
        cell.setAttribute('class', 'alive');
      } else {
        cell.setAttribute('class', 'dead');
      }
    }
  }
}

//create grid with ID and dead class for td
function createTable() {
  const gridContainer = document.querySelector('#gridContainer');

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < cols; j++) {
      const td = document.createElement('td');
      td.setAttribute('class', 'dead');
      td.setAttribute('id', `${i}_${j}`);
      td.addEventListener('click', cellClickHandler);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  gridContainer.appendChild(table);
}

function initialize() {
  createTable();
  initializeGrid();
  resetGrids();
  setupRangeSizeRulerBtn();
  setupControlButtons();
}

function setupRangeSizeRulerBtn() {
  const sizeRuler = document.querySelector('#sizeRuler');
  sizeRuler.setAttribute('min', MIN_SIZE);
  sizeRuler.setAttribute('max', MAX_SIZE);
}

//setup listener all buttons menu
function setupControlButtons() {
  const sizeRuler = document.querySelector('#sizeRuler');
  sizeRuler.addEventListener('click', updateGridSizeHandler);

  const startBtn = document.querySelector('#start-btn');
  startBtn.addEventListener('click', startButtonHandler);

  const clearBtn = document.querySelector('#clear-btn');
  clearBtn.addEventListener('click', clearButtonHandler);
}

//update grid size with size ruler input
function updateGridSizeHandler(e) {
  const newSize = parseInt(e.target.value);
  rows = newSize;
  cols = Math.round(newSize * 1.5);
  currentGrid = new Array(rows);
  nextGrid = new Array(rows);
  document.querySelector('table').remove();
  createTable();
  initializeGrid();
  resetGrids();
  document.querySelector('#start-btn').textContent = 'Start';
  isPlaying = false;
}

function startButtonHandler(e) {
  if (!isPlaying) {
    e.target.textContent = 'Pause';
    isPlaying = true;
    console.log('start the game', isPlaying);
    play();
  } else {
    e.target.textContent = 'Continue';
    isPlaying = false;
    clearTimeout(timer);
    console.log('stop for a moment', isPlaying);
  }
}
function clearButtonHandler() {
  const startBtn = document.querySelector('#start-btn');
  startBtn.textContent = 'Start';
  isPlaying = false;
  console.log(' clear the grid', isPlaying);

  const cellList = Array.from(document.querySelectorAll('.alive'));
  for (let i = 0; i < cellList.length; i++) {
    cellList[i].setAttribute('class', 'dead');
  }
  resetGrids();
}

//live or dead cell on click
function cellClickHandler(e) {
  const cellPosition = e.target.id.split('_');
  const rowPosition = cellPosition[0];
  const colPosition = cellPosition[1];
  if (e.target.className === 'alive') {
    currentGrid[rowPosition][colPosition] = 0;
    e.target.setAttribute('class', 'dead');
  } else {
    currentGrid[rowPosition][colPosition] = 1;
    e.target.setAttribute('class', 'alive');
  }
}

function play() {
  computeNexGeneration();

  if (isPlaying) {
    timer = setTimeout(play, reproductionTime);
    updateView();
  }
}

function computeNexGeneration() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
  //copy nextgrid to grid & reset nextgrid
  updateGrids();
}

//Apply the rules according to the number of neighbors
function applyRules(row, col) {
  const totalNeighbors = countNeighbors(row, col);
  if (currentGrid[row][col] === 1) {
    if (totalNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (totalNeighbors === 2 || totalNeighbors === 3) {
      nextGrid[row][col] = 1;
    } else if (totalNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else {
    if (totalNeighbors === 3) {
      nextGrid[row][col] = 1;
    }
  }
}

//count the neighbors around the cell
function countNeighbors(row, col) {
  let count = 0;
  //up left
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (currentGrid[row - 1][col - 1] === 1) count++;
  }
  //up center
  if (row - 1 >= 0) {
    if (currentGrid[row - 1][col] === 1) count++;
  }
  //up right
  if (row - 1 >= 0 && col + 1 < cols) {
    if (currentGrid[row - 1][col + 1] === 1) count++;
  }
  //left
  if (col - 1 >= 0) {
    if (currentGrid[row][col - 1] === 1) count++;
  }
  //right
  if (col + 1 < cols) {
    if (currentGrid[row][col + 1] === 1) count++;
  }
  //bottom left
  if (row + 1 < rows && col - 1 >= 0) {
    if (currentGrid[row + 1][col - 1] === 1) count++;
  }
  //bottom center
  if (row + 1 < rows) {
    if (currentGrid[row + 1][col] === 1) count++;
  }
  //bottom right
  if (row + 1 < rows && col + 1 < cols) {
    if (currentGrid[row + 1][col + 1] === 1) count++;
  }
  return count;
}

window.onload = initialize();
