var menuToggle = document.getElementById('menuToggle');
var mobileMenu = document.querySelector(".header__navigation");

if (menuToggle.classList.contains('header__toggle--no-js')) {
  menuToggle.classList.remove('header__toggle--no-js');
  mobileMenu.classList.remove('header__navigation--open');
  menuToggle.classList.remove('header__toggle--open');
  menuToggle.classList.add('header__toggle--closed');
  menuToggle.addEventListener('click', function (e) {
    e.preventDefault;
    menuToggle.classList.remove('header__toggle--no-animation');
    menuToggle.classList.toggle('header__toggle--open');
    menuToggle.classList.toggle('header__toggle--closed');
    mobileMenu.classList.toggle('header__navigation--open');
  });
};

var linkNav = document.querySelectorAll('[href^="#"]'), V = 0.25;

for (var i = 0; i < linkNav.length; i++) {
  linkNav[i].addEventListener('click', function (e) {
      e.preventDefault();
      var w = window.pageYOffset,
        hash = this.href.replace(/[^#]*(.*)/, '$1');
      t = document.querySelector(hash).getBoundingClientRect().top,
        start = null;
      requestAnimationFrame(step);
      function step(time) {
        if (start === null) start = time;
        var progress = time - start,
          r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));
        window.scrollTo(0,r);
        if (r != w + t) {
          requestAnimationFrame(step)
        } else {
          location.hash = hash
        }
      }
    }, false);
};

var mockups = document.querySelectorAll('.portfolio-item__mockup');

[].forEach.call(mockups, function (mockup) {
  var mockupButtons = mockup.querySelectorAll('.portfolio-item__button');
  var mockupImage = mockup.querySelector('.portfolio-item__mockup-imageset');

  [].forEach.call(mockupButtons, function (button) {
    button.addEventListener('focus', function (e) {
      mockupImage.classList.add('portfolio-item__mockup-imageset--focused');
    });
  });

  [].forEach.call(mockupButtons, function (button) {
    button.addEventListener('blur', function (e) {
      mockupImage.classList.remove('portfolio-item__mockup-imageset--focused');
    });
  });
});
