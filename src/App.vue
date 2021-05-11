<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        
        <span class="mdl-layout-title" style="padding-bottom:10px;">{{$route.name}}</span>
        

          <div class="mdl-layout-spacer"></div>
              
              <label v-if="auth" class="mdl-button mdl-js-button mdl-button--icon" style="padding-top:18px;padding-left:18px;padding-bottom:10px;">
                  <router-link v-if="auth" key="personal" to="/personal">
                    <i class="material-icons">message</i>
                  </router-link>
              </label>

              <label v-if="auth" class="mdl-button mdl-js-button mdl-button--icon" style="padding-top:18px;padding-left:18px;padding-bottom:10px;">
                  <router-link v-if="auth" key="notif" to="/notif">
                    <i class="material-icons">notifications</i>
                  </router-link>
              </label>
      </div>
    </header>

    <div class="mdl-layout__drawer">
      <span v-if="!auth" class="mdl-layout-title">VAS</span>
      <span v-if="auth" class="mdl-layout-title">{{name}}</span>
      <span v-if="auth" class="mdl-layout-title">{{rno}}</span>
      <nav class="mdl-navigation">
        <router-link class="mdl-navigation__link" v-if="!auth" key="login" to="/" @click.native="hideMenu">Login</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="chat" to="/chat" @click.native="hideMenu">Chat</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="interest" to="/settings" @click.native="hideMenu">Settings</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="feedback" to="/feedback" @click.native="hideMenu">Feedback</router-link>
        <router-link class="mdl-navigation__link" key="about" to="/about" @click.native="hideMenu" replace>About</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="logout" to="/" @click.native="onLogout" replace>Logout</router-link>
      </nav>
    </div>

    <main class="mdl-layout__content back">
        <div class="page-content">
            <router-view></router-view>
        </div>
    </main>
  </div>

</template>

<script>
//import { EventBus } from './event-bus.js'
require('material-design-lite')
export default {
  name: 'app',
  computed: {
    auth () {
      return this.$store.getters.isAuthenticated
    },
    rno () {
      return this.$store.getters.rno
    },
    name () {
      return this.$store.getters.name
    }
  },
  created () {
    this.$store.dispatch('tryAutoLogin')
    this.$store.dispatch('verifyToken')
  },
  methods: {
    hideMenu: function () {
      document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
      document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
    },
    onLogout() {
      this.$store.dispatch('logout')
      document.getElementsByClassName('mdl-layout__drawer')[0].classList.remove('is-visible')
      document.getElementsByClassName('mdl-layout__obfuscator')[0].classList.remove('is-visible')
    },
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
 @import url('https://code.getmdl.io/1.2.1/material.blue-red.min.css');
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
}

a { color: inherit; }

.back {
  background:white;
  height:100%;
}
.personal {
    padding:7px;
}
header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
