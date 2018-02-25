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
        <a class="social-media-btn fb-btn" v-on:click="fbLogin">
          <i class="fa fa-facebook-f"></i>
        </a>
        <a class="social-media-btn tw-btn" v-on:click="tbLogin">
          <i class="fa fa-twitter"></i>
        </a>
        <a class="social-media-btn ab-btn right-align">
          <i class="fa fa-info"></i>
        </a>
      </div>
    </div>
  </div>
  `,
  methods: {
    fbLogin: function() {
      this.$emit('fbloginevent');
      console.log('doing fb login. Event emiited...');
    },
    tbLogin: function() {
      this.$emit('tbloginevent');
      console.log('doing tb login. Event emiited...');  
    }
  }
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
              <button v-on:click="calculate" class='btn btn-large'>Calculate</button>
            </div>
            </div>
          </div>
          <div class="col-md-6">

          </div>
        </div>
      </div>
    </div>
  `,
  props: ['progressValue'],
  methods:
  {
    calculate: function() {
      this.$emit('calculateevent');
      console.log('calculating socre...');
    }
  }
});

// Contains top level div
Vue.component('top-level', {
  template: 
  `<div class="content-wrapper">
     <menu-bar v-on:fbloginevent="doFbLogin" 
               v-on:tbloginevent="doTbLogin"
               v-on:calculateevent="doCalculate">
     </menu-bar>
     <app-body v-bind:progressValue='60'></app-body>
   </div>
  `,
  methods: {
    doFbLogin: function() {
      this.$emit('dofbloginevent');
      console.log('doFbLogin emmitted');
    },
    doCalculate: function() {
      this.$emit('docalculateevent');
      console.log('doCalculate emmitted');
    },
    doTbLogin: function() {
      this.$emit('dotbloginevent');
      console.log('doTbLogin emitted');
    }
  }
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
    results:{}
  },
  mounted: function () {
    console.log('mounted... called');
  
    $('#circle').circleProgress({
      value: 0.5,
      size: 400,
      thickness: 70,
    }).on('circle-animation-progress', function(event, v) {
        var obj = $(this).data('circle-progress'),
            ctx = obj.ctx,
            s = obj.size;

        //console.log("progress value: "+v);
        var sv = ( v * 100);
        console.log("SV: " +  sv);
        var fill = obj.arcFill;

        ctx.save();
        ctx.font = "bold " + s / 3.5 + "px sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = fill;
        ctx.fillText(sv, s / 2, s / 2);
        ctx.restore();
    });

    this.$nextTick(function(){
      console.log('logging in to facebook');
      this.loadFacebookApi();
    });
  },
  methods: {
    calculate: function() {
      axios.post('/get_score')
            .then((resp) => {
              //this.score = resp;
              console.log(resp);
            })
           .catch(function(err){console.log(err);})
    },

    /// Prelude for facebook api.
    /// Handles Loading of face book api.
    loadFacebookApi: function() {
      FB.init({
        appId      : '197420487525406',
        status     : true,
        xfbml      : true,
        version    : 'v2.7' // or v2.6, v2.5, v2.4, v2.3
      });
       
      // Load the SDK asynchronously
      (function(d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
      }(document));

      var status = FB.getLoginStatus();
      console.log('facebook login status: '+status);
    },

    /// Handles facebook logins for user.
    facebookLoginHandler: function() {
      console.log("Real fb login running...");
      FB.login(function(response) {

      // handle the response
      FB.api('/1695668353825295', function(response) {
        console.log(response);
      });

      }, {scope: 'read_stream,publish_stream,publish_actions,read_friendlists'});            
    },

    twitterLoginHandler: function() {
      //axios.post('/twitter', {headers: {'Access-Control-Allow-Origin': '*'},})
       //     .then(function(resp){console.log(resp);})
        //   .catch(function(err){console.log(err);})
        window.location = '/twitter';
    },


  },
  computed: {
    computedScore: function() {
      return this.score+=1;
    } 
  }
});
