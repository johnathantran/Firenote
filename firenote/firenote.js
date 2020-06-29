// A brief guide to defined variables:
// N: any integer
// 'todoN': represents a LIST of todo items for any note of index N
// 'headerTextN': the text element of the header of note N
// 'headerItemN': the text element of the header of note N in the Notes Dock
//chrome.storage.sync.remove('1');
// add event listeners to onclick elements
$(document).ready(function() {
 
  var coll = document.getElementsByClassName("collapsible");

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;

      if (content !== null) {
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        };
      }
    });
  }
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
      addNote(memo=false);
  });
  // add memo button
  var el = document.getElementById('addMemo');
  el.addEventListener('click', function() {
      addNote(memo=true);
  });
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];
  btn.onclick = function() {
    modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

// message button
var el = document.getElementById('msgBtn');
el.addEventListener('click', function() {
  var msgText = document.getElementById('msgText');
  if (msgText.style.opacity == "1") {
    document.getElementById('releaseNotes').style.display = "inline-block";
    msgText.style.opacity = "0";
  }
  else {
    document.getElementById('releaseNotes').style.display = "none";
    msgText.style.opacity = "1";
  }
});

// NOTE EVENT HANDLERS
// adds event handlers for elements on a note
function addNoteEventHandlers(note) {

  var idx = note.id.slice(-2);
  if (isNaN(idx) == true) {
    idx = note.id.slice(-1);
  }
  var header = note.childNodes[0];
  var editHeaderBtn = note.childNodes[1];
  var minBtn = note.childNodes[2];
  var delBtn = note.childNodes[3];
  
  // if it's a memo style note
  if (note.childNodes[4].nodeName == 'TEXTAREA') {
    var memoText = note.childNodes[4];
    var memoBtn = note.childNodes[6];
    memoBtn.addEventListener('click', function() {
      console.log("Memo saved");
      saveMemo(idx);
    });
    
    memoText.addEventListener('click', function() {
      if (memoText.value.length < 300) {
        document.getElementById('pending').textContent = "edit pending save.";
        document.getElementById('pending').style.opacity = "1";
      }
      memoBtn.style.display = "inline-block"; // show the save button
    });
    memoText.addEventListener('keyup', countCharacters, false);

  }
  else { // if it's a list style note
    var taskInput = note.childNodes[4];
    var addBtn = note.childNodes[5];
    var undoBtn = note.childNodes[6];

    taskInput.addEventListener('keyup', function (e) {
      if (e.keyCode == 13) {
        event.preventDefault();
        addBtn.click();
      }
    });
    addBtn.addEventListener('click', function() {
      console.log("clicked");
      add();
    });
    undoBtn.addEventListener('click', function() {
      undo();
    })
  }

  var headerItem = document.querySelector('#headerItem' + idx);

  // drag note
  header.addEventListener('mousedown', function() {
    console.log("clicked");
    dragElement();
  });
  editHeaderBtn.addEventListener('click', function() {
    console.log("clicked");
    editHeader(idx);
  });
  minBtn.addEventListener('click', function() {
    console.log("clicked");
    minimize();
  });
  delBtn.addEventListener('click', function() {
    console.log("clicked");
    deleteNote();
  });
  header.addEventListener('keyup', function (e) {
    console.log("typing");
    if (e.keyCode == 13) {
      event.preventDefault();
      editHeaderBtn.click();
    }
  });
  headerItem.addEventListener('click', function() {
    console.log("clicked");
    hideNote();
  });
}

// adds event listeners when page loads
attachedListeners = false;
function addNoteEventHandlersOnLoad() {
  
  chrome.storage.sync.get(['haveListeners'], function(result) {
    console.log(result);
    
    if (attachedListeners == true) {
      return;
    }

    all_notes = (document.querySelectorAll('.drag'));
    for (i=0; i < all_notes.length; i++) {
      addNoteEventHandlers(all_notes[i]);
    }
    console.log("Adding listeners...");
    storeSync('haveListeners',true);
    attachedListeners = true;
    /*
    chrome.browserAction.onClicked.addListener(function() {
      chrome.tabs.create({'url':"chrome://newtab"});
    });
    */
  });
}

hasBtnListener = false;
function addExtensionBtnListener() {
  chrome.storage.sync.get(['hasBtnListener'], function(result) {
    console.log(result);

    if (hasBtnListener == true) {
      console.log("Already has btn listener...");
      return;
    }
    hasBtnListener = true;
    chrome.browserAction.onClicked.addListener(function() {
      chrome.tabs.create({'url':"chrome://newtab"});
      storeSync('hasBtnListener',true);
    });
  });
}

// adds event handlers for todo items on a note
function addTodoEventHandlers() {
  // strikethrough
  var elements = document.getElementsByClassName('check');
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      strikeThrough();
    });
  }
  // remove a todo item
  var elements = document.getElementsByClassName('crossoff');
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("crossoff clicked");
      // crossed is false or true?
      remove(false);
    });
  }
  // edit a todo item
  var elements = document.getElementsByClassName('span');
  for (var i = 0; i < elements.length; i++) {

    elements[i].addEventListener('click', function() {
      console.log("edit item clicked");  
      editNote();
      });
    elements[i].addEventListener('keyup', function (e) {
      console.log("typing");
      if (e.keyCode == 13) {
        event.preventDefault();
        saveEdit();
      }
    });
  }
  // save an edit
  var elements = document.getElementsByClassName('save');
  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function() {
      console.log("save item clicked");  
      saveEdit();
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
// stores item into Google Chrome sync
function storeSync(idx,dict) {
  var key = idx.toString(),
      value = JSON.stringify(
          dict
      );
  var jsonfile = {};
  jsonfile[key] = value;
  chrome.storage.sync.set(jsonfile, function () {
      console.log('Saved', key, value);
  });
}

// dynamically change number of characters remaining in memo
function countCharacters(e) {    
  var elm = getElm();
  console.log(elm);
  console.log(elm.parentNode.childNodes);
  var textEntered, countRemaining, counter;          
  textEntered = elm.parentNode.childNodes[4].value;
  countRemaining = elm.parentNode.childNodes[5]; 
  counter = (300 - (textEntered.length));
  countRemaining.textContent = counter + " characters left";       
}

// creates notes when the page is loaded (note exists), or when the Add Note button is clicked (note does not exist yet)
function createNote(exists,idx,memo) {

  idx = idx.toString();
  var note = document.createElement('div');
  note.id = "mydiv" + idx;
  document.body.appendChild(note);
  note.classList.add('drag');
  note.innerHTML += '<input class="dragHeader" maxlength="30" readOnly="true" id="mydiv' + idx + 'header" value="Note ' + idx +'">';
  note.innerHTML += '<img src="images/edit.png" class="editHeader" id="edit">';
  note.innerHTML += '<img src="images/minimize.png" class="minimize" id="minimize">';
  note.innerHTML += '<img src="images/exit.png" class="deleteNote" id="exit"></img>';
  
  if (memo == true) {
    note.innerHTML += '<textarea placeholder="Type a memo here..." maxlength="300" class="memo" rows="8" spellcheck="false" id="memo' + idx +'" style="display:inline-block;"></textarea>';
    note.innerHTML += '<p class="memoCounter" id="memoCounter' + idx + '">Max 300 characters</p>';
    note.innerHTML += '<button class="saveMemo">Save Memo</button>';
  }
  else {
    note.innerHTML += '<input maxlength="100" class="task" placeholder="Add an item" id="task' + idx + '" style="display:inline-block;"><img src="images/add.png" id="add" class="add">';
    note.innerHTML += '<img class="undo" id="undo' + idx + '" src="images/undo.png">';
    note.innerHTML += '<div class="todoLists" id="todos' + idx + '"></div>';
  }

  var note_header = 'Note ' + idx;
 
  chrome.storage.sync.get([idx], function(result) {

    // IF LOADING EXISTING NOTES
    if (exists == true) {
     
      dict = JSON.parse(result[idx]);
      console.log(dict);

      note.style.top = dict['posTop'];
      note.style.left = dict['posLeft'];

      //console.log(dict);
      //note.offsetHeight = dict['height'];
      //note.offsetWidth = dict['width'];
      note_header = dict['headerText'];
      note.childNodes[0].value = note_header;

      // check if the note is minimized
      if (dict['minimized'] == true) {
        note.childNodes[4].style.display = 'none';
        note.childNodes[5].style.display = 'none';
        note.childNodes[6].style.display = 'none';
        note.childNodes[7].style.display = 'none';
      }
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

      // if note is a memo, query saved text
      if (memo == true) {
        note.childNodes[4].value = dict['memo'];
        textEntered = note.childNodes[4].value;
        note.childNodes[5].textContent = (300 - textEntered.length) + " characters left";
      }

    addNoteEventHandlersOnLoad();
    }
    // IF ADDING A NEW NOTE
    else {
      console.log(idx);
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
        'isMemo': memo,
        'memo': null,
      };
      console.log("Creating item: " + idx);

      storeSync(idx,dict);

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
      addNoteEventHandlers(note);
    } 
  });
};

// page load
function loadPage() {

  // check if user has enabled dark mode
  chrome.storage.sync.get(['firenote_dark'], function(result) {
    console.log(result['firenote_dark']);
    if (result['firenote_dark'] == true) {
      
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
    var all_idx = [];

    for (var i = 1; i <= 20; i++) {
      all_idx.push(i.toString());
    }
    console.log(all_idx);

    try {

      chrome.storage.sync.get(all_idx, function(result) {

        for (idx=1; idx <= 20; idx++) { // 20 for now
          idx = idx.toString();

          // check if a note exists with the given key/index
          try {
            result2 = JSON.parse(result[idx]);
            memo = result2['isMemo'];
            createNote(exists=true,idx,memo);
            
            if (memo == false) {
              show(idx);
            }
          }
          catch (err) {
            console.log(err);
            continue;
          }
        }
      });
    }
    catch(err) {
      console.log(error);
    }
  });
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

  chrome.storage.sync.get(['firenote_dark'], function(result) {

    // check if dark mode was enabled by user
    if (result['firenote_dark'] == true) {
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

      chrome.storage.sync.set({'firenote_dark' : false}, function() {
        console.log('Value is set to false');
      });
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
      
      chrome.storage.sync.set({'firenote_dark' : true}, function() {
        console.log('Value is set to true');
      });
    }
  });
}

// gets an element
function getElm(e) {
   e = e || window.event;
   e = e.target || e.srcElement;
   console.log("Element is: " + e);
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

  //document.getElementById(elm.id).onmousedown = dragMouseDown;
  
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

    chrome.storage.sync.get([idx.toString()], function(result) {
      dict = JSON.parse(result[idx]);
      console.log(dict);
      dict['posTop'] = elm.style.top;
      dict['posLeft'] = elm.style.left;
      storeSync(idx,dict);
    });
  }
}

// adds a note to the screen when "Add Note" is clicked
function addNote(memo) {

  var existing_notes = [];
  var first_empty_slot = 1;

  // detect which notes are currently on the screen
  var header_list = document.querySelectorAll(".dragHeader");
  var notes_on_screen = [];
  console.log(header_list);

  // 10 note limit
  var basic = true; // basic vs premium version of firenote app
  if ((header_list.length >= 10) && (basic == true)) {
    alert("You have reached the maximum 10 note limit. Please delete a note to add more. (I am working on a premium version to allow more notes and other cool features!)");
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

  slot_found = false;
  var all_idx = [];
  for (var j = 1; j <= header_list.length + 1; j++) {
    all_idx.push(j.toString());
  }
  console.log(all_idx);

  try {
    chrome.storage.sync.get(all_idx, function(result) {

      console.log(result);

      for (j=1; j <= header_list.length + 1; j++) {
        j = j.toString();

        try {
          note_check = JSON.parse(result[j]);
          console.log(note_check);
        }
        catch(err){
          console.log(err);
          note_check = null;
        }
        // check if a note exists with the given key/index
        if (notes_on_screen.includes(j) == true) {
          existing_notes.push(j);
        }
        // if the note exists at that index (may not be on screen)
        else if ((note_check !== null) && (note_check !== "[]")) {
          existing_notes.push(j);
        }
        // break on first instance that an available slot is found
        else if ((note_check == undefined) || (note_check == null)) {
          console.log("breaking at " + j);

          if (slot_found == false) {
            first_empty_slot = j;
            slot_found = true;
          }
        };
      }
      console.log(j + note_check);
      console.log(first_empty_slot);
      console.log(existing_notes);
      idx = first_empty_slot.toString();
      createNote(exists=false,idx,memo);
    });
  }
  catch(err) {
    console.log(err);
  }
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
  var header = elm.childNodes[0].value;
  var r = confirm("Are you sure you want to delete " + header + "?");
  if (r== false) {
    return;
  }
  // remove the div
  elm.remove();
  console.log(idx);
  document.querySelector("#headerItem" + idx.toString()).remove();
  chrome.storage.sync.remove(idx.toString());
}

// remove all notes
function clearAll() {

  r = confirm("This will remove all of your notes and delete them from your cache. Are you sure you want to proceed?");
  if (r == true) {
    var header_list = document.querySelectorAll(".drag");
    console.log(header_list);

    for (j = 1; j <= header_list.length; j++) {
      console.log("runs");
      console.log(document.querySelector('#mydiv' + j));
      document.querySelector('#mydiv' + j).remove();
      document.querySelector("#headerItem" + j.toString()).remove();
    }
    chrome.storage.sync.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
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
    console.log(elm.parentNode);
    if (elm.childNodes[4].value == "") {
      return;
    }
    var task = elm.childNodes[4].value;
    console.log(task);

    // get the current list of todos for that note
    chrome.storage.sync.get([idx], function(result) {
      dict = JSON.parse(result[idx]);
      console.log(dict);

      var todos_str = dict['todo'];
      console.log(todos_str);

      // if there is an actual list
      if (todos_str !== null) {

        // add the new task to the list of todos for that note
        var todos = todos_str;
        console.log(todos);
        if (todos[todos.length - 1] != task) {
            todos.push(task);
        }
      }
      else {
        todos = [task];
        console.log(todos);
      }
      dict['todo'] = (todos);
      console.log(dict['todo']);

      storeSync(idx,dict);
      
      console.log(dict);
      show(idx);

      elm.childNodes[4].value = "";
    });
}

// removes an item from a todo list
function remove() {

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

    chrome.storage.sync.get([idx.toString()], function(result) {
      console.log(result);
      console.log(result[idx]);
      dict = JSON.parse(result[idx]);
      console.log(dict);
      var todos = dict['todo'];
      var crossed = dict['strikethrough'];

      // determine if the todo item is crossed out or not
      var isTodo= false;
      if (elm.parentNode.childNodes[3].style.textDecoration !== 'line-through') {
        var isTodo = true;
      }
      console.log(isTodo);

      if (isTodo == false) {

        console.log(crossed);
        var removed = crossed.splice(id, 1);
        console.log(removed);
        console.log("Currently in crossed: " + crossed);
        dict['strikethrough'] = crossed;
        dict['removed'] = removed;
        storeSync(idx,dict);
        
        show(idx);
      }
      else {
        console.log(todos);
        var removed = todos.splice(id, 1);
        console.log(removed);
        console.log("Currently in todos: " + todos);
        dict['todo'] = todos;
        dict['removed'] = removed;
        storeSync(idx,dict);
        show(idx);
      }
    });
}

// recovers a deleted list item
function undo() {
  elm = getElm();

  // get the index of div element
  idx = elm.parentNode.id.slice(-2);
  if (isNaN(idx) == true) { // if is NOT a number
    idx = elm.parentNode.id.slice(-1); // not a 2 digit number
  }
  chrome.storage.sync.get([idx.toString()], function(result) {
    dict = JSON.parse(result[idx]);
    console.log(dict['removed'])
    if (dict['removed'] == undefined) {
      dict['removed'] = "";
      var pending = document.getElementById('pending');
      pending.textContent = "no item found to undo.";
      pending.style.opacity = "1";
    }
    elm.parentNode.childNodes[4].value = dict['removed'];
    elm.parentNode.childNodes[5].click();
  });
}

// save memo
function saveMemo(idx) {
  elm = getElm();

  memo_text = elm.parentNode.childNodes[4];
  memoBtn = elm.parentNode.childNodes[6];
  console.log(memo_text.value);
  var pending = document.querySelector("#pending");
  pending.textContent = "edit saved.";
  pending.style.opacity = "1";
  fade(pending);
  memoBtn.style.display = "none"; //show the save button

  chrome.storage.sync.get([idx.toString()], function(result) {
    console.log(result);
    console.log(result[idx]);
    dict = JSON.parse(result[idx]);
    console.log(dict);
    //memo_text_new = memo_text.value.replace(/\r\n|\r|\n/g,"</br>");
    dict['memo'] = memo_text.value;
    console.log(dict)
    storeSync(idx,dict);
  });
}

// show memo
function showMemo(idx) {
  chrome.storage.sync.get([idx.toString()], function(result) {
    console.log(result);
    dict = JSON.parse(result[idx]);
    console.log(dict);
    console.log(dict['memo']);
  });
}

// idx is the targeted note index
function show(idx) {

  chrome.storage.sync.get([idx.toString()], function(result) {
    console.log(result);
    dict = JSON.parse(result[idx]);
    console.log(dict);
    console.log(dict['todo']);

    var todos_list = dict['todo'];
    var crossed_list = dict['strikethrough'];

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
          html += '<img class="check" src="images/check.png">';
          html += '<img class="crossoff" src="images/crossoff.png" id="' + i  + '">';
          html += '<img src="images/save.png" style="display:none;" class="save"></img>';
          html += '<input type="text" class="span" value="' + todos_list[i] + '">';     
          //html += '<hr>';
      };
    }
    if (crossed_list !== undefined) {
      console.log(crossed_list);
      // build list of crossed todo list items
      for(var i=0; i<crossed_list.length; i++) {
        html += '<li class="lists">';
        html += '<img class="check" src="images/check.png">';
        html += '<img class="crossoff" src="images/crossoff.png" id="' + i  + '">';
        html += '<img src="images/save.png" style="display:none;" class="save"></img>';
        html += '<input style="text-decoration:line-through; color:silver;" class="span" value="' + crossed_list[i] + '">';
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
    addTodoEventHandlers();
  });
}

// strikes through a todo list item
function strikeThrough() {

  var elm = getElm();

  // get the index of div element
  idx = elm.parentNode.parentNode.parentNode.id.slice(-2);
  if (isNaN(idx) == true) { // if is NOT a number
    idx = elm.parentNode.parentNode.parentNode.id.slice(-1); // not a 2 digit number
  }

  // get id of the todo item we are trying to remove
  var id = elm.parentNode.childNodes[1].getAttribute('id');
  console.log(elm.parentNode.childNodes[1]);
  console.log(elm.parentNode.childNodes[2].tagName);

  // determine if the todo item is crossed out or not
  var crossed = true;
  if (elm.parentNode.childNodes[3].style.textDecoration !== 'line-through') {
    var crossed = false;
  }

  if (crossed == false) {
    
    chrome.storage.sync.get([idx.toString()], function(result) {
      console.log(result);
      console.log(result[idx]);
      dict = JSON.parse(result[idx]);
      console.log(dict);
      console.log(dict['todo'])

      var todos = dict['todo'];
      console.log(todos);

      var removed_item = todos.splice(id, 1);
      console.log(removed_item);

      console.log("Currently in todos: " + todos);

      dict['todo'] = todos;
      storeSync(idx,dict);

      // add removed item to the strikethrough list
      var strike_list = dict['strikethrough'];

      if (strike_list == undefined) {
        dict['strikethrough'] = [removed_item];
      }
      else {
        strike_list.push(removed_item);
      }
      storeSync(idx,dict);
      console.log(dict);
      show(idx);
    });
  }
  // if reinstating an item that was crossed off
  else {
    chrome.storage.sync.get([idx.toString()], function(result) {
      console.log(result);
      console.log(result[idx]);
      dict = JSON.parse(result[idx]);
      console.log(dict);
      console.log(dict['todo'])

      // first remove the item from the strikethrough list
      var crossed = dict['strikethrough'];
      var removed_item = crossed.splice(id, 1);
      dict['strikethrough'] = crossed;
      storeSync(idx,dict)

      // add removed item back to the todos list
      // get the current list of todos for that note
      var todos = dict['todo'];
      var task = removed_item[0];

      // if there is an actual list
      if (todos !== null) {
        // add the new task to the list of todos for that note
        //var todos = JSON.parse(todos_str);

        if (todos[todos.length - 1] != task) {
            todos.push(task);
        }
      }
      else {
        todos = [task];
      }
      storeSync(idx,dict)
      show(idx);
    });
  }
  
}

// docks all notes
function dockAll() {
  var header_list = document.querySelectorAll(".dragHeader");

  // recreate saved notes on page load
  var all_idx = [];
  for (var i = 1; i <= header_list.length; i++) {
    all_idx.push(i.toString());
  }

  chrome.storage.sync.get(all_idx, function(result) {

    // check if all elements are hidden
    var all_hidden = true;
    for (var i = 1; i <= header_list.length; i++) {
      console.log(result)
      dict = JSON.parse(result[i]);
      if (dict['hidden'] == false) {
        all_hidden = false;
        break;
      } 
    }
    for (var i = 1; i <= header_list.length; i++) {
      dict = JSON.parse(result[i]);
      div_to_hide = document.querySelector('#mydiv' + i.toString());

      // reveal all notes if they are all hidden
      if (all_hidden == true) {
        
        dict['hidden'] = false;
        div_to_hide.style.display = "block";
        document.querySelector('#headerItem' + i).style.color = "rgb(95, 95, 95)";
        // change notes dock colors
        if (document.getElementById('toggleDarkMode').style.color == '#fcd488') {
          document.querySelector('#headerItem' + i).style.color = "white";
        }
      }
      // else hide the notes that are showing
      else {
        dict['hidden'] = true;
        div_to_hide.style.display = "none";
        document.querySelector('#headerItem' + i).style.color = "silver";
      }
      storeSync(i,dict);
    }
  });
}

// hides a note from view by clicking on it in the Notes Dock
function hideNote(idx) {
  
  // save hidden feature to local storage
  elm = getElm();

  console.log(elm);
  if (idx == undefined) { // if not docking all notes
    idx = elm.id.slice(-2);
    if (isNaN(idx) == true) {
      idx = elm.id.slice(-1);
    }
  }
  console.log(idx);
  chrome.storage.sync.get([idx.toString()], function(result) {
    console.log(result);
    dict = JSON.parse(result[idx]);
    console.log(dict);
    console.log(dict['todo']);

    div_to_hide = document.querySelector('#mydiv' + idx);
    all_divs = document.querySelectorAll(".drag");
    console.log(all_divs);
    console.log(div_to_hide);
    console.log(div_to_hide.style.display);

    if (div_to_hide.style.display == "none") {

      div_to_hide.style.display = "block";
      
      // bring all the other notes behind the selected note
      for (j=0; j<all_divs.length; j++) {
        all_divs[j].style.zIndex = "1";
      }
      div_to_hide.style.zIndex = "2";

      elm.style.color = "black";

      chrome.storage.sync.get(['firenote_dark'], function(result) {
        // check if dark mode was enabled by user
        if (result['firenote_dark'] == true) {
          elm.style.color = "white";
        }
        dict['hidden'] = false;
        storeSync(idx,dict);
      });
    }
    else {
      console.log("hiding...");
      // reset notes zIndexes
      for (j=0; j<all_divs.length; j++) {
        all_divs[j].style.zIndex = "1";
      }
      div_to_hide.style.display = "none";
      console.log(div_to_hide.style.display);
      elm.style.color = "silver";
      dict['hidden'] = true;
    }
    storeSync(idx,dict);
  });
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
  var hide_undo = elm.parentNode.childNodes[6];
  var hide_todo = elm.parentNode.childNodes[7];
 
  // if visible
  chrome.storage.sync.get([idx.toString()], function(result) {
    console.log(result);
    console.log(result[idx]);
    dict = JSON.parse(result[idx]);
    console.log(dict);

    console.log(hide_add.style.display);
    if (hide_input.style.display == 'inline-block') {
      console.log("hiding");
      hide_input.style.display = 'none';
      hide_add.style.display = 'none';
      hide_undo.style.display = 'none';
      hide_todo.style.display= 'none';
      dict['minimized'] = true;
      
    }
    else {
      console.log("showing");
      hide_input.style.display = 'inline-block';
      hide_add.style.display = 'inline-block';
      hide_undo.style.display = 'inline-block';
      hide_todo.style.display = 'inline-block';
      dict['minimized'] = false;    
    }
    console.log(idx);
    console.log(dict);
    storeSync(idx,dict);
  });
}

// allows edit of the header of a note
function editHeader(idx) {
  elm = getElm();
  header = elm.parentNode.childNodes[0];
  pending = document.querySelector('#pending');

  if (header.readOnly == true) {
    header.readOnly = false;
    // setting focus on input
    header.focus();
    var val = header.value; // store the value of the element
    header.value = ''; // clear the value of the element
    header.value = val; // set that value back
    console.log(elm.parentNode.childNodes);
    elm.parentNode.childNodes[1].src = "images/edit_active.png";
    pending.textContent = "edit pending save.";
    pending.style.opacity = "1";
  }
  else {
    elm.parentNode.childNodes[1].src = "images/edit.png";
    header.readOnly = true;
    header.blur();
    fade(pending);
    chrome.storage.sync.get([idx.toString()], function(result) {
  
      dict = JSON.parse(result[idx]);
      dict['headerText'] = header.value; 
      document.querySelector('#headerItem' + idx).textContent = header.value; // update note dock
      storeSync(idx,dict);
    });
  }
}

// allows a list item to be edited
var og_note;
function editNote() {
  elm = getElm();
  var pending = document.querySelector("#pending");
  pending.textContent = "edit pending save.";
  pending.style.opacity = "1";

  og_note = elm.value; // original note content
  console.log(og_note);
  console.log(elm.parentNode.childNodes);

  shown_save_count = 0;
  var displayed;
  // check for existing save buttons (pending edits)
  spanList = document.querySelectorAll(".span");
  for (j = 0; j < spanList.length; j++) {

    save_button = spanList[j].parentNode.childNodes[2];

    if (save_button.style.display == 'inline-block') {
      displayed = save_button;
      shown_save_count++;
    };
  };
  // if there are no pending edits, show the save button
  console.log(shown_save_count);
  save_button = elm.parentNode.childNodes[2];

  if (shown_save_count < 1) {

    save_button.style.display = "inline-block"; //show the save button
    elm.setAttribute("contentEditable", true);
    elm.focus();
    shown_save_count++;
  }
  // if you click on the same pending edit, will not prompt the pending message
  else if ((shown_save_count == 1) && (displayed == save_button)) {
    console.log(og_note);
 
    save_button.style.display = "inline-block"; //show the save button
    elm.setAttribute("contentEditable", true);
    elm.focus();
  }
  else {
    og_note = [og_note[0]];
    console.log(shown_save_count);
    pending.textContent = "you have unsaved pending edits. save before adding new edit.";
    pending.style.opacity = "1";
  };
}

// saves an edit on a todo list item
function saveEdit() {
    var pending = document.querySelector("#pending");
    spanList = document.querySelectorAll(".span");
    shown_save_count = 0;
    
    console.log(og_note);
    elm = getElm(); // get the save button
    console.log(elm.parentNode.childNodes);
    var task = elm.parentNode.childNodes[3].value; // get the text of the edited note
    console.log(task);
    var parent = elm.parentNode.parentNode.parentNode; // get the index of div element
    idx = parent.id.slice(-1);

    // determine if the todo item is crossed out or not
    var isCrossed = true;
    if (elm.parentNode.childNodes[3].style.textDecoration !== 'line-through') {
      var isCrossed = false;
    }

    chrome.storage.sync.get([idx.toString()], function(result) {
      console.log(result);
      console.log(result[idx]);
      dict = JSON.parse(result[idx]);
      
      if (isCrossed == false) {
        console.log("crossed is false");
        // get the current list of todos for that note
        todos = dict['todo'];

        note_idx = todos.indexOf(og_note);
        console.log(task);
        console.log(todos);
        todos[note_idx] = task; // set the old note to the edited note
        console.log(todos);
        dict['todo'] = todos;
        storeSync(idx,dict);
        save_button = elm.parentNode.childNodes[2];
        save_button.style.display = "none";
        pending.textContent = "edit saved.";
        fade(pending);
        //pending.style.opacity = "0";
      }
      else {
        console.log("crossed is true");
        // get the current list of todos for that note
        todos = dict['strikethrough'];
        note_idx = todos.indexOf(og_note);

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
        todos[note_idx] = task; // set the old note to the edited note
        dict['strikethrough'] = todos;
        storeSync(idx,dict);
        save_button = elm.parentNode.childNodes[2];
        save_button.style.display = "none";
        console.log(save_button.style.display);
        pending.textContent = "edit saved.";
        fade(pending);
        //pending.style.opacity = "0";
      }
    });
}

// fade an element out
function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
      if (op <= 0.1){
          clearInterval(timer);
          //element.style.display = 'none';
          op = 0;
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= op * 0.08;
    
  }, 50);
}
