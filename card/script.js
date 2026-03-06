(function () {
  'use strict';
  var card = document.querySelector('.card');
  var flipBtns = document.querySelectorAll('.flip-btn');
  if (!card) return;
  function toggleFlip() {
    card.classList.toggle('flipped');
  }
  flipBtns.forEach(function (btn) {
    btn.addEventListener('click', toggleFlip);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && card.classList.contains('flipped')) {
      card.classList.remove('flipped');
    }
  });
})();
