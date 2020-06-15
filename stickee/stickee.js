// A brief guide to defined variables:
// N: any integer
// 'todoN': represents a LIST of todo items for any note of index N
// 'headerTextN': the text element of the header of note N
// 'headerItemN': the text element of the header of note N in the Notes Dock

//localStorage.removeItem(11);
$(document).ready(function() {
  $(".task").on('keyup', function (e) {
      if (e.keyCode === 13) {
          elm = getElm();
          console.log(elm);
          // click the Add button for that note when enter key is pressed
          elm.parentNode.childNodes[5].click();
      }
  });
  // enable edits to note header
  $(".dragHeader").on('keyup', function (e) {
      if (e.keyCode === 13) {
          elm = getElm();
          var new_header = elm.textContent;
          elm.setAttribute("contentEditable",false);
          //elm.parentNode.childNodes[1].src = "images/edit.svg";
          elm.textContent = new_header;

          idx = elm.parentNode.id.slice(-1);
          dict = JSON.parse(localStorage.getItem(idx,dict));
          dict['headerText'] = header.textContent;
          localStorage.setItem(idx, JSON.stringify(dict));
          document.querySelector('#headerItem' + idx).textContent = header.textContent; // update note dock
      }
  });

  var coll = document.getElementsByClassName("collapsible");
  var i;
  
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }
});

// add event listeners to onclick elements
document.addEventListener('DOMContentLoaded', function() {

  //hide menu button
  var el = document.getElementById('hideMenu');
  el.addEventListener('click', function() {
      hideMenu(this);
  });

  // dark mode button
  var el = document.getElementById('toggleDarkMode');
  el.addEventListener('click', function() {
      toggleDarkMode();
  });

  // clear all button
  var el = document.getElementById('clearAll');
  el.addEventListener('click', function() {
      clearAll();
  });

  // dock all button
  var el = document.getElementById('dockAll');
  el.addEventListener('click', function() {
      dockAll();
  });

  // add note button
  var el = document.getElementById('addNote');
  el.addEventListener('click', function() {
      addNote();
  });

  // hide notes from dock
  var elements = document.getElementsByClassName('headerList');
  console.log(elements);

  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("delete clicked");  
      hideNote();
    });
  }
});

// adds event handlers for elements on a note
function addNoteEventHandlers() {
  // NOTE EVENT HANDLERS
  // drag note
  var el = document.querySelector('.dragHeader');
  el.addEventListener('mousedown', function() {
      dragElement();
  });

  // edit header
  var elements = document.getElementsByClassName('editHeader');
  console.log(elements);

  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("edit clicked");  
      editHeader();
      });
  }

  // minimize note
  var elements = document.getElementsByClassName('minimize');
  console.log(elements);

  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("min clicked");  
      minimize();
    });
  }

  // delete note
  var elements = document.getElementsByClassName('deleteNote');
  console.log(elements);

  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("delete clicked");  
      deleteNote();
    });
  }

  // add a todo
  var elements = document.getElementsByClassName('add');
  console.log(elements);

  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("add clicked");  
      add();
    });
  }

  // strikethrough
  var elements = document.getElementsByClassName('check');
  console.log(elements);
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("check clicked");  
      // crossed is false or true?
      strikeThrough(false);
    });
  }

  // remove a todo item
  var elements = document.getElementsByClassName('crossoff');
  console.log(elements);
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("crossoff clicked");
      // crossed is false or true?
      remove(false);
    });
  }

  // edit a todo item
  var elements = document.getElementsByClassName('span');
  console.log(elements);

  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("edit item clicked");  
      editNote();
    });
  }
}

// hides the menu when the 3 bar icon is clicked
function hideMenu() {
  if (document.querySelector('#menu').style.display == "none") {
    document.querySelector('#menu').style.display = "block";
  }
  else {
    document.querySelector('#menu').style.display = "none";
  }
}

// creates notes when the page is loaded (note exists), or when the Add Note button is clicked (note does not exist yet)
function createNote(exists,idx) {

  var note = document.createElement('div');
  note.id = "mydiv" + idx;
  document.body.appendChild(note);
  note.classList.add('drag');
  note.innerHTML += '<div id="mydiv' + idx + 'header" class="dragHeader">Note ' + idx;
  note.innerHTML += '<img src="images/edit.png" class="editHeader" id="edit">';
  note.innerHTML += '<img src="images/minimize.png" class="minimize" id="minimize">';
  note.innerHTML += '<img src="images/exit.png" class="deleteNote" id="exit"></img>';
  note.innerHTML += '<input class="task" id="task' + idx + '"  style="display:inline-block;"><button id="add" class="add">+ Add</button>';
  note.innerHTML += '<div class="todoLists" id="todos' + idx + '"></div>';

  var note_header = 'Note' + idx;
  // if the page is loading
  if (exists == true) {

      dict = JSON.parse(localStorage.getItem(idx,dict));
      note.style.top = dict['posTop'];
      note.style.left = dict['posLeft'];

      console.log(dict);
      //note.offsetHeight = dict['height'];
      //note.offsetWidth = dict['width'];
      note_header = dict['headerText'];
      note.childNodes[0].textContent = note_header;

      // check if the note is minimized
      console.log(dict);
      if (dict['minimized'] == true) {
        note.childNodes[4].style.display = 'none';
        note.childNodes[5].style.display = 'none';
        note.childNodes[6].style.display = 'none';
      }
  }
  // if adding a new note
  else {
    // spawn note in center of screen
    note.style.top = ($(window).scrollTop() + $(window).height() / 2) + "px";
    note.style.left = ($(window).scrollTop() + $(window).width() / 2) - (note.offsetWidth / 2) + "px";

    // create new note in local storage as empty list
    var dict = {
      'todo': null, // list of todo items
      'headerText': note_header, 
      'minimized': false, 
      'posTop': note.style.top, 
      'posLeft': note.style.left,
      'hidden': false,
    };
    console.log("Creating item: " + idx);
    localStorage.setItem(idx, JSON.stringify(dict));
    console.log(dict);
  };

  // adds the new note header to Notes Dock
  note_list = document.querySelector('#myNotes');
  var note_log = document.createElement('div');
  console.log(note_log);
  document.querySelector('#myNotes').appendChild(note_log);
  note_log.innerHTML += '<p class="headerList" id="headerItem' + idx + '">' + note_header + '</p>';
  
  // check if the note is hidden
  if (dict['hidden'] == true) {
    note.style.display = 'none';
    document.querySelector('#headerItem' + idx).style.color = 'silver';
  }
};

// page load
function loadPage() {
  
  // check if user has enabled dark mode
  if (localStorage.getItem('stickee_dark') == 'true') {
    
    var sheet = (function() {
      // Create the <style> tag
      var style = document.createElement("style");
      // WebKit hack
      style.appendChild(document.createTextNode(""));
      // Add the <style> element to the page
      document.head.appendChild(style);
      return style.sheet;
    })();
    document.body.classList.toggle("dark-mode");
    sheet.insertRule("\
    .collapsible, .clear {\
     background-color: #363640;\
     color: #fcd488;\
    }",0);
    sheet.insertRule("\
    .bar {\
     background-color: white;\
    }",0);
  }
  // recreate saved notes on page load
  for (idx = 1; idx <= 20; idx++) { // current max note limit is 20

    dict = JSON.parse(localStorage.getItem(idx));
    if (dict !== null) {
      console.log(dict);
      createNote(exists=true,idx);
      show(idx);
    }   
  }
};
loadPage();
addNoteEventHandlers();


// enable dark mode CSS changes
function toggleDarkMode() {

  var sheet = (function() {
    // Create the <style> tag
    var style = document.createElement("style");
    // WebKit hack
    style.appendChild(document.createTextNode(""));
    // Add the <style> element to the page
    document.head.appendChild(style);
    return style.sheet;
  })();

  document.body.classList.toggle("dark-mode");
  if (localStorage.getItem('stickee_dark') == 'true') {
    console.log("dark to light");

    sheet.insertRule("\
    .collapsible, .clear {\
     background-color: white;\
     color: black;\
    }",0);
    sheet.insertRule("\
    .bar {\
     background-color: gray;\
    }",0);

    localStorage.setItem('stickee_dark',false);
  }
  else {
    console.log("light to dark");
    
    sheet.insertRule("\
    .collapsible, .clear {\
     background-color: #363640;\
     color: #fcd488;\
    }",0);
    sheet.insertRule("\
    .bar {\
     background-color: #f0efed;\
    }",0);
    
    localStorage.setItem('stickee_dark',true);
  }
}

// gets an element
function getElm(e) {
   e = e || window.event;
   e = e.target || e.srcElement;
   console.log(e);
   return e;
};

// allows an element to be dragged
function dragElement(elm) {
  // get the div header element
  elm = getElm();
  // get the parent div element
  elm = elm.parentNode;
  console.log(elm);
  // get the index of div element
  // if there are more than 10 notes, get last 2 chars
  idx = elm.id.slice(-1);
  if (idx == 0) {
    idx = elm.id.slice(-2);
  }
  elm = document.getElementById("mydiv" + idx);
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (document.getElementById(elm.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elm.id + "header").onmousedown = dragMouseDown;
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
    elm.style.top = (elm.offsetTop - pos2) + "px";
    elm.style.left = (elm.offsetLeft - pos1) + "px";

  }
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    var elm = getElm().parentNode;
    idx = elm.id.slice(-1);

    dict = JSON.parse(localStorage.getItem(idx));
    dict['posTop'] = elm.style.top;
    dict['posLeft'] = elm.style.left;
    localStorage.setItem(idx, JSON.stringify(dict));
  }
}

// adds a note to the screen when "Add Note" is clicked
function addNote() {

  var existing_notes = [];
  var first_empty_slot = 1;

  // detect which notes are currently on the screen
  var header_list = document.querySelectorAll(".dragHeader");
  var notes_on_screen = [];
  console.log(header_list);

  // 10 note limit
  var basic = true; // basic vs premium version of stickee app
  if ((header_list.length >= 10) && (basic == true)) {
    alert("You have reached the maximum 10 note limit of the basic version. Please\
    delete a note or upgrade to add more.");
    return;
  }
  if (header_list.length >= 20) {
    alert("You have reached the maximum 20 note limit! Please delete a note to add more.");
    return;
  }
  
  for (j = 0; j < header_list.length; j++) {
    idx = header_list[j].id.substring(5,7); // get the 6th idx char of "mydivNNheader"

    console.log(header_list[j].id.substring(5,7));
    if (isNaN(idx) == true) { // if NOT a number, adjust the slice for a single digit
      idx = header_list[j].id.substring(5,6);
    }
    console.log(idx);
    notes_on_screen.push(idx);
  }
  console.log(notes_on_screen);
  // check local storage for existing notes
  for (j = 1; j <= header_list.length + 1; j++) {

    note_check = localStorage.getItem(j);

    // if the note exists on the screen
    if (notes_on_screen.includes(j.toString()) == true) {
      existing_notes.push(j);
    }
    // if the note exists at that index (may not be on screen)
    else if ((note_check !== null) && (note_check !== "[]")) {
      existing_notes.push(j);
    }
    // break on first instance that an available slot is found
    else if ((note_check == undefined) || (note_check == null)) {
      console.log("breaking at " + j);
      first_empty_slot = j;
      break;
    };
    console.log(j + note_check);
  };
  
  console.log(first_empty_slot);
  console.log(existing_notes);
  idx = first_empty_slot.toString();
  createNote(exists=false,idx);
}

// deletes a note from existence
function deleteNote() {

  var elm = getElm();
  // get the parent div element (the note)
  elm = elm.parentNode;
  // if there are more than 10 notes, get last 2 chars
  idx = elm.id.slice(-2);
  if (isNaN(idx) == true) {
    idx = elm.id.slice(-1);
  }
  console.log(idx);
  var header = elm.childNodes[0].textContent;
  var r = confirm("Are you sure you want to delete " + header + "?");
  if (r == true) {
    // remove all list items
    localStorage.removeItem(idx);
    // remove the div
    elm.remove();
    document.querySelector("#headerItem" + idx.toString()).remove();
  }
}

// remove all notes
function clearAll() {

  r = confirm("This will remove all of your notes and delete them from your cache. Are you sure you want to proceed?");
  if (r == true) {
    var header_list = document.querySelectorAll(".dragHeader");
    console.log(header_list);
    for (j = 1; j <= header_list.length; j++) {
      console.log("runs");
      console.log(document.querySelector('#mydiv' + j));
      localStorage.removeItem(j);
      document.querySelector('#mydiv' + j).remove();
      document.querySelector("#headerItem" + j.toString()).remove();
    }
  }
}

// add a new todo list item to an existing list
function add() {
    // get the parent div element
    var elm = getElm();
    elm = elm.parentNode;
    console.log(elm);

    // get the index of div element
    idx = elm.id.slice(-2);
    if (isNaN(idx) == true) { // if is NOT a number
      idx = elm.id.slice(-1); // not a 2 digit number
    }
    console.log(idx);

    // add a task for that note
    var todos = new Array;
    console.log(elm.childNodes);
    if (elm.childNodes[4].value == "") {
      return;
    }
    var task = elm.childNodes[4].value;
    console.log(task);

    // get the current list of todos for that note
    dict = JSON.parse(localStorage.getItem(idx));
    console.log(dict);
    var todos_str = dict['todo'];
    console.log(todos_str);

    // if there is an actual list
    if (todos_str !== null) {

      // add the new task to the list of todos for that note
      var todos = JSON.parse(todos_str);
      console.log(todos);
      if (todos[todos.length - 1] != task) {
          todos.push(task);
      }
    }
    else {
      todos = [task];
      console.log(todos);
    }
    dict['todo'] = JSON.stringify(todos);
    console.log(dict['todos']);
    localStorage.setItem(idx, JSON.stringify(dict));
    console.log(dict);
    show(idx);

    elm.childNodes[4].value = "";
}

// removes an item from a todo list
function remove(isTodo) {

    var elm = getElm();
    console.log(elm);
    // get the parent div element
    parent = elm.parentNode.parentNode.parentNode;
    // get the index of div element
    idx = parent.id.slice(-2);
   
    if (isNaN(idx) == true) { // if is NOT a number
      idx = parent.id.slice(-1); // not a 2 digit number
    }
    console.log(idx);

    var id = elm.getAttribute('id');
    var todos = getTodos(idx);

    console.log(isTodo);
    if (isTodo == false) {
      todos = getCrossed(idx);
      console.log(todos);
      todos.splice(id, 1);

      console.log("Currently in todos: " + todos);
      dict['strikethrough'] = (todos);
      localStorage.setItem(idx, JSON.stringify(dict));
      console.log(localStorage.getItem(idx));
      show(idx);
      return;
    }
    console.log(todos);
    todos.splice(id, 1);
    console.log("Currently in todos: " + todos);
    dict['todo'] = JSON.stringify(todos);
    localStorage.setItem(idx, JSON.stringify(dict));
    console.log(localStorage.getItem(idx));

    show(idx);
    return;
}

// returns a requested list of todo items
function getTodos(idx) {

  var requested_list;
  dict = JSON.parse(localStorage.getItem(idx));
  todos_list = dict['todo'];
  console.log(todos_list);
  if ((todos_list !== null) && (todos_list !== undefined)) {
    requested_list = JSON.parse(dict['todo']);
  }
  console.log(dict);
  console.log(requested_list);
  return requested_list
}

// returns a list of crossed out todo items
function getCrossed(idx) {
  var requested_list;
  dict = JSON.parse(localStorage.getItem(idx));
  console.log(dict);
  todos_list = dict['strikethrough'];
  console.log(todos_list);
  if ((todos_list !== null) && (todos_list !== undefined)) {
    requested_list = dict['strikethrough'];
  }
  console.log(dict);
  console.log(requested_list);
  return requested_list
}

// idx is the targeted note index
function show(idx) {

    var todos_list = getTodos(idx);
    var crossed_list = getCrossed(idx);
    console.log(idx);
    console.log("Currently in this todo list:" + todos_list + "!");
    console.log("Currently in the crossed list: " + crossed_list);

    var html = '<ul>';
    // if the list of todos is found, shown on screen
    if ((todos_list !== null) && (todos_list !== undefined) && (todos_list.toString() !== "")) {
      
      console.log("todo runs");
      // build list of uncrossed todo list items
      for(var i=0; i<todos_list.length; i++) {
          html += '<li class="lists">';
          html += '<img class="check" src="images/check3.png">';
          html += '<img class="crossoff" src="images/crossoff3.png" id="' + i  + '">';
          html += '<span class="span">' + todos_list[i] + '</span>';
          //html += '<img class="save" onclick="saveEdit(og_note)">';
          html += '<button class="save" onclick="saveEdit(og_note,false)"> save </button></li>';
          //html += '<hr>';
      };
    }
    if (crossed_list !== undefined) {
      console.log(crossed_list);
      // build list of crossed todo list items
      for(var i=0; i<crossed_list.length; i++) {
        html += '<li class="lists">';
        html += '<img class="check" onclick="strikeThrough(true)" src="images/check3.png">';
        html += '<img class="crossoff" src="images/crossoff3.png" id="' + i  + '">';
        html += '<del class="span">' + crossed_list[i] + '</del>';
        //html += '<img class="save" onclick="saveEdit(og_note)">';
        html += '<button class="save" onclick="saveEdit(og_note,true)"> save </button></li>';
      }
    }
    html += '</ul>';
    document.getElementById('todos' + idx).innerHTML = html;

    // save note's width and height
    /*
    dict = JSON.parse(localStorage.getItem(idx));
    dict['width'] = document.querySelector('#mydiv' + idx).offsetWidth + "px";
    dict['height'] = document.querySelector('#mydiv' + idx).offsetHeight + "px";
    localStorage.setItem(idx,JSON.stringify(dict));
    */
}

// strikes through a todo list item
function strikeThrough(crossed) {

  var elm = getElm();

  // get the index of div element
  idx = elm.parentNode.parentNode.parentNode.id.slice(-2);
  if (isNaN(idx) == true) { // if is NOT a number
    idx = elm.parentNode.parentNode.parentNode.id.slice(-1); // not a 2 digit number
  }

  // get id of the todo item we are trying to remove
  var id = elm.parentNode.childNodes[1].getAttribute('id');
  console.log(elm.parentNode.childNodes[1]);

  if (crossed == false) {
    
    var todos = getTodos(idx);
    console.log(todos);
    var removed_item = todos.splice(id, 1);
    console.log(removed_item);

    console.log("Currently in todos: " + todos);

    dict['todo'] = JSON.stringify(todos);
    localStorage.setItem(idx, JSON.stringify(dict));
    console.log(localStorage.getItem(idx));

    // add removed item to the strikethrough list
    dict = JSON.parse(localStorage.getItem(idx));
    console.log(dict);
    var strike_list = dict['strikethrough'];

    if (strike_list == undefined) {
      dict['strikethrough'] = [removed_item];
    }
    else {
      strike_list.push(removed_item);
    }
    localStorage.setItem(idx,JSON.stringify(dict));
    console.log(localStorage.getItem(idx));
  }
  // if reinstating an item that was crossed off
  else {

    // first remove the item from the strikethrough list
    var todos = getCrossed(idx);
    var removed_item = todos.splice(id, 1);
    dict['strikethrough'] = todos;
    localStorage.setItem(idx, JSON.stringify(dict));

    // add removed item back to the todos list
    // get the current list of todos for that note
    dict = JSON.parse(localStorage.getItem(idx));
    var todos_str = dict['todo'];
    var task = removed_item[0];

    // if there is an actual list
    if (todos_str !== null) {
      // add the new task to the list of todos for that note
      var todos = JSON.parse(todos_str);

      if (todos[todos.length - 1] != task) {
          todos.push(task);
      }
    }
    else {
      todos = [task];
    }
    dict['todo'] = JSON.stringify(todos);
    localStorage.setItem(idx, JSON.stringify(dict));
  }
  show(idx);
}

// docks all notes
function dockAll() {
  var header_list = document.querySelectorAll(".dragHeader");
  console.log(header_list);
  for (j = 1; j <= header_list.length; j++) {
    console.log(document.querySelector('#mydiv' + j));
    hideNote(j);
  }
}

// hides a note from view by clicking on it in the Notes Dock
function hideNote(idx) {
  
  // save hidden feature to local storage
  elm = getElm();

  console.log(idx);
  if (idx == undefined) { // if not docking all notes
    idx = elm.id.slice(-2);
    if (isNaN(idx) == true) {
      idx = elm.id.slice(-1);
    }
  }
  dict = JSON.parse(localStorage.getItem(idx));

  div_to_hide = document.querySelector('#mydiv' + idx);
  all_divs = document.querySelectorAll(".drag");
  console.log(all_divs);

  if (div_to_hide.style.display == "none") {

    div_to_hide.style.display = "block";

    // bring all the other notes behind the selected note
    for (j=0; j<all_divs.length; j++) {
      all_divs[j].style.zIndex = "1";
    }
    div_to_hide.style.zIndex = "2";

    elm.style.color = "black";
    if (localStorage.getItem('stickee_dark') == 'true') {
      elm.style.color = "white";
    }
    dict['hidden'] = false;
  }
  else {
    // reset notes zIndexes
    for (j=0; j<all_divs.length; j++) {
      all_divs[j].style.zIndex = "1";
    }
    div_to_hide.style.display = "none";
    elm.style.color = "silver";
    dict['hidden'] = true;
  }
  localStorage.setItem(elm.id.slice(-1),JSON.stringify(dict));
}

// minimize a note leaving only the header
function minimize() {
  elm = getElm();
  console.log(elm.parentNode.childNodes);

  var idx = elm.parentNode.id.slice(-2);
  if (isNaN(idx) == true) {
    idx = elm.parentNode.id.slice(-1);
  }

  console.log(idx);
  var hide_input = elm.parentNode.childNodes[4];
  var hide_add = elm.parentNode.childNodes[5];
  var hide_todo = elm.parentNode.childNodes[6];
 
  // if visible
  dict = JSON.parse(localStorage.getItem(idx,dict));
  console.log(hide_add.style.display);
  if (hide_input.style.display == 'inline-block') {
    console.log("hiding");
    hide_input.style.display = 'none';
    hide_add.style.display = 'none';
    hide_todo.style.display= 'none';
    dict['minimized'] = true;
  }
  else {
    console.log("showing");
    hide_input.style.display = 'inline-block';
    hide_add.style.display = 'inline-block';
    hide_todo.style.display = 'inline-block';
    dict['minimized'] = false;
  }
  localStorage.setItem(idx, JSON.stringify(dict));
}

// allows edit of the header of a note
function editHeader() {
  elm = getElm();
  header = elm.parentNode.childNodes[0];
  console.log(elm.parentNode.childNodes[0].textContent);
  if (header.isContentEditable == false) {
    header.setAttribute("contentEditable", true);
    cursorManager.setEndOfContenteditable(header);
    //elm.parentNode.childNodes[1].src = "images/edit_toggle.svg";
  }
  else {
    header.setAttribute("contentEditable", false);
    //elm.parentNode.childNodes[1].src = "images/edit.svg";
    idx = elm.parentNode.id.slice(-1);
    
    dict = JSON.parse(localStorage.getItem(idx,dict));
    dict['headerText'] = header.textContent;
    localStorage.setItem(idx, JSON.stringify(dict));
    document.querySelector('#headerItem' + idx).textContent = header.textContent; // update note dock
  }
  header.focus();
}

// allows a list item to be edited
var og_note = [];
function editNote() {
  elm = getElm();

  og_note.push(elm.textContent); // original note content
  console.log(og_note);
  console.log(elm.parentNode.childNodes);

  shown_save_count = 0;
  var displayed;
  // check for existing save buttons (pending edits)
  spanList = document.querySelectorAll(".span");
  for (j = 0; j < spanList.length; j++) {
    save_button = spanList[j].parentNode.childNodes[3];

    if (save_button.style.opacity == '1') {
      displayed = save_button;
      shown_save_count++;
    };
  };
  // if there are no pending edits, show the save button
  console.log(shown_save_count);
  save_button = elm.parentNode.childNodes[3];

  if (shown_save_count < 1) {
    save_button.style.float = "right";
    save_button.style.opacity = "1"; //show the save button
    elm.setAttribute("contentEditable", true);
    elm.focus();
    shown_save_count++;
  }
  // if you click on the same pending edit, will not prompt the pending message
  else if ((shown_save_count == 1) && (displayed == save_button)) {
    console.log(og_note);
    save_button.style.float = "right";
    save_button.style.opacity = "1"; //show the save button
    elm.setAttribute("contentEditable", true);
    elm.focus();
  }
  else {
    og_note = [og_note[0]];
    console.log(shown_save_count);
    document.querySelector("#pending").style.visibility = "visible";
  };
}

// saves an edit on a todo list item
function saveEdit(og_note,crossed) {
    spanList = document.querySelectorAll(".span");
    shown_save_count = 0;

    if (og_note.length > 1) {
      og_note = og_note[og_note.length-1];
    }
    elm = getElm(); // get the save button
    console.log(elm.parentNode.childNodes);
    var task = elm.parentNode.childNodes[2].textContent; // get the text of the edited note
    console.log(task);
    var parent = elm.parentNode.parentNode.parentNode; // get the index of div element
    idx = parent.id.slice(-1);

    if (crossed == false) {
      console.log("crossed is false");
      // get the current list of todos for that note
      todos = getTodos(idx);
      //var todos_str = localStorage.getItem('todo' + current_idx);
      //var todos = JSON.parse(todos_str);
    
      console.log(todos);
      console.log(og_note);
      console.log(og_note[0]);
      note_idx = todos.indexOf(og_note[0]);
      console.log(note_idx); // fix error in case that there are 2 of the exact same notes
      console.log("Edit: " + task);
      console.log(og_note);
      console.log(todos[note_idx]);
      todos[note_idx] = task; // set the old note to the edited note
      console.log("New edits: " + todos);
      og_note = []; // reset og_note variable


      dict['todo'] = JSON.stringify(todos);
      console.log(todos);
      console.log(dict);
      localStorage.setItem(idx, JSON.stringify(dict));
      console.log(localStorage.getItem(idx));

      save_button = elm.parentNode.childNodes[3];
      save_button.style.opacity = "0";
      document.querySelector("#pending").style.visibility = "hidden";
    }
    else {
      console.log("crossed is true");
      // get the current list of todos for that note
      todos = getCrossed(idx);
      //var todos_str = localStorage.getItem('todo' + current_idx);
      //var todos = JSON.parse(todos_str);
    
      console.log(todos);
      console.log(og_note);
      
      note_idx = todos.indexOf(og_note);
      console.log(note_idx);
      console.log(todos[note_idx]);
     

      for (j=0;j<=todos.length;j++){
        // check for inconsistencies in getCrossed list - fix later  
        var todo_item = todos[j];
        if (Array.isArray(todo_item) == true) {
          todo_item = todos[j][0];
        }
        console.log(todo_item);
        if (todo_item == og_note) {
          note_idx = j;
          break;
        }
      }
      //note_idx = todos.indexOf(og_note);
      console.log(note_idx); // fix error in case that there are 2 of the exact same notes
      console.log("Edit: " + task);
      console.log(og_note);
      console.log(todos[note_idx]);
      todos[note_idx] = task; // set the old note to the edited note
      console.log("New edits: " + todos);
      og_note = []; // reset og_note variable


      dict['strikethrough'] = todos;
      console.log(todos);
      console.log(dict);
      localStorage.setItem(idx, JSON.stringify(dict));
      console.log(localStorage.getItem(idx));

      save_button = elm.parentNode.childNodes[3];
      save_button.style.opacity = "0";
      document.querySelector("#pending").style.visibility = "hidden";
    }
}
/*
// these lines make it possible for Enter key to submit a note edit
$(".span").on('keyup', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
        document.execCommand('insertHTML', false, '<br/>');
        elm = getElm();
        console.log(elm);
        console.log(elm.parentNode.childNodes);
        // click the Add button for that note when enter key is pressed
        saveEdit(og_note);
        //save_button.click();
        elm.blur();
        elm.setAttribute("contentEditable", false);
    }
});
*/
/*
$(".lists").on('keyup', function (e) {
  if (e.keyCode === 13) {
      elm = getElm();
      console.log(elm);
      // click the Add button for that note when enter key is pressed
      elm.blur();
      elm.setAttribute("contentEditable", false);
  }
});
*/

//Namespace management idea from http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
(function( cursorManager ) {

    //From: http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
    var voidNodeTags = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR', 'BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX'];

    //From: https://stackoverflow.com/questions/237104/array-containsobj-in-javascript
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    //Basic idea from: https://stackoverflow.com/questions/19790442/test-if-an-element-can-contain-text
    function canContainText(node) {
        if(node.nodeType == 1) { //is an element node
            return !voidNodeTags.contains(node.nodeName);
        } else { //is not an element node
            return false;
        }
    };

    function getLastChildElement(el){
        var lc = el.lastChild;
        while(lc && lc.nodeType != 1) {
            if(lc.previousSibling)
                lc = lc.previousSibling;
            else
                break;
        }
        return lc;
    }

    //Based on Nico Burns's answer
    cursorManager.setEndOfContenteditable = function(contentEditableElement)
    {

        while(getLastChildElement(contentEditableElement) &&
              canContainText(getLastChildElement(contentEditableElement))) {
            contentEditableElement = getLastChildElement(contentEditableElement);
        }

        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        {
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

}( window.cursorManager = window.cursorManager || {}));
