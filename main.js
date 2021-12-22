let rows = 15;
let cols = 23;
const MIN_SIZE = 5;
const MAX_SIZE = 35;

let isPlaying = false;

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
  document.querySelector('table').remove();
  createTable();
  currentGrid = new Array(rows);
  nextGrid = new Array(rows);
  initializeGrid();
  resetGrids();
}

function startButtonHandler(e) {
  if (!isPlaying) {
    e.target.textContent = 'Pause';
    isPlaying = true;
    console.log('start the game', isPlaying);
  } else {
    e.target.textContent = 'Continue';
    isPlaying = false;
    console.log('stop for a moment', isPlaying);
  }
}
function clearButtonHandler() {
  const startBtn = document.querySelector('#start-btn');
  startBtn.textContent = 'Start';
  isPlaying = false;
  console.log(' clear the grid', isPlaying);
}

//live or dead cell on click
function cellClickHandler(e) {
  if (e.target.className === 'alive') {
    e.target.setAttribute('class', 'dead');
  } else {
    e.target.setAttribute('class', 'alive');
  }
}

window.onload = initialize();
