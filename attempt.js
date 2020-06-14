// A brief guide to defined variables:
// N: any integer
// 'todoN': represents a LIST of todo items for any note of index N
// 'headerTextN': the text element of the header of note N
// 'headerItemN': the text element of the header of note N in the Notes Dock

//localStorage.removeItem(1);
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

          idx = elmnt.parentNode.id.slice(-1);
          dict = JSON.parse(localStorage.getItem(idx,dict));
          dict['headerText'] = header.textContent;
          localStorage.setItem(idx, JSON.stringify(dict));
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
  note.innerHTML += '<div id="mydiv' + idx + 'header" class="dragHeader" onmousedown="dragElement()">Note ' + idx;
  note.innerHTML += '<img src="images/edit.png" class="dot" id="edit" onclick="editHeader()">';
  note.innerHTML += '<img src="images/minimize.png" class="dot" id="minimize" onclick="minimize()">';
  note.innerHTML += '<img src="images/exit.png" class="dot" id="exit" onclick="deleteNote()"></img>';
  note.innerHTML += '<input class="task" id="task' + idx + '"><button id="add" onclick="add()">+ Add</button>';
  note.innerHTML += '<div class="todoLists" id="todos' + idx + '"></div>';

  var note_header = 'Note' + idx;
  // if the page is loading
  if (exists == true) {

      dict = JSON.parse(localStorage.getItem(idx,dict));
      note.style.top = dict['posTop'];
      note.style.left = dict['posLeft'];
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
    localStorage.setItem(idx, JSON.stringify(dict));
    console.log(dict);
  };

  // adds the new note header to Notes Dock
  note_list = document.querySelector('#myNotes');
  var note_log = document.createElement('div');
  console.log(note_log);
  document.querySelector('#myNotes').appendChild(note_log);
  note_log.innerHTML += '<p class="headerList" id="headerItem' + idx + '" onclick="hideNote()">' + note_header + '</p>';
  
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
  for (idx = 1; idx <= 10; idx++) {

    dict = JSON.parse(localStorage.getItem(idx));
    if (dict !== null) {
      console.log(dict);
      createNote(exists=true,idx);
      show(idx);
    }   
  }
};
loadPage();


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
     background-color: white;\
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
    idx = elmnt.id.slice(-1);

    dict = JSON.parse(localStorage.getItem(idx));
    dict['posTop'] = elmnt.style.top;
    dict['posLeft'] = elmnt.style.left;
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
  if (header_list.length >= 10) {
    alert ("You have reached the 10 note limit. Please delete a note to add more.");
    return;
  }
  for (j = 0; j < header_list.length; j++) {
    notes_on_screen.push(header_list[j].id.slice(5)[0]);
  }
  console.log(notes_on_screen);

  // check local storage for existing notes
  for (j = 1; j <= 10; j++) {
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
    localStorage.removeItem(idx);
    // remove the div
    elmnt.remove();
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

    elmnt.childNodes[4].value = "";
}

// removes an item from a todo list
function remove() {

    var elmnt = getElm();
    console.log(elmnt);
    // get the parent div element
    parent = elmnt.parentNode.parentNode.parentNode;
    // get the index of div element
    idx = parent.id.slice(-1);
    console.log("Index: " + idx);
    var id = elmnt.getAttribute('id');

    var todos = get_todos(idx);

    console.log(todos);
    todos.splice(id, 1);

    console.log("Currently in todos: " + todos);
    dict['todo'] = JSON.stringify(todos);
    localStorage.setItem(idx, JSON.stringify(dict));
    console.log(localStorage.getItem(idx));

    show(idx);
    return false;
}

// returns a requested list of todo items
function get_todos(idx) {

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

// idx is the targeted note index
function show(idx) {

    var todos_list = get_todos(idx);
    console.log(idx);
    console.log("Currently in this todo list: " + todos_list);

    // if the list of todos is found, shown on screen
    if ((todos_list !== null) && (todos_list !== undefined)) {
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
    /*
    // if there is only one item in the list left, remove the list
    else {
      elmnt = getElm();
      console.log(elmnt);
      elmnt.parentNode.remove();
    };
    */
}

// Execute a function when the user releases a key on the keyboard
//document.getElementById('add').addEventListener('click', add);
// console.log(document.getElementsByClassName(".headerList"))

// hides a note from view by clicking on it in the Notes Dock
function hideNote() {
  
  // save hidden feature to local storage
  elmnt = getElm();
  dict = JSON.parse(localStorage.getItem(elmnt.id.slice(-1)));

  div_to_hide = document.querySelector('#mydiv' + elmnt.id.slice(-1));
  if (div_to_hide.style.display == "none") {
    div_to_hide.style.display = "block";
    elmnt.style.color = "black";
    dict['hidden'] = false;
  }
  else {
    div_to_hide.style.display = "none";
    elmnt.style.color = "silver";
    dict['hidden'] = true;
  }
  localStorage.setItem(elmnt.id.slice(-1),JSON.stringify(dict));
}

// minimize a note leaving only the header
function minimize() {
  elmnt = getElm();
  console.log(elmnt.parentNode.childNodes);
  var idx = elmnt.parentNode.id.slice(-1);
  console.log(idx);
  var hide_input = elmnt.parentNode.childNodes[4];
  var hide_add = elmnt.parentNode.childNodes[5];
  var hide_todo = elmnt.parentNode.childNodes[6];
 
  // if visible
  dict = JSON.parse(localStorage.getItem(idx,dict));
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
    idx = elmnt.parentNode.id.slice(-1);
    
    dict = JSON.parse(localStorage.getItem(idx,dict));
    dict['headerText'] = header.textContent;
    localStorage.setItem(idx, JSON.stringify(dict));
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
  // if you click on the same pending edit, will not prompt the pending message
  else if ((shown_save_count == 1) && (displayed == elmnt.parentNode.childNodes[2])) {
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
    console.log(elmnt.parentNode.childNodes);
    var task = elmnt.parentNode.childNodes[1].textContent; // get the text of the edited note
    console.log(task);
    var parent = elmnt.parentNode.parentNode.parentNode; // get the index of div element
    idx = parent.id.slice(-1);

    // get the current list of todos for that note
    todos = get_todos(idx);
    //var todos_str = localStorage.getItem('todo' + current_idx);
    //var todos = JSON.parse(todos_str);
    console.log(todos);
    console.log(og_note);
    console.log(og_note[0])
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
