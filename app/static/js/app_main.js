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
      <a href="#" class="banner-logo"><img src='/static/img/social_credit.png' height="100"></a>
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
          <div class="col-md-7 left">
            <div class="score-progress">
              <div id="circle"></div>
            <div class="score-info">
              <button v-on:click="calculate" class='btn btn-large'>Calculate</button>
            </div>
            </div>
          </div>
          <div class="col-md-5">
            <div class="slanted">
              <traits-pane v-bind:data="data"></traits-pane>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: ['data','progressValue'],
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
               v-on:tbloginevent="doTbLogin">
     </menu-bar>
     <app-body v-bind:progressValue='60'
               v-bind:data='data'
               v-on:calculateevent="doCalculate">
     </app-body>
   </div>
  `,
  props: ['data'],
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


Vue.component('traits-pane', {
  props:['data', 'bars', 'traits'],
  template:`
    <div class="traits-pane">
      <ul>
        <li class="trait">
          <p>Cautiousness. Lvl</p>
          <div class="prog-wrapper">
            <div class="prog" id="progress-container-1"></div>
            <div class="trait-value">{{ Math.floor(data.c * 100) }}<b> %</b></div>
          </div>
        </li>
        <li class="trait">
          <p>Trust. Lvl</p>
          <div class="prog-wrapper">
            <div class="prog" id="progress-container-2"></div>
            <div class="trait-value">{{ Math.floor(data.t * 100) }}<b> %</b></div>
          </div>
        </li>
        <li class="trait">
          <p>Activity. Lvl</p>
          <div class="prog-wrapper">
            <div class="prog" id="progress-container-3"></div>
            <div class="trait-value">{{ Math.floor(data.a * 100) }}<b> %</b></div>
          </div>
        </li>
      </ul>
      <div class="acknowledgements"></div>
    </div>
  `
});

// Entry point of vue app
var app = new Vue({
  el: '#app',
  data: {
    showNameForm: false,
    data:{
      s:0,
      c: 0,
      a:0,
      t:0
    },
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
    var self = this;
    console.log(this);
    let sc = this.data['s'];
    //sc = parseFloat(sc);
    console.log('Sc is parsed to float: ', typeof(sc), sc);

        var style = {
          strokeWidth: 10.5,
          easing: 'easeInOut',
          duration: 1400,
          color: '#444',
          trailColor: '#999',
          trailWidth: 10.5,
        }
      var bar1 = new ProgressBar.Line('#progress-container-1', style);
      var bar2 = new ProgressBar.Line('#progress-container-2', style);
      var bar3 = new ProgressBar.Line('#progress-container-3', style);

    $('#circle').circleProgress({
      value: parseFloat(sc),
      size: 400,
      thickness: 70,
    }).on('circle-animation-progress', function(event, v) {
        console.log('Type of sc 3: ', typeof(sc));
        sc = self.data['s']

        console.log('After: ', typeof(sc), ' sc: ', sc)
        var obj = $(this).data('circle-progress'),
            ctx = obj.ctx,
            s = obj.size;

        bar1.animate(self.data['c']);
        bar2.animate(self.data['t']);
        bar3.animate(self.data['a']);

        //console.log("progress value: "+v);
        var sv = Math.floor(sc * v * 100);
        console.log("SV: " +  sv);
        var fill = obj.arcFill;

        ctx.save();
        ctx.font = "bold " + s / 4.5 + "px sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = fill;
        ctx.fillText(sv + "%", s / 2, s / 2);
        ctx.restore();

    });

    bar1.animate(this.data['c']);
    bar2.animate(this.data['t']);
    bar3.animate(this.data['a']);

    this.$nextTick(function(){
      console.log('logging in to facebook');
      this.loadFacebookApi();
    });
  },
  methods: {
    animateProgressBar: function() {
      console.log("animate handler called");
    },
    calculate: function() {
      axios.get('/get_score')
            .then((resp) => {
              this.data = resp.data;
              console.log('This at load '+this.data);
              var s = resp.data['s'];
              console.log(s + ' ' + typeof(s));
              console.log(resp.data);
              $('#circle').circleProgress('value', parseFloat(s));
            })
           .catch(function(err){console.log(err);});
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
