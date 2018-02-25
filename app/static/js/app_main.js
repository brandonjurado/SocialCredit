/**************************************************************
Sorry can't separate components into different files because of 
web development complexities (aka javascript nonesense)
**************************************************************/

// Name form - A component for having users tell 
// the app their name.
Vue.component('name-form', {
   template: 
    `<div class='fullscreen name-form'></div>`
});

// Contains about button too.
Vue.component('menu-bar', {
  template:
  ` 
  <div class="menu-bar">
    <div class="banner">
      <a href="#">Credio</a>
    </div>
    <div class="social-media">
      <div class="social-media-wrapper">
        <a class="social-media-btn fb-btn">
          <i class="fa fa-facebook-f"></i>
        </a>
        <a class="social-media-btn tw-btn">
          <i class="fa fa-twitter"></i>
        </a>
        <a class="social-media-btn ab-btn right-align">
          <i class="fa fa-info"></i>
        </a>
      </div>
    </div>
  </div>
  `
});

Vue.component('app-body',{
  template:`
    <div class="app-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <div class="score-progress">
              <div id="circle"></div>
            <div class="score-info">
              <button class='btn btn-large'>Calculate</button>
            </div>
            </div>
          </div>
          <div class="col-md-6">

          </div>
        </div>
      </div>
    </div>
  `,
  props: ['progressValue']
});

// Contains top level div
Vue.component('top-level', {
  template: 
  `<div class="content-wrapper">
     <menu-bar></menu-bar>
     <app-body v-bind:progressValue='60'></app-body>
   </div>
  `
});

// Entry point of vue app
var app = new Vue({
  el: '#app',
  data: {
    showNameForm: false,
    score:0,
    user: {
        fullname:    '',
        lastname:    '',
        twitterUrl:  '',
        facebookUrl: '',
    },
  },
  mounted: function () {
    console.log('mounted... called');
  
    $('#circle').circleProgress({
      value: 0.25,
      size: 400,
      thickness: 70,
    }).on('circle-animation-progress', function(event, v) {
        var obj = $(this).data('circle-progress'),
            ctx = obj.ctx,
            s = obj.size;

        //console.log("progress value: "+v);
        var sv = (v).toFixed();
        var fill = obj.arcFill;

        ctx.save();
        ctx.font = "bold " + s / 3.5 + "px sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = fill;
        ctx.fillText(sv, s / 2, s / 2);
        ctx.restore();
    });
  },
  methods: {
    calculate: function() {

    }
  },
  computed: {
    computedScore: function() {
      return this.score+=1;
    } 
  }
});
