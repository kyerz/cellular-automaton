//30 51
let rows = 10;
let cols = 10;
const MIN_SIZE = 10;
const MAX_SIZE = 10;

let isPlaying = false;

let timer = null;
const reproductionTime = 100;
let generationCount = 0;
let cellsRemaining = 0;

let currentColorCell = '#ffffff';
let showBorder = true;

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

function updateCountGeneration(value) {
  const counter = document.querySelector('#count-gen');
  counter.textContent = value;
}

function updateCellsRemaning(value) {
  const countCells = document.querySelector('#count-cells');
  countCells.textContent = value;
}

//update view with new state
function updateView() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.getElementById(`${i}_${j}`);
      if (currentGrid[i][j] === 1) {
        cell.classList.remove('dead');
        cell.classList.add('alive');
        if (currentColorCell !== '#ffffff') {
          cell.style.backgroundColor = currentColorCell;
        }
      } else {
        cell.classList.remove('alive');
        cell.classList.add('dead');
        cell.style.backgroundColor = '';
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
      td.classList.add('show-border');
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
  updateCellsRemaning(cellsRemaining);
  updateCountGeneration(generationCount);
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

  const randomBtn = document.querySelector('#random-btn');
  randomBtn.addEventListener('click', randomButtonHandler);

  const colorCellBtn = document.querySelector('#colorCell');
  colorCellBtn.addEventListener('input', changeColorCellHandler);

  const spacingBorderBtn = document.querySelector('.border-spacing-btn');
  spacingBorderBtn.addEventListener('click', borderSpacingHandler);

  const borderStatus = document.querySelector('.border-btn');
  borderStatus.addEventListener('click', borderStatusHandler);
}

//update grid size with size ruler input
function updateGridSizeHandler(e) {
  const newSize = parseInt(e.target.value);
  rows = newSize;
  cols = Math.round(newSize * 1.7);
  currentGrid = new Array(rows);
  nextGrid = new Array(rows);
  document.querySelector('table').remove();
  createTable();
  initializeGrid();
  resetGrids();
  generationCount = 0;
  updateCountGeneration(generationCount);

  cellsRemaining = 0;
  updateCellsRemaning(cellsRemaining);

  document.querySelector('#start-btn').textContent = 'Start';
  isPlaying = false;
}

function startButtonHandler(e) {
  const colorCellBtn = document.querySelector('#colorCell');
  const colorPickCtn = document.querySelector('.color-pick-container');
  if (!isPlaying) {
    e.target.textContent = 'Pause';
    isPlaying = true;
    colorCellBtn.disabled = true;
    colorPickCtn.style.opacity = 0.5;
    play();
  } else {
    e.target.textContent = 'Continue';
    isPlaying = false;
    colorCellBtn.disabled = false;
    colorPickCtn.style.opacity = 1;
    clearTimeout(timer);
  }
}
function clearButtonHandler() {
  const startBtn = document.querySelector('#start-btn');
  startBtn.textContent = 'Start';
  isPlaying = false;

  const cellList = Array.from(document.querySelectorAll('.alive'));
  for (let i = 0; i < cellList.length; i++) {
    cellList[i].classList.remove('alive');
    cellList[i].classList.add('class', 'dead');
    cellList[i].style.backgroundColor = '';
  }
  resetGrids();
  generationCount = 0;
  updateCountGeneration(generationCount);
  cellsRemaining = 0;
  updateCellsRemaning(cellsRemaining);
}

function randomButtonHandler() {
  if (isPlaying) {
    clearButtonHandler();
  }

  cellsRemaining = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const status = Math.round(Math.random());
      currentGrid[i][j] = status;
      if (status === 1) {
        cellsRemaining++;
      }
    }
  }
  updateView();
  generationCount = 0;
  updateCountGeneration(generationCount);

  updateCellsRemaning(cellsRemaining);
}

//change cells color with picker color
function changeColorCellHandler(e) {
  currentColorCell = e.target.value;
  updateView();
}

//change border spacing
function borderSpacingHandler(e) {
  const spacingStatus = document.querySelector('#spacing-status');
  const table = document.querySelector('table');
  if (spacingStatus.textContent === 'ON') {
    spacingStatus.textContent = 'OFF';
    table.style.borderSpacing = '0';
  } else {
    spacingStatus.textContent = 'ON';
    table.style.borderSpacing = '2px';
  }
}

//toggle show grid border
function borderStatusHandler() {
  const borderStatus = document.querySelector('#border-status');
  if (borderStatus.textContent === 'ON') {
    showBorder = false;
    borderStatus.textContent = 'OFF';
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = document.getElementById(`${i}_${j}`);
        cell.classList.remove('show-border');
      }
    }
  } else {
    showBorder = true;
    borderStatus.textContent = 'ON';
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = document.getElementById(`${i}_${j}`);
        cell.classList.add('show-border');
      }
    }
  }
}

//live or dead cell on click
function cellClickHandler(e) {
  const cellPosition = e.target.id.split('_');
  const rowPosition = cellPosition[0];
  const colPosition = cellPosition[1];
  if (e.target.className === 'alive') {
    currentGrid[rowPosition][colPosition] = 0;
    e.target.setAttribute('class', 'dead');

    cellsRemaining--;
    updateCellsRemaning(cellsRemaining);
  } else {
    currentGrid[rowPosition][colPosition] = 1;
    e.target.setAttribute('class', 'alive');

    cellsRemaining++;
    updateCellsRemaning(cellsRemaining);
  }
}

function play() {
  cellsRemaining = 0;
  computeNexGeneration();

  if (isPlaying) {
    generationCount++;
    updateCountGeneration(generationCount);
    updateCellsRemaning(cellsRemaining);
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
      cellsRemaining++;
    } else if (totalNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else {
    if (totalNeighbors === 3) {
      nextGrid[row][col] = 1;
      cellsRemaining++;
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
