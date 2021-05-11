<template>
  <div>
    <form @submit.prevent="onSubmit">
        <div class="select">
			<label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="placement">
              <input type="checkbox" id="placement" class="mdl-switch__input" v-model="placement">
              <span class="mdl-switch__label">Placement</span>
            </label>
            <br>
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="study">
              <input type="checkbox" id="study" class="mdl-switch__input" v-model="study">
              <span class="mdl-switch__label">Study</span>
            </label>
            <br>
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="creative">
              <input type="checkbox" id="creative" class="mdl-switch__input" v-model="creative">
              <span class="mdl-switch__label">Creative</span>
            </label>
            <br>
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="cultural">
              <input type="checkbox" id="cultural" class="mdl-switch__input" v-model="cultural">
              <span class="mdl-switch__label">Cultural</span>
            </label>
            <br>
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="dance">
              <input type="checkbox" id="dance" class="mdl-switch__input" v-model="dance">
              <span class="mdl-switch__label">Dance</span>
            </label>
            <br>
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="drama">
              <input type="checkbox" id="drama" class="mdl-switch__input" v-model="drama">
              <span class="mdl-switch__label">Drama</span>
            </label>
            <br>
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="sports">
              <input type="checkbox" id="sports" class="mdl-switch__input" v-model="sports">
              <span class="mdl-switch__label">Sports</span>
            </label>
            <br>
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" for="workshop">
              <input type="checkbox" id="workshop" class="mdl-switch__input" v-model="workshop">
              <span class="mdl-switch__label">Workshop</span>
            </label>
            <br>
            
            <mdl-select label="Batch" id="batch-select" v-model="batch" :options="batchesArray"></mdl-select>
        </div>
        <br>
        <button v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" type="submit">Apply Changes</button>
    </form>
      <br><br>
      <button v-mdl v-if="checksw" v-on:click="enablenotif" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored enablenotif">Enable Push Notifications</button>
      <br><br>
      <mdl-snackbar display-on="change"></mdl-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    onSubmit () {
      axios.put('/login/info/'+this.rno+'/', {batch: this.batch, sports : this.sports, creative : this.creative, cultural : this.cultural,
        dance : this.dance, drama : this.drama, placement : this.placement, workshop : this.workshop, study : this.study,}, this.config)
          .then(res => {
            console.log(res)
            this.$root.$emit('change', { message: 'Changes successfully applied!' })
          })
          .catch(error => {
            console.log(error)
            this.$root.$emit('change', { message: 'Changes could not be applied' })
          })
    },
    showdialog () {
      this.$refs.pass.open()
    },
    changepass () {
      axios.put('/login/changepass/'+this.rno+'/', {passw: this.pass}, this.config)
          .then(res => {
            console.log(res)
            this.$refs.pass.close()
            this.pass = null
            this.$root.$emit('change', { message: 'Password changed successfully!' })
          })
          .catch(error => {
            console.log(error)
            this.$refs.pass.close()
            this.$root.$emit('change', { message: 'Password could not be changed' })
          })
    },
    enablenotif () {
      if ('Notification' in window) {
        Notification.requestPermission(function(result) {
          console.log('User Choice', result)
          if (result !== 'granted') {
            console.log('No notification permission granted!')
          } else {
            if ('serviceWorker' in navigator) {
              var options = {
                body: 'You successfully subscribed to our Notification service!',
                icon: '/static/img/icons/android-icon-72x72.png',
                lang: 'en-US',
                vibrate: [100, 50, 200],
                badge: '/static/img/icons/android-icon-72x72.png',
                tag: 'confirm-notification',
                renotify: true,
                actions: [
                  {action: 'confirm', title: 'Okay', icon: '/static/img/icons/android-icon-72x72.png'},
                  {action: 'cancel', title: 'Cancel', icon: '/static/img/icons/android-icon-72x72.png'}
                ]
              }

              navigator.serviceWorker.ready
                  .then(function (swreg) {
                    swreg.showNotification('Successfully subscribed!', options);
                  })
            }

          }
         })
         this.configurePushSub()
      }
     },
    checksw () {
      if (('serviceWorker' in navigator) && ('Notification' in window))
        return true
      else
        return false
    },
    configurePushSub () {
      if (!('serviceWorker' in navigator)) {
        return;
      }
      var browser = this.loadVersionBrowser(navigator.userAgent);
      var padding = '='.repeat((4 - this.applicationServerKey.length % 4) % 4)
      var base64 = (this.applicationServerKey + padding)
              .replace(/\-/g, '+')
              .replace(/_/g, '/')
      var rawData = window.atob(base64)
      var outputArray = new Uint8Array(rawData.length)
      var rno = this.rno, config = this.config
      for (var i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i)
      }
      navigator.serviceWorker.ready.then(function (reg) {
        reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: outputArray
                
        }).then(function (sub) {
                var endpointParts = sub.endpoint.split('/');
                var registration_id = endpointParts[endpointParts.length - 1];
                var data = {
                        'browser': browser.name.toUpperCase(),
                        'p256dh': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
                        'auth': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))),
                        'name': rno,
                        'registration_id': registration_id
                };
                axios.post('/login/device/wpd/', data, config)
                  .then(res => {
                    console.log(res)
                  })
                  .catch(error => {
                    console.log(error)
                  });
          })
        }).catch(function (err) {
                console.log(':^(', err);
        });
    },
    loadVersionBrowser (userAgent) {
            console.log(userAgent)
            var ua = userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return {name: 'IE', version: (tem[1] || '')};
            }
            if (M[1] === 'Chrome') {
                    tem = ua.match(/\bOPR\/(\d+)/);
                    if (tem != null) {
                            return {name: 'Opera', version: tem[1]};
                    }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                    M.splice(1, 1, tem[1]);
            }
            return {
                    name: M[0],
                    version: M[1]
            };
    },
  },
  data () {
    return {
      creative: this.$store.getters.interests.creative,
      sports: this.$store.getters.interests.sports,
      cultural: this.$store.getters.interests.cultural,
      dance: this.$store.getters.interests.dance,
      drama: this.$store.getters.interests.drama,
      placement: this.$store.getters.interests.placement,
      workshop: this.$store.getters.interests.workshop,
	    study: this.$store.getters.interests.study,
      rno: this.$store.getters.rno,
      config: this.$store.getters.config,
      applicationServerKey: process.env.APP_SERVER_KEY,
      change: false,
      pass: null,
      batch: this.$store.getters.interests.batch,
      batchesArray: ['1', '2', '3', '4']
    }
  }
}
</script>

<style scoped>

  .interest{
    margin-right:93px;
    width: 30px;
  }
    .select{
        margin-top:20px;
    }

</style>
