if ( 'querySelector' in document && 'addEventListener' in window ) {
  var menuBtn = document.getElementsByClassName('menu-btn')[0];
  var navigation = document.getElementsByClassName('navigation')[0];
  menuBtn.addEventListener('click', function(e) {
    menuBtn.classList.toggle('open');
    navigation.classList.toggle('open');
  }, false);
}
