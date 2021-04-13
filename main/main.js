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
  await backend_init();
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

/**
 * set currentPage in local store
 * 
 * @param {string} item -> name from next page you want to visit 
 */
function setBarLeft(item) {
  localStorage.setItem('currentPage', item);
}

/**
 * - load from localStorage: currentPage
 * - update bar on left side, display on / off
 */
function updateLeftBarInNavBar() {
  // load current page
  let currentPage = localStorage.getItem('currentPage');
  // current page is unset - first load of this webside -> index.html
  if (currentPage == null) {
    localStorage.setItem('currentPage', 'index');
  }
  else{
    // loop all items in navbar
    for(let i = 0; i < NAVBAR_TITLES.length; i++){
      // show current bar
      if(currentPage == NAVBAR_TITLES[i]){
        document.getElementById(`${NAVBAR_TITLES[i]}-bar`).classList.remove('opacity-0');
      }
      // dont show other bars
      else{
        document.getElementById(`${NAVBAR_TITLES[i]}-bar`).classList.add('opacity-0');
      }
    }
  }
}

/**
 * 
 * create next unique id, and save it in web-storage
 * 
 * @returns nextTicketNumber
 */
function getTicket(){
  // load JSON
  let ticket = backend.getItem('temp');
  // create JSON file if not exist
  if(ticket == null || ticket['nextTicket'] == null){
    let temp = {'nextTicket': 1};
    backend.setItem('temp', temp);
    return 0;
  }
  // get next ticket
  let nextTicket = ticket['nextTicket'];
  // save next ticket, for next call
  ticket['nextTicket'] = nextTicket + 1;
  // return ticket id
  return nextTicket;
}