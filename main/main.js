const NAVBAR_TITLES = ['board', 'backlog', 'addTask', 'help'];
/**
 * this is a include function:
 * 
 * please insert this for each webside, and you you have
 * on every side the same layout !
 * 
 * @returns 
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

/**
 * - Importand initialisation the main layout!
 */
async function main_init() {
  console.log('main_init');
  // importand for navBar, and layout
  includeHTML();
  // init backend
  backend_init();
  // set selected item-bar in navBar
  updateLeftBarInNavBar();
}

/**
 * with backend_init, we can save data on the webside per json file,
 * it works similar as a localStorage API (setItem, delItem, getItem)
 */
async function backend_init() {
  // set Url for including smallest backend
  setURL('http://gruppe-69.developerakademie.com/KanBan_group69/smallest_backend_ever-master');
  // load memory and wait until to the end
  await downloadFromServer();
}

function setBarLeft(item) {
  console.log("OK____");
  backend.setItem('temp_data', [{ 'currentPage': item }]);
  console.log("OK");
}

function updateLeftBarInNavBar() {
  let currentPage = localStorage.getItem('currentPage');
  if (currentPage == null) {
    console.log("set currentPage index");
    localStorage.setItem('currentPage', 'index');
  }

  console.log("a");
  console.log(document);
  console.log(document.getElementById('board-bar'));
}