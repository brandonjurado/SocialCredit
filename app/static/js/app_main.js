/****
Sorry can't separate components into different files because of
web development complexities (aka javascript nonesense)
****/

// Name form - A component for having users tell
// the app their name.
Vue.component('name-form', {
   template:
    `<div class='fullscreen name-form'></div>`
});

// Contains about button too.
Vue.component('social-media-bar', {
  template:
  `
  <nav class="social-media-bar navbar navbar-light bg-light">
    <a class="credio-icon navbar-brand" href="#">
      <img src="/img/credio.svg" width="30" height="30" class="d-inline-block align-top" alt="">Credio
    </a>
    <!-- nav elements -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Disabled</a>
        </li>
      </ul>
    </div>
  </nav>
  `
});

// Contains top level div
Vue.component('top-level', {
  template:
  `<social-media-bar></social-media-bar>
  <button v-click='calculate'>Calc</button>
  `
});

// Entry point of vue app
var app = new Vue({
  el: '#app',
  data: {
    showNameForm: false,
    user: {
        fullname:    '',
        lastname:    '',
        twitterUrl:  '',
        facebookUrl: '',
    },
    results:{}
  },
  methods: {
    calculate: function() {

    }
  }
});
