const rows = 20;
const cols = 20;

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

createTable();
