let rows = 15;
let cols = 23;
const MIN_SIZE = 5;
const MAX_SIZE = 35;

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
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  gridContainer.appendChild(table);
}

function initialize() {
  createTable();
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
  sizeRuler.addEventListener('click', updateGridSize);
}

//update grid size with size ruler input
function updateGridSize(e) {
  const newSize = parseInt(e.target.value);
  rows = newSize;
  cols = Math.round(newSize * 1.5);
  document.querySelector('table').remove();
  createTable();
}

window.onload = initialize();
