/*
version 2.1
A brief guide to defined variables:
N: any integer
'todoN': represents a LIST of todo items for any note of index N
'headerTextN': the text element of the header of note N
'headerItemN': the text element of the header of note N in the Notes Dock


SECTIONS IN THIS CODE:

I. GLOBAL VARIABLES
II. DOCUMENT LOAD AND EVENT HANDLERS
III. RIGHT SIDE MENU FUNCTIONS
IV. NOTE DOCK FUNCTIONS
V. MAIN FIRENOTE FUNCTIONS
VI. NOTE HEADER BAR FUNCTIONS
VII. MEMO FUNCTIONS
VIII. TODO LIST FUNCTIONS
IX. HELPER FUNCTIONS
*/ 

// *****************************************************************************************************************
// *****************************************************************************************************************
// I. GLOBAL VARIABLES
// *****************************************************************************************************************
// *****************************************************************************************************************

// check user storage:
chrome.storage.sync.getBytesInUse(function(result){
  console.log("Bytes in use: " + result + " out of 102,400 quota bytes")
});

// note colors used
var color_dict = {"Orange":"#ffdfba", "Pink":"#ffedf8", "Blue":"#d0ebfc", "Green":"#ceffeb", "Yellow":"#fcfacf"};
// max allowed notes on screen
const max_notes = 15;
// indicates if dark mode is enabled
var dark_enabled = document.getElementById("darkEnabled");
// autosizes height of textarea
var autoExpand = function (field) {

	// Reset field height
	field.style.height = 'inherit';

	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);

	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

	field.style.height = height + 'px';
  return height
};





// *****************************************************************************************************************
// *****************************************************************************************************************
// PART II. DOCUMENT LOAD AND EVENT HANDLERS
// *****************************************************************************************************************
// *****************************************************************************************************************
$(document).ready(function() {

  // adding event listeners to right-side menu
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
  // adding event listeners to note dock items
  coll = document.getElementsByClassName("folderCollapsible");
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
  // adding event listeners to note dock context menu items
  var el = document.getElementById("moveOrange");
  el.addEventListener('click',function() {
    moveToFolder('Orange', move_select);
  });
  var el = document.getElementById("movePink");
  el.addEventListener('click',function() {
    moveToFolder('Pink', move_select);
  });
  var el = document.getElementById("moveBlue");
  el.addEventListener('click',function() {
    moveToFolder('Blue', move_select);
  });
  var el = document.getElementById("moveGreen");
  el.addEventListener('click',function() {
    moveToFolder('Green', move_select);
  });
  var el = document.getElementById("moveYellow");
  el.addEventListener('click',function() {
    moveToFolder('Yellow', move_select);
  });

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
  // add folder buttons
  var el = document.getElementsByClassName('circle');
  for (i = 0; i < el.length; i++) {
    el[i].addEventListener('click', function() {
        createFolder();
    });
  };

  // quick guide modal
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
  // quick guide modal - folders
  var modal2 = document.getElementById("myModal2");
  var prevBtn = document.getElementById("guideBtn2");
  var nextBtn = document.getElementById("guideBtn1");
  span = document.getElementsByClassName("close")[1];

  nextBtn.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal2.style.display = "none";
  }
  // Go to previous modal when this button is clicked
  prevBtn.onclick = function() {
    modal.style.display = "block";
    modal2.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal2) {
      modal2.style.display = "none";
    }
  }

  // dev messages button
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

  // ***********************************************************************************************
  // CONTEXT MENUS ON LOAD
  // ***********************************************************************************************
  // context menu for todo list items
  const move_down = document.querySelector(".movedown");
  const move_up = document.querySelector(".moveup");
  const priority_btn = document.querySelector(".priority");

  // runs this function when a menu item is clicked
  move_up.addEventListener("click", e => {
    moveItem(move_select, "up");
  });
  // runs this function when a menu item is clicked
  move_down.addEventListener("click", e => {
    moveItem(move_select, "down");
  });
   // runs this function when a menu item is clicked
  priority_btn.addEventListener("click", e => {
    prioritize(move_select, "prioritize");
  });

  // create context menu for hiding and renaming folder
  var setPosition2 = createContextMenu(document.querySelector(".folderDelMenu"));
  var folder_list = ["folderOrange","folderPink","folderBlue","folderGreen"];

  for (i=0; i < folder_list.length; i++) {
    document.getElementById(folder_list[i]).addEventListener("contextmenu", e => {
      move_select = getElm();
      e.preventDefault();
      const origin = {
        left: e.pageX,
        top: e.pageY
      };
      setPosition2(origin);
      return false;
    });
  }
  // add event listeners for folder action context menus
  document.querySelector(".hideFolder").addEventListener("click", e => {
    hideFolder(move_select);
  });
  document.querySelector(".renameFolder").addEventListener("click", e => {
    renameFolder(move_select);
  });
  document.querySelector(".deleteFolder").addEventListener("click", e => {
    deleteFolder(move_select);
  });

  let folder_headers = document.getElementsByClassName("folderHeader");
  for(i=0; i < folder_headers.length; i++) {

    folder_headers[i].addEventListener('keyup', function (e) {

      if (e.keyCode == 13) {
        event.preventDefault();
        saveRename(getElm().value);
      }
    });
  }
});


// ***********************************************************************************************
// NOTE EVENT HANDLERS
// ***********************************************************************************************
// adds event handlers for elements on a note
function addNoteEventHandlers(note) {

  idx = getIdx(note);
  var header = note.childNodes[0];
  var editHeaderBtn = note.childNodes[1];
  var minBtn = note.childNodes[2];
  var delBtn = note.childNodes[3];
  
  // add context menu when you right click on the note header to move to folder
  var setPosition2 = createContextMenu(document.querySelector(".folderAddMenu"));
  header.addEventListener("contextmenu", e => {
    //move_select = getElm().parentNode;
    console.log(idx);
    move_select = document.getElementById("headerItem" + idx);
    console.log(move_select);
    e.preventDefault();
    const origin = {
      left: e.pageX,
      top: e.pageY
    };
    setPosition2(origin);
    return false;
  });

  // if it's a memo style note
  if (note.childNodes[4].nodeName == 'TEXTAREA') {
    var memoText = note.childNodes[4];
    var memoBtn = note.childNodes[6];

    // event listener for dynamic textarea sizing
    var box_height;
    memoText.addEventListener('input', function (event) {
      box_height = autoExpand(event.target);
    });

    memoBtn.addEventListener('click', function() {
      console.log("Memo saved");
      idx = getIdx(note);
      saveMemo(idx, box_height);
    });
    
    memoText.addEventListener('click', function() {
      if (memoText.value.length < 600) {
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
    });
  }

  var headerItem = document.querySelector('#headerItem' + idx);

  // drag note
  header.addEventListener('mousedown', function() {
    console.log("clicked");
    dragElement();
  });
  editHeaderBtn.addEventListener('click', function() {
    console.log("clicked");
    editHeader();
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
    hideNote();
  });

  // context menu for add to folder
  var setPosition = createContextMenu(document.querySelector(".folderAddMenu"));
  headerItem.addEventListener("contextmenu", e => {
    move_select = getElm();
    console.log(move_select);
    e.preventDefault();
    const origin = {
      left: e.pageX,
      top: e.pageY
    };
    setPosition(origin);
    return false;
  });
}


// ***********************************************************************************************
// NOTE EVENT HANDLERS ON PAGE LOAD
// ***********************************************************************************************
// adds event listeners when page loads
attachedListeners = false;
function addNoteEventHandlersOnLoad() {
  
  chrome.storage.sync.get(['haveListeners'], function(result) {
    
    if (attachedListeners == true) { return; }

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


// ***********************************************************************************************
// TODO LIST EVENT HANDLERS
// ***********************************************************************************************
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

  // assign listeners to context menu for to-do list items
  const setPosition = createContextMenu(document.querySelector(".contextMenu"));

  for (var i = 0; i < elements.length; i++) {

    elements[i].addEventListener('click', function() {
      console.log("edit item clicked");  
      editNote();
      });
    // add a listener for the context menu to each element in the to-do list
    elements[i].addEventListener("contextmenu", e => {
      move_select = getElm();
      
      e.preventDefault();
      const origin = {
        left: e.pageX,
        top: e.pageY
      };
      setPosition(origin);
      return false;
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


// ***********************************************************************************************
// LOAD THE PAGE
// ***********************************************************************************************
function loadPage() {

  // check if user has enabled dark mode
  chrome.storage.sync.get(['firenote_dark'], function(result) {

    if (result['firenote_dark'] == true) {
      document.body.classList.toggle("dark-mode");
      var dark = assignColorMode("dark");
      dark_enabled.innerHTML = "enabled";
    }
    // recreate saved notes on page load
    var all_idx = [];

    for (var i = 1; i <= 20; i++) {
      all_idx.push(i.toString());
    }
    console.log(all_idx);

    try {
      chrome.storage.sync.get(all_idx, function(result) {

        for (idx=1; idx <= max_notes; idx++) { // 20 for now
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
      console.log(err);
    }
  });
};
loadPage();





// *****************************************************************************************************************
// *****************************************************************************************************************
// PART III. RIGHT SIDE MENU FUNCTIONS
// *****************************************************************************************************************
// *****************************************************************************************************************

// hides the menu when the 3 bar icon is clicked
function hideMenu() {
  if (document.querySelector('#menu').style.display == "none") {
    document.querySelector('#menu').style.display = "block";
  }
  else {
    document.querySelector('#menu').style.display = "none";
  }
}


// ***********************************************************************************************
// enable dark mode CSS changes
// ***********************************************************************************************
function toggleDarkMode() {

  document.body.classList.toggle("dark-mode");

  chrome.storage.sync.get(['firenote_dark'], function(result) {
    // check if dark mode was enabled by user
    if (result['firenote_dark'] == true) {
      var dark = assignColorMode("light");
      document.getElementById("darkEnabled").innerHTML = "disabled";
    }
    else {
      var dark = assignColorMode("dark");
      document.getElementById("darkEnabled").innerHTML = "enabled";
    }
    chrome.storage.sync.set({'firenote_dark' : dark}, function() {
      console.log('Color mode set');
    });
  });
}


// ***********************************************************************************************
// remove all notes
// ***********************************************************************************************
function clearAll() {
  r = confirm("This will remove all of your notes and delete them from your cache. Are you sure you want to proceed?");
  if (r == true) {
    var header_list = document.querySelectorAll(".drag");

    for (j = 1; j <= max_notes; j++) {
      try {
        console.log("runs");
        console.log(document.querySelector('#mydiv' + j));
        document.querySelector('#mydiv' + j).remove();
        document.querySelector("#headerItem" + j.toString()).remove();
      }
      catch(err) {
        console.log(err);
      }
    }
    chrome.storage.sync.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
  }
}


// ***********************************************************************************************
// docks all notes
// ***********************************************************************************************
function dockAll() {
  //var header_list = document.querySelectorAll(".dragHeader");

  // recreate saved notes on page load
  var all_idx = [];
  for (var i = 1; i <= max_notes; i++) {
    all_idx.push(i.toString());
  }

  chrome.storage.sync.get(all_idx, function(result) {
    console.log(result);
    // check if all elements are hidden
    var all_hidden = true;
    for (var i = 1; i <= max_notes; i++) {
      
      if (result[i] == undefined) { continue; }

      dict = JSON.parse(result[i]);
      if (dict['hidden'] == false) {
        all_hidden = false;
        break;
      }
    }

    for (var i = 1; i <= max_notes; i++) {
 
      if (result[i] == undefined) { continue; }
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






// *****************************************************************************************************************
// *****************************************************************************************************************
// PART IV. NOTE DOCK FUNCTIONS
// *****************************************************************************************************************
// *****************************************************************************************************************

// move note to folder
function moveToFolder(color, move_select) {
  
  var target = document.getElementById("content" + color);
  document.getElementById(move_select.id).remove();

  // if the folder hasn't been created yet, reveal the folder
  try {
    if (target.innerHTML == "") {
      document.getElementById("folder" + color).style.display = "block";
    }
  }
  catch(err) {}

  var idx = getIdx(move_select);

  chrome.storage.sync.get([idx.toString()], function(result) {
    dict = JSON.parse(result[idx]);

    // assign the note's folder to the selected color
    dict['folderColor'] = color;
    storeSync(idx,dict);
  });
  
  // adds the new note header to Notes Dock
  if (color == "Yellow") {
    // move the note out of the folder
    document.querySelector('#myNotes').appendChild(move_select);
  }
  else {
    target.appendChild(move_select);
  }
  var idx = getIdx(move_select);
  var targetNote = document.getElementById("mydiv" + idx);
  
  try {
    targetNote.style.backgroundColor = color_dict[color];
    document.getElementById("mydiv" + idx + "header").style.backgroundColor = color_dict[color];
    document.getElementById("memo" + idx).style.backgroundColor = color_dict[color];
  }
  catch(err) {}
}


// ***********************************************************************************************
// hide all notes in a folder
// ***********************************************************************************************
function hideFolder(move_select) {

  var color = move_select.id.replace('input','');
  color = color.replace('folder','');
  var target = document.getElementById("content" + color);
  var all_divs = document.querySelectorAll(".drag");
  var all_idx = [];
  var dark = false;

  for (j = 0; j < target.childNodes.length; j++) {
    var idx = getIdx(target.childNodes[j]);
    all_idx.push(idx);
  }
  console.log(all_idx);
  chrome.storage.sync.get(all_idx, function(result) {

    console.log(target.childNodes)
    for (i=0; i < target.childNodes.length; i++) {
      
      console.log(target.childNodes[i]);
      var idx = getIdx(target.childNodes[i]).toString();
      var dict = JSON.parse(result[idx]);
      var div_to_hide = document.querySelector('#mydiv' + idx);
      var header_item = document.getElementById("headerItem" + idx);
      

      // check if the note is currently hidden or not
      if (dict['hidden'] == true) {
        console.log("showing...");
        
        div_to_hide.style.display = "block";
        
        // bring all the other notes behind the selected note
        for (j=0; j < all_divs.length; j++) {
          all_divs[j].style.zIndex = "1";
        }
        div_to_hide.style.zIndex = "2";
        
        // if dark
        header_item.style.color = "black";
        if (document.getElementById("darkEnabled").innerHTML == "enabled") {
          header_item.style.color = "white";
        }
        dict['hidden'] = false;
      }
      else {
        console.log("hiding...");
        // reset notes zIndexes
        for (j=0; j < all_divs.length; j++) {
          all_divs[j].style.zIndex = "1";
        }
        div_to_hide.style.display = "none";
        header_item.style.color = "silver";
        dict['hidden'] = true;
      }
      storeSync(idx,dict); 
    }
  });
}


// ***********************************************************************************************
// rename a folder
// ***********************************************************************************************
function renameFolder(move_select) {
  console.log(move_select);

  if (move_select.readOnly == true) {
    move_select.readOnly = false;
    move_select.focus();
    var val = move_select.value; // store the value of the element
    move_select.value = ''; // clear the value of the element
    move_select.value = val; // set that value back

    var pending = document.querySelector("#pending");
    pending.textContent = "type in the new name of your folder. press Enter to save the new name.";
    pending.style.opacity = "1";
  }
}


// ***********************************************************************************************
// saves a folder rename to Chrome storage
// ***********************************************************************************************
function saveRename(rename) {
  elm = getElm();
  var color = elm.id.replace('input','');
  color = color.replace(/\\/g, '');
  
  chrome.storage.sync.get(["folderNames"], function(result) {

    var folderNames = result['folderNames'];
    try {
      folderNames[color] = rename;
    }
    catch(err) {
      result['folderNames'] = {};
      var folderNames = result['folderNames'];
      folderNames[color] = rename;
    }

    var contextMenuSelect = document.getElementById("option" + color);
    contextMenuSelect.innerHTML = rename;

    chrome.storage.sync.set({'folderNames' : folderNames}, function() {
      move_select.blur();
      move_select.readOnly = true;
      document.querySelector("#pending").textContent = "folder renamed.";
      fade(document.querySelector("#pending"));
    });
  });
}


// ***********************************************************************************************
// delete a folder
// ***********************************************************************************************
function deleteFolder(move_select) {

  var r = confirm("Are you sure you want to delete the folder " + move_select.value + "?");
  if (r== false) { return; }

  var color = move_select.id.replace('input','');
  var target = document.getElementById("content" + color);
  var notes_to_delete = [];

  for (i=0; i < target.childNodes.length; i++) {
    var idx = getIdx(target.childNodes[i]);
    notes_to_delete.push(idx);
  }

  // remove all notes within the folder
  for (i=0; i < notes_to_delete.length; i++) {
    idx = notes_to_delete[i];
    document.getElementById('mydiv' + idx).remove();
    document.querySelector("#headerItem" + idx.toString()).remove();
    chrome.storage.sync.remove(idx.toString());
    chrome.storage.sync.remove(color);
    // for debugging purposes (removes all folder names):
    //chrome.storage.sync.remove("folderNames");
  }
  document.getElementById('folder' + color).style.display = "none";
}


// ***********************************************************************************************
// hides a note from view by clicking on it in the Notes Dock
// ***********************************************************************************************
function hideNote() {

  var elm = getElm();
  var idx = getIdx(elm);

  chrome.storage.sync.get([idx.toString()], function(result) {
 
    dict = JSON.parse(result[idx]);
    var div_to_hide = document.querySelector('#mydiv' + idx);
    var all_divs = document.querySelectorAll(".drag");

    if (div_to_hide.style.display == "none") {
      console.log("Showing Note" + idx);
      div_to_hide.style.display = "block";
      
      // bring all the other notes behind the selected note
      for (j=0; j<all_divs.length; j++) {
        all_divs[j].style.zIndex = "1";
      }
      div_to_hide.style.zIndex = "2";
      elm.style.color = "black";

      // check if dark mode was enabled by user
      if (dark_enabled == "enabled") {
        elm.style.color = "white";
      } 
      dict['hidden'] = false;
    }
    else {
      console.log("Hiding Note " + idx);
      // reset notes zIndexes
      for (j=0; j<all_divs.length; j++) {
        all_divs[j].style.zIndex = "1";
      }
      div_to_hide.style.display = "none";
      elm.style.color = "silver";
      dict['hidden'] = true;
    }
    console.log(dict);
    storeSync(idx,dict);
  });
}





// *****************************************************************************************************************
// *****************************************************************************************************************
// PART V. MAIN FIRENOTE FUNCTIONS
// *****************************************************************************************************************
// *****************************************************************************************************************

// creates notes when the page is loaded (note exists), or when the Add Note button is clicked (note does not exist yet)
function createNote(exists,idx,memo) {

  idx = idx.toString();

  //var note_header = 'Note ' + idx;
  chrome.storage.sync.get([idx], function(result) {

    var note = document.createElement('div');
    note.id = "mydiv" + idx;
    document.body.appendChild(note);
    note.classList.add('drag');

    note.innerHTML += '<input class="dragHeader" maxlength="30" readOnly="true" id="mydiv' + idx + 'header" value="Note ' + idx +'">';
    note.innerHTML += '<img src="images/edit.png" class="editHeader" id="edit">';
    note.innerHTML += '<img src="images/minimize.png" class="minimize" id="minimize">';
    note.innerHTML += '<img src="images/exit.png" class="deleteNote" id="exit"></img>';

    if (memo == true) {
      note.innerHTML += '<textarea placeholder="Type a memo here..." maxlength="600" class="memo" rows="8" spellcheck="false" id="memo' + idx +'" style="display:inline-block;"></textarea>';
      note.innerHTML += '<p class="memoCounter" id="memoCounter' + idx + '">Max 600 characters</p>';
      note.innerHTML += '<button class="saveMemo">Save Memo</button>';
    }
    else {
      note.innerHTML += '<input maxlength="250" class="task" placeholder="Add an item" id="task' + idx + '" style="display:inline-block;"><img src="images/add.png" id="add" class="add">';
      note.innerHTML += '<img class="undo" id="undo' + idx + '" src="images/undo.png">';
      note.innerHTML += '<div class="todoLists" id="todos' + idx + '"></div>';
    }

    // IF LOADING EXISTING NOTES
    if (exists == true) {
     
      dict = JSON.parse(result[idx]);
      note.style.top = dict['posTop'];
      note.style.left = dict['posLeft'];

      //note.offsetHeight = dict['height'];
      //note.offsetWidth = dict['width'];
      var note_header = dict['headerText'];
      note.childNodes[0].value = note_header;

      // check if the note is minimized
      if (dict['minimized'] == true) {
        note.childNodes[4].style.display = 'none';
        note.childNodes[5].style.display = 'none';
        note.childNodes[6].style.display = 'none';
        try {
          note.childNodes[7].style.display = 'none';
        }
        catch(err){};
      }
      // adds the new note header to Notes Dock
      var color = dict['folderColor'];
      var note_log = document.createElement('div');
      document.querySelector('#myNotes').appendChild(note_log);
      note_log.innerHTML += '<p class="headerList" id="headerItem' + idx + '">' + note_header + '</p>';

      // add the new note to the appropriate folder
      if ((color !== "Yellow") && (color !== undefined)) {
  
        moveToFolder(color,note_log.childNodes[0]);

        chrome.storage.sync.get(['folderNames'], function(result) {
          try {
            var folderNames = result['folderNames'];
            var rename = color;
            if (folderNames[color] !== undefined) {
              var rename = folderNames[color];
            }
            document.getElementById("input" + color).value = rename;
            document.getElementById("option" + color).innerHTML = rename;
          }
          catch(err) {}
        });
      }

      // check if the note is hidden
      if (dict['hidden'] == true) {
        note.style.display = 'none';
        document.querySelector('#headerItem' + idx).style.color = 'silver';
      }

      // if note is a memo, query saved text
      if (memo == true) {
        note.childNodes[4].value = dict['memo'];
        textEntered = note.childNodes[4].value;
        note.childNodes[5].textContent = (600 - textEntered.length) + " characters left";
        // set the textarea to the saved height
        note.childNodes[4].style.height = dict['boxHeight'] + "px"; 
      }

    addNoteEventHandlersOnLoad();
    }
    // ****************************************************************
    // IF ADDING A NEW NOTE
    // ****************************************************************
    else {
      var note_header = "Note " + idx;
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


// ***********************************************************************************************
// allows an element to be dragged
// ***********************************************************************************************
function dragElement(elm) {
  // get the div header element
  elm = getElm();
  // get the parent div element
  elm = elm.parentNode;
  console.log(elm);

  // get the index of div element
  idx = getIdx(elm);

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
    idx = getIdx(elm);

    chrome.storage.sync.get([idx.toString()], function(result) {
      dict = JSON.parse(result[idx]);
      console.log(dict);
      dict['posTop'] = elm.style.top;
      dict['posLeft'] = elm.style.left;
      storeSync(idx,dict);
    });
  }
}


// ***********************************************************************************************
// adds a note to the screen when "Add Note" is clicked
// ***********************************************************************************************
function addNote(memo) {

  var existing_notes = [];
  var first_empty_slot = 1;

  // detect which notes are currently on the screen
  var header_list = document.querySelectorAll(".dragHeader");
  var notes_on_screen = [];
  console.log(header_list);

  // 10 note limit
  var basic = true; // basic vs premium version of firenote app
  if ((header_list.length >= max_notes) && (basic == true)) {
    alert("You have reached the maximum " + max_notes + " note limit. Please delete a note to add more. (I am working on a premium version to allow more notes and other cool features!)");
    return;
  }
  if (header_list.length >= 20) {
    alert("You have reached the maximum 20 note limit! Please delete a note to add more.");
    return;
  }
  
  for (j = 0; j < header_list.length; j++) {
    var idx = getIdx(header_list[j]);
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





// *****************************************************************************************************************
// *****************************************************************************************************************
// PART VI. NOTE HEADER BAR FUNCTIONS
// *****************************************************************************************************************
// *****************************************************************************************************************

// allows edit of the header of a note
function editHeader() {
  elm = getElm();
  var header = elm.parentNode.childNodes[0];
  var idx = getIdx(elm.parentNode);
  pending = document.querySelector('#pending');

  if (header.readOnly == true) {
    header.readOnly = false;
    // setting focus on input
    header.focus();
    var val = header.value; // store the value of the element
    header.value = ''; // clear the value of the element
    header.value = val; // set that value back
    elm.parentNode.childNodes[1].src = "images/edit_active.png";
    pending.textContent = "edit pending save.";
    pending.style.opacity = "1";
  }
  else {
    elm.parentNode.childNodes[1].src = "images/edit.png";
    header.readOnly = true;
    header.blur();
    console.log(header);
    fade(pending);
    chrome.storage.sync.get([idx.toString()], function(result) {
  
      dict = JSON.parse(result[idx]);
      dict['headerText'] = header.value;
      document.querySelector('#headerItem' + idx).textContent = header.value; // update note dock
      storeSync(idx,dict);
    });
  }
}


// ***********************************************************************************************
// minimize a note leaving only the header
// ***********************************************************************************************
function minimize() {
  elm = getElm();

  idx = getIdx(elm.parentNode);

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
      dict['minimized'] = true;
      try {
        hide_input.style.display = 'none';
        hide_add.style.display = 'none';
        hide_undo.style.display = 'none';
        hide_todo.style.display= 'none';
      }
      catch(err) {
        console.log(err);
      }    
    }
    else {
      console.log("showing");
      dict['minimized'] = false; 
      try {
        hide_input.style.display = 'inline-block';
        hide_add.style.display = 'inline-block';
        hide_undo.style.display = 'inline-block';
        hide_todo.style.display = 'inline-block';
      }
      catch(err) {
        console.log(err);
      }
    }
    console.log(idx);
    console.log(dict);
    storeSync(idx,dict);
  });
}


// ***********************************************************************************************
// deletes a note from existence
// ***********************************************************************************************
function deleteNote() {

  var elm = getElm();
  // get the parent div element (the note)
  elm = elm.parentNode;
  idx = getIdx(elm);
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





// *****************************************************************************************************************
// *****************************************************************************************************************
// PART VII. MEMO FUNCTIONS
// *****************************************************************************************************************
// *****************************************************************************************************************

// save memo
function saveMemo(idx, box_height) {
  elm = getElm();

  console.log(box_height); // how many pixels tall the textarea is
  
  memo_text = elm.parentNode.childNodes[4];
  memoBtn = elm.parentNode.childNodes[6];
  console.log(memo_text.value);
  var pending = document.querySelector("#pending");
  pending.textContent = "edit saved.";
  pending.style.opacity = "1";
  fade(pending);
  memoBtn.style.display = "none"; //show the save button
  console.log(idx);

  chrome.storage.sync.get([idx.toString()], function(result) {

    dict = JSON.parse(result[idx]);
    console.log(dict);
    //memo_text_new = memo_text.value.replace(/\r\n|\r|\n/g,"</br>");
    dict['memo'] = memo_text.value;
    dict['boxHeight'] = box_height;
    console.log(dict)
    storeSync(idx,dict);
  });
}


// ***********************************************************************************************
// show memo
// ***********************************************************************************************
function showMemo(idx) {
  chrome.storage.sync.get([idx.toString()], function(result) {
    console.log(result);
    dict = JSON.parse(result[idx]);
    console.log(dict);
    console.log(dict['memo']);
  });
}





// *****************************************************************************************************************
// *****************************************************************************************************************
// PART VIII. TODO LIST FUNCTIONS
// *****************************************************************************************************************
// *****************************************************************************************************************

// add a new todo list item to an existing list
function add() {
  // get the parent div element
  var elm = getElm();
  elm = elm.parentNode;
  console.log(elm);

  // get the index of div element
  idx = getIdx(elm);

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


// ***********************************************************************************************
// recovers a deleted list item
// ***********************************************************************************************
function undo() {
  elm = getElm();

  // get the index of div element
  idx = getIdx(elm.parentNode);

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


// ***********************************************************************************************
// idx is the targeted note index
// ***********************************************************************************************
function show(idx) {

  chrome.storage.sync.get([idx.toString()], function(result) {

    var dict = JSON.parse(result[idx]);
    var todos_list = dict['todo'];
    var crossed_list = dict['strikethrough'];
    var priority_list = dict['priority'];

    //console.log("Currently in the priority list: " + priority_list);
    //console.log("Currently in this todo list:" + todos_list + "!");
    //console.log("Currently in the crossed list: " + crossed_list);

    var html = '<ul>';
    // if list of priorities is found, show on screen
    if (priority_list !== undefined) {
      for(var i=0; i<priority_list.length; i++) {
        html += '<li class="lists">';
        html += '<img class="check" src="images/check.png">';
        html += '<img class="crossoff" src="images/crossoff.png" id="' + i  + '">';
        html += '<img src="images/save.png" style="display:none;" class="save"></img>';
        html += '<span style="font-weight:bold; color:black;" type="text" class="span">' + priority_list[i] + '</span>';   
      }
    }
    // if the list of todos is found, shown on screen
    if ((todos_list !== null) && (todos_list !== undefined) && (todos_list.toString() !== "")) {
      
      // build list of uncrossed todo list items
      for(var i=0; i<todos_list.length; i++) {
          html += '<li class="lists">';
          html += '<img class="check" src="images/check.png">';
          html += '<img class="crossoff" src="images/crossoff.png" id="' + i  + '">';
          html += '<img src="images/save.png" style="display:none;" class="save"></img>';
          html += '<span type="text" class="span">' + todos_list[i] + '</span>';     
      };
    }
    if (crossed_list !== undefined) {
      // build list of crossed todo list items
      for(var i=0; i<crossed_list.length; i++) {
        html += '<li class="lists">';
        html += '<img class="check" src="images/check.png">';
        html += '<img class="crossoff" src="images/crossoff.png" id="' + i  + '">';
        html += '<img src="images/save.png" style="display:none;" class="save"></img>';
        html += '<span style="text-decoration:line-through; color:silver;" class="span">' + crossed_list[i] + '</span>';
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


// ***********************************************************************************************
// strikes through a todo list item
// ***********************************************************************************************
function strikeThrough() {

  var elm = getElm();
  var parent = elm.parentNode.parentNode.parentNode;

  // get the index of div element
  idx = getIdx(parent);

  // get id of the todo item we are trying to remove
  var id = elm.parentNode.childNodes[1].getAttribute('id');
  var list_item = elm.parentNode.childNodes[3];
  console.log(elm.parentNode.childNodes[1]);

  // determine if the todo item is crossed out or not
  var crossed = true;
  if (list_item.style.textDecoration !== 'line-through') {
    var crossed = false;
  }

  if (crossed == false) {
    
    chrome.storage.sync.get([idx.toString()], function(result) {
      
      dict = JSON.parse(result[idx]);

      var todos = dict['todo'];
      var priority_list = dict['priority'];

      // remove item from the appropriate list
      if (list_item.style.fontWeight == 'bold') {
        var removed_item = priority_list.splice(id, 1);
        dict['priority'] = priority_list;
      }
      else {
        var removed_item = todos.splice(id, 1);
        dict['todo'] = todos;
      }
      console.log(removed_item);
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

      dict = JSON.parse(result[idx]);

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


// ***********************************************************************************************
// prioritizes a todo list item
// ***********************************************************************************************
function prioritize(move_select) {

  var parent = move_select.parentNode.parentNode.parentNode;
  var list_item = move_select.parentNode.childNodes[3];

  // get the index of div element
  idx = getIdx(parent);

  // get id of the todo item we are trying to prioritize
  var id = move_select.parentNode.childNodes[1].getAttribute('id');

  // determine if the todo item is crossed out or not
  var crossed = true;
  if (list_item.style.textDecoration !== 'line-through') {
    crossed = false;
  }
  // determine if the todo item is bold (already prioritized) or not
  var prioritized = true;
  if (list_item.style.fontWeight !== 'bold') {
    prioritized = false;
  }
  // regular todo item
  if ((crossed == false) && (prioritized == false)) {
    console.log("regular todo");
    chrome.storage.sync.get([idx.toString()], function(result) {
      
      dict = JSON.parse(result[idx]);

      var todos = dict['todo'];
      console.log(todos);

      var removed_item = todos.splice(id, 1);
      console.log(removed_item);

      console.log("Currently in todos: " + todos);

      dict['todo'] = todos;
      storeSync(idx,dict);

      // add removed item to the priority list
      var priority_list = dict['priority'];

      if (priority_list == undefined) {
        dict['priority'] = [removed_item];
      }
      else {
        priority_list.push(removed_item);
      }
      storeSync(idx,dict);
      console.log(dict);
      show(idx);
    });
  }
  // if prioritizing an item that was crossed off
  else if (crossed == true) {
    console.log("crossed out");
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
      var priority_list = dict['priority'];
      var task = removed_item[0];

      // if there is an actual list
      if (priority_list !== null) {

        // add the new task to the list of priorities for that note
        if (priority_list[priority_list.length - 1] != task) {
            priority_list.push(task);
        }
      }
      else {
        priority_list = [task];
      }
      storeSync(idx,dict)
      show(idx);
    });
  }
  // if un-prioritizing an item
  else if (prioritized == true) {
    console.log("unprioritizing");
    chrome.storage.sync.get([idx.toString()], function(result) {

      dict = JSON.parse(result[idx]);

      // first remove the item from the priority list
      var priority_list = dict['priority'];
      var removed_item = priority_list.splice(id, 1);
      dict['priority'] = priority_list;
      storeSync(idx,dict)

      // add removed item back to the todos list
      // get the current list of todos for that note
      var todos = dict['todo'];
      var task = removed_item[0];
      
      function flatten(arr) {
        let flatArray = [];
        function pushLoop(a) {
          let len = a.length;
          for (i=0; i < len; i++) {
            if (a[i] && a[i].constructor == Array) {
              pushLoop(a[i]);
            } else {
              flatArray.push(a[i]);
            }
          }
        }
        pushLoop(arr);
        return flatArray;
      }
      task = flatten(removed_item);
      if(Array.isArray(task) == true) { task = task[0]; }
      
      // if there is an actual list
      if (todos !== null) {
        // add the new task to the list of todos for that note
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


// ***********************************************************************************************
// removes an item from a todo list
// ***********************************************************************************************
function remove() {

  var elm = getElm();

  // get the parent div element
  var parent = elm.parentNode.parentNode.parentNode;
  // get the index of div element
  idx = getIdx(parent);

  var id = elm.getAttribute('id');

  chrome.storage.sync.get([idx.toString()], function(result) {

    dict = JSON.parse(result[idx]);
    var todos = dict['todo'];
    var crossed = dict['strikethrough'];
    var priority_list = dict['priority'];
    var list_item = elm.parentNode.childNodes[3];

    // determine if the todo item is crossed out, priority, or regular
    if (list_item.style.textDecoration == 'line-through') {
      var removed = crossed.splice(id, 1);
      dict['strikethrough'] = crossed;
    }
    else if (list_item.style.fontWeight == 'bold') {
      var removed = priority_list.splice(id, 1);
      dict['priority'] = priority_list;
    }
    else {
      var removed = todos.splice(id, 1);
      dict['todo'] = todos;
    }
    dict['removed'] = removed;
    storeSync(idx,dict);
    show(idx);
  });
}


// ***********************************************************************************************
// moves an item up the list
// ***********************************************************************************************
function moveItem(move_select, direction) {

  var parent = move_select.parentNode.parentNode.parentNode;
  idx = getIdx(parent);

  var isCrossed = false;

  if (move_select.style.textDecoration == 'line-through') {
    isCrossed = true;
  }
  console.log(move_select);
  var move_item = move_select.innerHTML;

  chrome.storage.sync.get([idx.toString()], function(result) {
    dict = JSON.parse(result[idx]);

    var todos = dict['todo'];
    if (move_select.style.fontWeight == 'bold') {
      todos = [].concat.apply([], dict['priority']);
    }
    console.log(todos);

    // define if we are working with crossed out items or not
    if (isCrossed == true) {
      todos = [].concat.apply([], dict['strikethrough']);
    }

    // get the note index of the selected list item
    note_idx = todos.indexOf(move_item);
    console.log(move_select.innerHTML);
    console.log(move_item);
    console.log(note_idx);

    if (direction == "down") {
      new_idx = note_idx + 1;
      if (new_idx >= todos.length) { return; }
    }
    else {
      new_idx = note_idx - 1;
      if (new_idx < 0) { return; }
    }
    console.log(new_idx);

    // moves the item to the new index
    function arraymove(arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    }

    console.log(todos);
    arraymove(todos, note_idx, new_idx);
    console.log(todos);
    if (isCrossed == true) {
      dict['strikethrough'] = todos;
    }
    else if (move_select.style.fontWeight == 'bold'){
      dict['priority'] = todos;
    }
    else {
      dict['todo'] = todos;
    }
    storeSync(idx,dict);
    show(idx);
  });
}


// ***********************************************************************************************
// allows a list item to be edited
// ***********************************************************************************************
var og_note;
function editNote() {
  elm = getElm();
  var pending = document.querySelector("#pending");
  pending.textContent = "edit pending save. click save icon to sync changes.";
  pending.style.opacity = "1";
  og_note = elm.textContent; // original note content
  console.log(og_note);
  
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


// ***********************************************************************************************
// saves an edit on a todo list item
// ***********************************************************************************************
function saveEdit() {
    var pending = document.querySelector("#pending");
    spanList = document.querySelectorAll(".span");
    shown_save_count = 0;
    
    console.log(og_note);
    elm = getElm(); // get the save button
    console.log(elm.parentNode.childNodes);
    var list_item = elm.parentNode.childNodes[3];
    var task = list_item.textContent; // get the text of the edited note
    var parent = elm.parentNode.parentNode.parentNode; // get the index of div element
    idx = getIdx(parent);

    chrome.storage.sync.get([idx.toString()], function(result) {
      console.log(result);
      console.log(result[idx]);
      dict = JSON.parse(result[idx]);

      // prioritized todo item
      if (list_item.style.fontWeight == 'bold') {
        console.log("bold is true");
        // get the current list of todos for that note
        todos = dict['priority'];
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
        dict['priority'] = todos;
      }

      // crossed out todo item
      else if (list_item.style.textDecoration == 'line-through') {
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
      }

      // regular todo item
      else {
        console.log("regular todo");
        // get the current list of todos for that note
        todos = dict['todo'];
        note_idx = todos.indexOf(og_note);
        todos[note_idx] = task; // set the old note to the edited note
        dict['todo'] = todos;
        
      }
      storeSync(idx,dict);
      save_button = elm.parentNode.childNodes[2];
      save_button.style.display = "none";
      pending.textContent = "edit saved.";
      fade(pending);
      list_item.blur();
    });
}





// *****************************************************************************************************************
// *****************************************************************************************************************
// PART IX. HELPER FUNCTIONS
// *****************************************************************************************************************
// *****************************************************************************************************************

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

// gets an element
function getElm(e) {
  e = e || window.event;
  e = e.target || e.srcElement;
  console.log("Element is: " + e);
  return e;
};

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
  var textEntered, countRemaining, counter;          
  textEntered = elm.parentNode.childNodes[4].value;
  countRemaining = elm.parentNode.childNodes[5]; 
  counter = (600 - (textEntered.length));
  countRemaining.textContent = counter + " characters left";       
}

// returns the index of the note
function getIdx(elm) {
  // if there are more than 10 notes, get last 2 chars
  idx = elm.id.slice(-2);
  if (isNaN(idx) == true) {
    idx = elm.id.slice(-1);
  }
  return idx;
}

// creates a context menu
function createContextMenu(menu) {
  let menuVisible = false;
  const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
  };
  // sets the position of the menu at mouse click
  const setPosition = ({ top, left }) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu("show");
  };
  // hides the context menu if you click outside it
  window.addEventListener("click", e => {
    if (menuVisible) toggleMenu("hide");
  });
  return setPosition;
}

// assigns either dark or light color modes
function assignColorMode(mode) {

  var sheet = (function() {
    // Create the <style> tag
    var style = document.createElement("style");
    // WebKit hack
    style.appendChild(document.createTextNode(""));
    // Add the <style> element to the page
    document.head.appendChild(style);
    return style.sheet;
  })();

  if (mode == "dark") {
      var dark = true;
      sheet.insertRule("\
      .collapsible, .clear {\
      background-color: #363640;\
      color: #fcd488;\
      }",0);
      sheet.insertRule("\
      .bar {\
      background-color: white;\
      }",0);
      // change the folder header item colors
      sheet.insertRule("\
      .folderHeader {\
      color: #f0efed;\
      }",0);
  }
  else {
    var dark = false;
    sheet.insertRule("\
    .collapsible, .clear {\
     background-color: white;\
     color: gray;\
    }",0);
    // change the menu bar colors
    sheet.insertRule("\
    .bar {\
     background-color: gray;\
    }",0);
    // change the folder header item colors
    sheet.insertRule("\
    .folderHeader {\
     color: gray;\
    }",0);
  }
  return dark;
}