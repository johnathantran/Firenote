// Make the DIV element draggable:
//dragElement(document.getElementById("mydiv"));

// gets an element
function getElm(e) {
   e = e || window.event;
   e = e.target || e.srcElement;
   console.log(e);
   return e;
}
function dragElement(elmnt) {
  // get the div header element
  elmnt = getElm();
  // get the parent div element
  elmnt = elmnt.parentNode;
  // get the index of div element
  idx = elmnt.id.slice(-1);

  elmnt = document.getElementById("mydiv" + idx);
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    console.log(e);
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  }
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function addNote() {
  idx++;
  //console.log("index: " + idx.toString());
  var note = document.createElement('div');
  note.id = "mydiv" + idx.toString();
  document.body.appendChild(note);
  note.classList.add('drag');
  note.innerHTML += '<div id="mydiv' + idx.toString() + 'header" class="dragHeader" onmousedown="dragElement()" contentEditable="true">Note ' + idx.toString() + '<button class="close" onclick="deleteNote()">x</button></div>';
  note.innerHTML += '<input id="task' + idx.toString() + '"><button id="add" onclick="add()">Add</button>';
  note.innerHTML += '<div id="todos' + idx.toString() + '"></div>';
  console.log(note.innerHTML);
}

function deleteNote() {
  var elmnt = getElm();
  // get the parent div element (the note)
  elmnt = elmnt.parentNode;
  current_idx = elmnt.id.slice(-1);
  var todo = get_todos(current_idx);
  // remove all list items
  for (i = 1; i <= todo.length; i++) {
    removeAll(current_idx);
  }
  // remove the div
  //elmnt.remove();
}

function removeAll(target_idx) {

    console.log("Index: " + current_idx);
    console.log(this);
    var id = this.getAttribute('id');
    //var todos = get_todos(idx);

    var todos_str = localStorage.getItem('todo' + current_idx);
    var todos = JSON.parse(todos_str);
    console.log(todos);

    todos.splice(id, 1);
    localStorage.setItem('todo' + current_idx, JSON.stringify(todos));

    show(current_idx);

    return false;
}

function get_todos(idx) {
    // make a new array of arrays containing todos of each note
    var allTodos = new Array;

    // for each note, get the array of todos, where idx= total # of notes
    for (i = 1; i <= idx; i++) {
      var todos = new Array;
      var todos_str = localStorage.getItem('todo' + i);
      if ((todos_str !== "undefined") && (todos !== null)){
          todos = JSON.parse(todos_str);
          console.log(todos);
          allTodos.push(todos);
      }
    }
    console.log("Index is " + idx );
    console.log(allTodos);
    console.log(allTodos[idx-1]);
    // return the todo list for the requested note
    return allTodos[idx-1];
}

function add() {

    var elmnt = getElm();
    // get the parent div element
    elmnt = elmnt.parentNode;
    console.log(elmnt);
    // get the index of div element
    current_idx = elmnt.id.slice(-1);
    console.log(current_idx);
    // add a task for that note
    var todos = new Array;
    var task = document.getElementById('task' + current_idx).value;
    // get the current list of todos for that note
    var todos_str = localStorage.getItem('todo' + current_idx);

    // if there is an actual list
    if (todos_str !== "undefined") {

      // add the new task to the list of todos for that note
      var todos = JSON.parse(todos_str);
      console.log(todos);
      if (todos !== null) {
        //var todos = JSON.parse(todos_str);
        if (todos[todos.length - 1] != task) {
          todos.push(task);
        }
      }
      // if there is no note yet
      else {
        var todos = new Array;
        todos.push(task);
      }
    }
    console.log(todos);
    localStorage.setItem('todo' + current_idx, JSON.stringify(todos));
    show(current_idx);

    return false;
}

function remove() {
    var elmnt = getElm();
    console.log(elmnt);
    // get the parent div element
    elmnt = elmnt.parentNode.parentNode.parentNode;
    // get the index of div element
    current_idx = elmnt.id.slice(-1);
    console.log("Index: " + current_idx);
    console.log(this);
    var id = this.getAttribute('id');
    //var todos = get_todos(idx);

    var todos_str = localStorage.getItem('todo' + current_idx);
    var todos = JSON.parse(todos_str);
    console.log(todos);

    todos.splice(id, 1);
    localStorage.setItem('todo' + current_idx, JSON.stringify(todos));

    show(current_idx);

    return false;
}

function show(idx) {
    console.log(idx);
    var todos = get_todos(idx);
    console.log(todos);
    var html = '<ul>';

    for(var i=0; i<todos.length; i++) {
        html += '<li><button class="remove" id="' + i  + '">x</button>' + todos[i] + '</li>';
    };
    html += '</ul>';

    document.getElementById('todos' + idx).innerHTML = html;

    var buttons = document.getElementsByClassName('remove');
    for (var i=0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    };
}

var idx = 0;
var offsetTop = 50;
for (i = 1; i <= 10; i++) {
  if ( localStorage.getItem('todo' + i) !== null) {

    if (i > 1) {
      i--;
    }
    console.log('todo' + i);
    idx++;

    var note = document.createElement('div');
    note.id = "mydiv" + idx.toString();
    document.body.appendChild(note);
    note.classList.add('drag');
    note.innerHTML += '<div id="mydiv' + idx.toString() + 'header" class="dragHeader" onmousedown="dragElement()" contentEditable="true"> Note ' + idx.toString() + '<button class="close" onclick="deleteNote()">x</button></div>';
    note.innerHTML += '<input id="task' + idx.toString() + '"><button id="add" onclick="add()">+ Add</button>';
    note.innerHTML += '<div id="todos' + idx.toString() + '"></div>';
    note.style.top = offsetTop.toString() + "px";
    //offsetLeft = 100;
    //elmnt.style.left = offsetLeft.toString() + "px";
    offsetTop += 200;
    show(i);
    //offsetLeft += 100;
  }
  console.log(localStorage.getItem('todo' + i));
}

// Execute a function when the user releases a key on the keyboard
var input = document.getElementById('add');



input.addEventListener('click', add);
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    var elmnt = getElm();
    // get the parent div element
    elmnt = elmnt.parentNode;
    console.log(elmnt);
    document.getElementById("add").click();
  }
});

show(idx);
