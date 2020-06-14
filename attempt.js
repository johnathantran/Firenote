// A brief guide to defined variables:
// N: any integer
// 'todoN': represents a LIST of todo items for any note of index N
// 'headerTextN': the text element of the header of note N
// 'headerItemN': the text element of the header of note N in the Notes Dock

$(document).ready(function() {
  $(".task").on('keyup', function (e) {
      if (e.keyCode === 13) {
          elmnt = getElm();
          console.log(elmnt);
          // click the Add button for that note when enter key is pressed
          elmnt.parentNode.childNodes[5].click();
      }
  });
  // enable edits to note header
  $(".dragHeader").on('keyup', function (e) {
      if (e.keyCode === 13) {
          elmnt = getElm();
          var new_header = elmnt.textContent;
          elmnt.setAttribute("contentEditable",false);
          //elmnt.parentNode.childNodes[1].src = "images/edit.svg";
          elmnt.textContent = new_header;

          current_idx = elmnt.parentNode.id.slice(-1);
          localStorage.setItem('headerText' + current_idx, elmnt.textContent);
      }
  });
});

// creates notes when the page is loaded (note exists), or when the Add Note button is clicked (note does not exist yet)
function createNote(exists,idx) {

  var note = document.createElement('div');
  note.id = "mydiv" + idx;
  document.body.appendChild(note);
  note.classList.add('drag');
  note.innerHTML += '<div id="mydiv' + idx + 'header" class="dragHeader" onmousedown="dragElement()">Note ' + idx;
  note.innerHTML += '<img src="images/edit.png" class="dot" id="edit" onclick="editHeader()">';
  note.innerHTML += '<img src="images/minimize.png" class="dot" id="minimize" onclick="minHeader()">';
  note.innerHTML += '<img src="images/exit.png" class="dot" id="exit" onclick="deleteNote()"></img>';
  note.innerHTML += '<input class="task" id="task' + idx + '"><button id="add" onclick="add()">+ Add</button>';
  note.innerHTML += '<div class="todoLists" id="todos' + idx + '"></div>';

  // if the page is loading
  if (exists == true) {   
      note.style.top = localStorage.getItem('posTop' + idx);
      note.style.left = localStorage.getItem('posLeft' + idx);
      note_header = localStorage.getItem('headerText' + idx);
      note.childNodes[0].textContent = note_header;
  }
  // if adding a new note
  else {
    // spawn note in center of screen
    note.style.top = ($(window).scrollTop() + $(window).height() / 2) + "px";
    note.style.left = ($(window).scrollTop() + $(window).width() / 2) - (note.offsetWidth / 2) + "px";

    // create new note in local storage as empty list
    var todos = new Array;
    localStorage.setItem('todo' + idx, JSON.stringify(todos));
    note_header = 'Note ' + idx;
    localStorage.setItem('headerText' + idx,'Note' + idx);
  };

  // adds the new note header to Notes Dock
  note_list = document.querySelector('#myNotes');
  var note_log = document.createElement('div');
  console.log(note_log);
  document.querySelector('#myNotes').appendChild(note_log);
  note_log.innerHTML += '<p class="headerList" id="headerItem' + idx + '" onclick="hideNote()">' + note_header + '</p>';
};

// page load
function loadPage() {
  for (idx = 1; idx <= 10; idx++) {

    // load existing notes
    if (localStorage.getItem('todo' + idx) !== null) {
      idx = idx.toString();
      createNote(exists=true,idx);
      show(idx);
    }
    console.log(localStorage.getItem('todo' + idx));
  }
};
loadPage();
var toggled = false;



// enable dark mode CSS changes
function toggleDarkMode() {
  if (toggled == false) {
    toggled = true;
  }
  else {
    toggled = false;
  };
  // subfunction to fade in Dark Mode Text
  function fadeout() {
    if (toggled == true) {
      document.getElementById('fadeout').textContent = "Dark Mode ON";
      document.getElementById('fadeout').style.opacity = '1';
    }
    else {
      document.getElementById('fadeout').textContent = "Dark Mode OFF";
      document.getElementById('fadeout').style.opacity = '0';
    };
  }
  document.body.classList.toggle("dark-mode");
  window.setTimeout(fadeout(toggled), 4000);

  var sheet = (function() {
     // Create the <style> tag
     var style = document.createElement("style");

     // WebKit hack
     style.appendChild(document.createTextNode(""));

     // Add the <style> element to the page
     document.head.appendChild(style);

     return style.sheet;
 })();
 // insert new CSS rules for dark mode
 sheet.insertRule("\
     .headerList:hover {\
       background-color: #2196F3;\
       color: white;\
     }\
 ", 0);
}

// gets an element
function getElm(e) {
   e = e || window.event;
   e = e.target || e.srcElement;
   console.log(e);
   return e;
};

// allows an element to be dragged
function dragElement(elmnt) {
  // get the div header element
  elmnt = getElm();
  // get the parent div element
  elmnt = elmnt.parentNode;
  console.log(elmnt);
  // get the index of div element
  // if there are more than 10 notes, get last 2 chars
  idx = elmnt.id.slice(-1);
  if (idx == 0) {
    idx = elmnt.id.slice(-2);
  }
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
    var elmnt = getElm().parentNode;
    current_idx = elmnt.id.slice(-1);
    console.log(current_idx);
    localStorage.setItem('posTop' + current_idx, elmnt.style.top);
    localStorage.setItem('posLeft' + current_idx, elmnt.style.left);
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
  for (j = 0; j < header_list.length; j++) {
    notes_on_screen.push(header_list[j].id.slice(5)[0]);
  }
  console.log(notes_on_screen);

  // check local storage for existing notes
  for (j = 1; j <= 10; j++) {
    note_check = localStorage.getItem('todo' + j);

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

  var elmnt = getElm();
  // get the parent div element (the note)
  elmnt = elmnt.parentNode;
  // if there are more than 10 notes, get last 2 chars
  idx = elmnt.id.slice(-1);
  if (idx == 0) {
    idx = elmnt.id.slice(-2);
  }
  
  var header = elmnt.childNodes[0].textContent;
  var r = confirm("Are you sure you want to delete " + header + "?");
  if (r == true) {
    // remove all list items
    var todos;
    localStorage.removeItem('todo' + idx);
    console.log(todos);
    localStorage.removeItem('headerText' + idx);
    show(idx);

    // remove the div
    elmnt.remove();
    document.querySelector("#headerItem" + idx.toString()).remove();
  }
}

// add a new todo list item to an existing list
function add() {
    // get the parent div element
    var elmnt = getElm();
    elmnt = elmnt.parentNode;
    console.log(elmnt);

    // get the index of div element
    idx = elmnt.id.slice(-1);
    console.log(idx);

    // add a task for that note
    var todos = new Array;
    console.log(elmnt.childNodes);
    if (elmnt.childNodes[4].value == "") {
      return;
    }
    var task = elmnt.childNodes[4].value;
    console.log(task);

    // get the current list of todos for that note
    var todos_str = localStorage.getItem('todo' + idx);
    console.log(todos_str);

    // if there is an actual list
    if (todos_str !== null) {

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
        console.log("No note yet");
        var todos = new Array;
        todos.push(task);
      }
    }
    localStorage.setItem('todo' + idx, JSON.stringify(todos));
    show(idx);

    elmnt.childNodes[4].value = "";
}

// removes an item from a todo list
function remove() {

    var elmnt = getElm();
    console.log(elmnt);
    // get the parent div element
    parent = elmnt.parentNode.parentNode.parentNode;
    // get the index of div element
    current_idx = parent.id.slice(-1);
    console.log("Index: " + current_idx);
    var id = elmnt.getAttribute('id');

    var todos_str = localStorage.getItem('todo' + current_idx);
    var todos = JSON.parse(todos_str);
    console.log("Currently in todos: " + todos);

    // remove the targeted item from the list of todos
    todos.splice(id, 1);
    
    localStorage.setItem('todo' + current_idx, JSON.stringify(todos));
    show(current_idx);
    return false;
}

// returns a requested list of todo items
function get_todos(idx) {

  var requested_list = localStorage.getItem('todo' + idx);
  console.log(requested_list);
  requested_list = JSON.parse(requested_list);
  return requested_list
}

// idx is the targeted note index
function show(idx) {

    var todos_list = get_todos(idx);
    console.log("Currently in this todo list: " + todos_list);

    // if the list of todos is found, shown on screen
    if (todos_list !== null) {
      var html = '<ul>';
      for(var i=0; i<todos_list.length; i++) {
          html += '<li class="lists">';
          html += '<img class="crossoff" src="images/crossoff.png" onclick="remove()" id="' + i  + '">';
          //html += '<img class="edit" onclick="editNote()" src="images/edit.svg">';
          html += '<span class="span" onclick="editNote()">' + todos_list[i] + '</span>';
          html += '<button class="save" onclick="saveEdit(og_note)"> save </button></li>';
          //html += '<hr>';
      };
      html += '</ul>';
      document.getElementById('todos' + idx).innerHTML = html;

      var buttons = document.getElementsByClassName('remove');
      for (var i=0; i < buttons.length; i++) {
          buttons[i].addEventListener('click', remove);
      };
    }
    // if there is only one item in the list left, remove the list
    else {
      elmnt = getElm();
      console.log(elmnt);
      elmnt.parentNode.remove();
    };
}

// Execute a function when the user releases a key on the keyboard
document.getElementById('add').addEventListener('click', add);
console.log(document.getElementsByClassName(".headerList"))

// hides a note from view by clicking on it in the Notes Dock
function hideNote() {
  elmnt = getElm();
  // from the Notes Dock
  div_to_hide = document.querySelector('#mydiv' + elmnt.id.slice(-1));
  if (div_to_hide.style.display == "none") {
    div_to_hide.style.display = "block";
    elmnt.style.color = "black";
  }
  else {
    div_to_hide.style.display = "none";
    elmnt.style.color = "silver";
  }
}

function minHeader() {
  elmnt = getElm();
  console.log(elmnt.parentNode.childNodes);
  var hide_input = elmnt.parentNode.childNodes[4];
  var hide_add = elmnt.parentNode.childNodes[5];
  var hide_todo = elmnt.parentNode.childNodes[6];
 
  // if visible
  if (hide_input.style.display == 'inline-block') {
    console.log("hiding");
    hide_input.style.display = 'none';
    hide_add.style.display = 'none';
    hide_todo.style.display= 'none';
  }
  else {
    console.log("showing");
    hide_input.style.display = 'inline-block';
    hide_add.style.display = 'inline-block';
    hide_todo.style.display = 'inline-block';
  }
}

// allows edit of the header of a note
function editHeader() {
  elmnt = getElm();
  header = elmnt.parentNode.childNodes[0];
  console.log(elmnt.parentNode.childNodes[0].textContent);
  if (header.isContentEditable == false) {
    header.setAttribute("contentEditable", true);
    cursorManager.setEndOfContenteditable(header);
    //elmnt.parentNode.childNodes[1].src = "images/edit_toggle.svg";
  }
  else {
    header.setAttribute("contentEditable", false);
    //elmnt.parentNode.childNodes[1].src = "images/edit.svg";
    current_idx = elmnt.parentNode.id.slice(-1);
    localStorage.setItem('headerText' + current_idx, header.textContent);
  }
  header.focus();
}

// allows a list item to be edited
var og_note = [];
function editNote() {
  elmnt = getElm();

  og_note.push(elmnt.textContent); // original note content
  console.log(og_note);
  console.log(elmnt.parentNode.childNodes);

  shown_save_count = 0;
  var displayed;
  // check for existing save buttons (pending edits)
  spanList = document.querySelectorAll(".span");
  for (j = 0; j < spanList.length; j++) {
    save_button = spanList[j].parentNode.childNodes[2];

    if (save_button.style.opacity == '1') {
      displayed = save_button;
      shown_save_count++;
    };
  };
  // if there are no pending edits, show the save button
  console.log(shown_save_count);
  if (shown_save_count < 1) {
    elmnt.parentNode.childNodes[2].style.float = "right";
    elmnt.parentNode.childNodes[2].style.opacity = "1"; //show the save button
    elmnt.setAttribute("contentEditable", true);
    elmnt.focus();
    shown_save_count++;
  }
  else if ((shown_save_count == 1) && (displayed == elmnt.parentNode.childNodes[3])) {
    console.log(og_note);
    elmnt.parentNode.childNodes[2].style.float = "right";
    elmnt.parentNode.childNodes[2].style.opacity = "1"; //show the save button
    elmnt.setAttribute("contentEditable", true);
    elmnt.focus();
  }
  else {
    og_note = [og_note[0]];
    console.log(shown_save_count);
    document.querySelector("#pending").style.visibility = "visible";
  };
}

// saves an edit on a todo list item
function saveEdit(og_note) {
    spanList = document.querySelectorAll(".span");
    shown_save_count = 0;

    if (og_note.length > 1) {
      og_note = og_note[og_note.length-1];
    }
    elmnt = getElm(); // get the save button
    var task = elmnt.parentNode.childNodes[  2].textContent; // get the text of the edited note
    console.log(task);
    var parent = elmnt.parentNode.parentNode.parentNode; // get the index of div element
    current_idx = parent.id.slice(-1);

    // get the current list of todos for that note
    var todos_str = localStorage.getItem('todo' + current_idx);
    var todos = JSON.parse(todos_str);
    console.log(todos);
    console.log(og_note);
    note_idx = todos.indexOf(og_note);
    console.log(note_idx); // fix error in case that there are 2 of the exact same notes
    console.log("Edit: " + task);
    console.log(og_note);
    console.log(todos[note_idx]);
    todos[note_idx] = task; // set the old note to the edited note
    console.log("New edits: " + todos);
    og_note = []; // reset og_note variable
    localStorage.setItem('todo' + current_idx, JSON.stringify(todos)); // save

    elmnt.parentNode.childNodes[2].style.opacity = "0";
    document.querySelector("#pending").style.visibility = "hidden";
}
/*
// these lines make it possible for Enter key to submit a note edit
$(".span").on('keyup', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
        document.execCommand('insertHTML', false, '<br/>');
        elmnt = getElm();
        console.log(elmnt);
        console.log(elmnt.parentNode.childNodes);
        // click the Add button for that note when enter key is pressed
        saveEdit(og_note);
        //elmnt.parentNode.childNodes[3].click();
        elmnt.blur();
        elmnt.setAttribute("contentEditable", false);


    }
});
*/
/*
$(".lists").on('keyup', function (e) {
  if (e.keyCode === 13) {
      elmnt = getElm();
      console.log(elmnt);
      // click the Add button for that note when enter key is pressed
      elmnt.blur();
      elmnt.setAttribute("contentEditable", false);
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
