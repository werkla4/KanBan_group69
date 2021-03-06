const USER_NAMES = ['Klaus', 'Katja', 'Felicitas'];
const USER_Pic = ['../img/KlausWerner.jpg', '../img/Katja.jpg', '../img/felimock.jpg'];

const RADIO_BUTTON_NAMES = ['rbKlaus', 'rbKatja', 'rbFeli'];

const NAVBAR_TITLES = ['board', 'backlog', 'addTask', 'others']; // , 'help'];
let navbarSizeChanged = true;

/**
 * this is a include function:
 * 
 * please insert this for each webside, and you you have
 * on every side the same layout !
 * 
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
  // check if it is mobile device
  bodySizeIsChanging();
  // update user pic
  updateUserPic();
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
  else {
    // loop all items in navbar
    for (let i = 0; i < NAVBAR_TITLES.length; i++) {
      // show current bar
      if (currentPage == NAVBAR_TITLES[i]) {
        document.getElementById(`${NAVBAR_TITLES[i]}-bar`).classList.remove('opacity-0');
      }
      // dont show other bars
      else {
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
function getTicket() {
  // load JSON
  let ticket = backend.getItem('temp');
  // create JSON file if not exist
  if (ticket == null || ticket['nextTicket'] == null) {
    let temp = { 'nextTicket': 1 };
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

function getReversedNavbarState() {
  let isClosed = document.getElementById(`navbar-container`).classList.contains('navbar-close');

  if (isClosed) {
    return 'show';
  }
  else {
    return 'close';
  }
}

/**
 * 
 */
function showNavbar(state) {
  // if current navbar hae show state -> get reversed state = close
  if (state == 'click') { state = getReversedNavbarState(); }
  // set navbar
  if (state == "close") {
    document.getElementById('content-container').classList.remove('opacity-20'); // show 100% color
    // document.getElementById('arrow-right-navbar').classList.remove('d-none');
    // document.getElementById('arrow-left-navbar').classList.add('d-none');
    document.getElementById('navbar-container').classList.add('navbar-close');
    document.getElementById('navBar-items').classList.add('unclickable');
  }
  if (state == "show") {
    document.getElementById('content-container').classList.add('opacity-20'); // show 20% color
    // document.getElementById('arrow-right-navbar').classList.add('d-none');
    // document.getElementById('arrow-left-navbar').classList.remove('d-none');
    document.getElementById('navbar-container').classList.remove('navbar-close');
    document.getElementById('navBar-items').classList.remove('unclickable');
  }
}

/**
 * show menu logo in mobile device
 */
function showMenuLogo() {
  document.getElementById('menu-logo').classList.remove('d-none');
}

/**
 * if size is changing to large view, hide menu-logo in navbar and fix the navbar
 */
function defaultAttributesLargeDevice() {
  document.getElementById('content-container').classList.remove('opacity-20');
  document.getElementById('menu-logo').classList.add('d-none');
  // document.getElementById('arrow-right-navbar').classList.add('d-none');
  // document.getElementById('arrow-left-navbar').classList.add('d-none');
  document.getElementById('navbar-container').classList.remove('navbar-close');
  document.getElementById('navBar-items').classList.remove('unclickable');
}

/**
 * event for controlling the device, mobile or not, 
 */
function bodySizeIsChanging() {
  let width = document.body.clientWidth;
  let height = document.body.clientHeight;
  // set this for first view 
  navbarSizeChanged = true;
  // show nacvbar if width is smaller than 1000px
  if (width <= 1000) {
    showMenuLogo();
    showNavbar('close');

    console.log("mobile--------------------------------------------------");
  }
  // set default attributes
  if (width > 1000) {
    defaultAttributesLargeDevice();

    console.log("large device--------------------------------------------------");
  }
}

function contentContainerInactive() {
  let isInactive = document.getElementById(`content-container`).classList.contains('opacity-20');
  if (isInactive) {
    return true;
  }
  else {
    return false
  }
}

function closeNavbarInMobileDevice() {
  if (contentContainerInactive()) {
    showNavbar('close');
  }
}

/**
 * update img in navbar
 */
function updateUserPic(){
  // get user
  let user = localStorage.getItem('user');
  // first call -> init
  if(user == null){
    user = 'Klaus';    
  }
  // set pic
  let indxForPic = USER_NAMES.indexOf(user);
  document.getElementById('user-picture').src = USER_Pic[indxForPic];
}

/**
 * jump to index.html
 */
function gotToIndexHtml(){
  window.open("../index/index.html", '_self');
}

function radioBtnActivate(rb_Id, user){
    // delete all checked states
    RADIO_BUTTON_NAMES.forEach(id => document.getElementById(id).checked = false);
    // set check
    document.getElementById(rb_Id).checked = true;
    // save in local Storage
    localStorage.setItem('user', user);
}