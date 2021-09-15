<template>
  <div>
    <div style="padding:1.5rem 0rem">
      <p>You'll receive notifications based on your interests selected here.</p>
    </div>
    <form @submit.prevent="onSubmit">
        <div class="select">
          <div v-for="interest in interests" :key="interest.interest_id">
            <label v-mdl class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-cell interest" :for="interest.name">
              <input type="checkbox" :id="interest.name" class="mdl-switch__input" v-model="interest.status">
              <span class="mdl-switch__label">{{interest.name}}</span>
            </label>
            <br>
          </div>
            <br>
            <mdl-select label="Batch" id="batch-select" v-model="batch" :options="batchesArray"></mdl-select>
        </div>
        <br>
        <button v-mdl class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" type="submit">Apply Changes</button>
    </form>
      <br><br>
      <button v-mdl v-if="checksw" @click="enableNotif" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored enablenotif">Enable Push Notifications</button>
      <br><br>
      <mdl-snackbar display-on="change"></mdl-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Settings",
  methods: {
    onSubmit () {
      axios.put('/api/settings/', {batch: this.batch, interests : this.interests}, this.config)
          .then(res => {
            console.log(res)
            this.$root.$emit('change', { message: 'Changes successfully applied!' })
          })
          .catch(error => {
            console.log(error)
            this.$root.$emit('change', { message: 'Changes could not be applied' })
          })
    },
    // changepass () {
    //   axios.put('/api/changepass/'+this.rno+'/', {passw: this.pass}, this.config)
    //       .then(res => {
    //         console.log(res)
    //         this.$refs.pass.close()
    //         this.pass = null
    //         this.$root.$emit('change', { message: 'Password changed successfully!' })
    //       })
    //       .catch(error => {
    //         console.log(error)
    //         this.$refs.pass.close()
    //         this.$root.$emit('change', { message: 'Password could not be changed' })
    //       })
    // },
    enableNotif () {
      if ('Notification' in window) {
        Notification.requestPermission( result => {
          console.log('User Choice', result)
          if (result !== 'granted') {
            console.log('No notification permission granted!')
          } else {
            if ('serviceWorker' in navigator) {
              let options = {
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
      let browser = this.loadVersionBrowser(navigator.userAgent);
      let padding = '='.repeat((4 - this.applicationServerKey.length % 4) % 4)
      let base64 = (this.applicationServerKey + padding)
              .replace(/\-/g, '+')
              .replace(/_/g, '/')
      let rawData = window.atob(base64)
      let outputArray = new Uint8Array(rawData.length)
      let rno = this.rno, config = this.config
      for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i)
      }
      navigator.serviceWorker.ready.then(function (reg) {
        reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: outputArray
                
        }).then(function (sub) {
                let endpointParts = sub.endpoint.split('/');
                let registration_id = endpointParts[endpointParts.length - 1];
                let data = {
                        'browser': browser.name.toUpperCase(),
                        'p256dh': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
                        'auth': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))),
                        'name': rno,
                        'registration_id': registration_id
                };
                axios.post('/api/device/wpd/', data, config)
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
      let ua = userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
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
      interests : this.$store.getters.settings.interests,
      rno: this.$store.getters.rno,
      config: this.$store.getters.config,
      applicationServerKey: process.env.APP_SERVER_KEY,
      change: false,
      pass: null,
      batch: this.$store.getters.settings.batch,
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
</style>
