console.clear();

document.addEventListener('DOMContentLoaded', function () {

checkLocalStorage();

function checkLocalStorage() {
if (localStorage.getItem('table') !== null) {
    let tableLocal = localStorage.getItem('table');
    document.querySelector('#tableContainer').innerHTML = tableLocal;
  }
}

$.getJSON('http://jsonplaceholder.typicode.com/users', function(data) {

let arrData = [];
let tableTh = [];

function getDataFromJSON (data) {
  data.forEach(function(person) {
  Object.keys(person).forEach(function(prop) {
    if (typeof person[prop] === 'string' || prop === 'id') {
      arrData.push(person[prop]);
      if (tableTh.indexOf(prop) === -1) {
        tableTh.push(prop);
      }
    }
  })
})
//decotate column name
  tableTh.forEach(function(item, i) {
    tableTh.splice(i, 1, item.toUpperCase());
  });

//concat column name & data
  arrData = tableTh.concat(arrData);
  tableTh = '';
}

getDataFromJSON(data);

function createTable () {
  let table = '';
  let tableTd = '',
  tableTr = '',
  thead = '',
  tbody = '';

  arrData
    .forEach(function(item, i) {
      if (i < 6) {
        tableTh += '<th>' + item + '</th>';
      }
        thead = '<thead>' + '<tr>' + tableTh + '</tr>' + '</thead>';
    });

  arrData
    .forEach(function(item, i) {
      if (i >= 6) {
        tableTd += '<td>' + arrData[i] + '</td>';
        
        if ((i + 1) % 6 === 0) {
          tableTr += '<tr>' + tableTd + '</tr>';
          tableTd = '';
        }
        tbody = '<tbody>' + tableTr + '</tbody>';
      }
    })
        table = '<table>' + thead + tbody + '</table>';
        return table;
}
  function addTable () {
    let tableWrap = document.querySelector('#tableContainer');
        let table = createTable();
        tableWrap.innerHTML = table;
  }
  addTable();

function setAttrToTh () {
  let thNodeList = document.querySelectorAll('TH');

  thNodeList.forEach(function (item) {
    item.setAttribute('data-sortable', 'true');

    if (item.innerText !== 'ID' && 
        item.innerText !== 'PHONE') {
          item.setAttribute('data-type', 'string');
    } else {
          item.setAttribute('data-type', 'number');
    }
  })
}
setAttrToTh();

//input by dblclick 
let tabQuery = document.querySelector('table');
tabQuery.addEventListener('dblclick', dblClickToTable);

  function dblClickToTable (event) {
    let target = event.target;
    let oldValue = '';
  
  if (target.tagName !== 'TD') return; 
    else {
      oldValue = target.innerHTML;
      target.innerHTML = '<input id="inp" name="input" autofocus/>';
    }
      let inputId = document.getElementById('inp');
      inputId.value = oldValue;
  
  inputId.addEventListener('keypress', inpByEnter); 

  function inpByEnter (event){
    if (event.charCode === 13) {
      target.innerHTML = inputId.value;

      if (!inputId.value) {
        target.innerHTML = oldValue;
      }
    }
  }

  tabQuery.addEventListener('click', inpByClick);

    function inpByClick (event) {
     if (event.target.tagName !== 'INPUT') {
       if (inputId.value) {
          target.innerHTML = inputId.value;
       } else {
          target.innerHTML = oldValue;
       }
     }
   }
}

//sort
function toArray (list){
    return Array.prototype.slice.call(list);
  }

function sortByIndex (table, index) {

  let tBody = tabQuery.lastChild,
      rowsCollection = tBody.rows,
      target = event.target,
      compare;

  //sort string
  if (target.getAttribute('data-type') === 'string') {
      let dataSort = event.target.getAttribute('data-sort');
      if (!dataSort || dataSort === 'up') {
        
        target.setAttribute('data-sort','down');
        addCLassForArrow();

          compare = toArray(rowsCollection)
            .sort(function (NodeA, NodeB) {
              return NodeA.children[index].innerHTML > 
                     NodeB.children[index].innerHTML;
            })
      } else {
        target.setAttribute('data-sort','up');
        addCLassForArrow();

          compare = toArray(rowsCollection)
            .sort(function (NodeA, NodeB) {
              return NodeA.children[index].innerHTML < 
                     NodeB.children[index].innerHTML;
            })
        }

  //sort number
} else if (target.getAttribute('data-type') === 'number'){
      
        let regResult = '';
        function getReadyPhone(str) {
          regResult = str.match(/\d+/g).join('');
          return regResult; 
      }

      let dataSortNum = event.target.getAttribute('data-sort');

      if (!dataSortNum || dataSortNum === 'up') {
        target.setAttribute('data-sort','down');
        addCLassForArrow();

          compare = toArray(rowsCollection)
            .sort(function (NodeA, NodeB) {
               return getReadyPhone(NodeA.children[index].innerHTML) - 
                      getReadyPhone(NodeB.children[index].innerHTML);
            })
      } else {
        target.setAttribute('data-sort','up');
        addCLassForArrow();

          compare = toArray(rowsCollection)
            .sort(function (NodeA, NodeB) {
              return getReadyPhone(NodeB.children[index].innerHTML) - 
                     getReadyPhone(NodeA.children[index].innerHTML);
          })
        }
  }
    compare.forEach(function(node) {
      tBody.appendChild(node);
    })
}

    document.querySelector('table')
      .addEventListener('click', function(event){
        if (event.target.getAttribute('data-sortable') === 'true') {
          let cellIndex = event.target.cellIndex;
            sortByIndex(this, cellIndex);
        }
      })

    function addCLassForArrow() {
      let target = event.target;
      let dataSort = event.target.getAttribute('data-sort')
      clearArrowClass();

      if (dataSort === 'down') {
        target.classList.remove('sort-up');
        target.classList.add('sort-down');
      } else {
        target.classList.remove('sort-down');
        target.classList.add('sort-up');
        }
    } 

    function clearArrowClass () {
      let thNode = document.querySelectorAll('th');
        thNode.forEach(function (item) {
          if (item !== event.target) {
            item.classList.remove('sort-up');
            item.classList.remove('sort-down');
          }        
        })
    } 

  })
})
