let current_drag_elm_id;

function allowDrop(ev) {
    console.log("allowDrop");
    ev.preventDefault();
  }
  
  function drag(ev) {
    console.log("drag");
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    console.log("drop");
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }