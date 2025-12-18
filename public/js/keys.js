/**
 * Premendo il tasto "space", verrà creato un nuovo thread.
 * @param {*} e 
 */
document.body.addEventListener('keydown', function (e) {
    if (e.code === 'ShiftRight' || e.keyCode === 16) {
        e.preventDefault(); 
        my_modal_3.showModal();
    }
});