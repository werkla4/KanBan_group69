/**
 * update user radio buttons
 * set local storage for navbar bar left
 */
function init_index() {
    // update radio buttons
    updateRadioButtons();
    // set local storage to index.html
    localStorage.setItem('currentPage', 'index');
}

/**
 * update user radio buttons
 */
function updateRadioButtons() {
    // get user
    let user = localStorage.getItem('user');
    // get pic indx
    let indxForPic = USER_NAMES.indexOf(user);
    // first call, init pic is klaus
    if(indxForPic == -1){ indxForPic = 0; }
    // delete all checked states
    RADIO_BUTTON_NAMES.forEach(id => document.getElementById(id).checked = false);
    // set check
    document.getElementById(RADIO_BUTTON_NAMES[indxForPic]).checked = true;
}