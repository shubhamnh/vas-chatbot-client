<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        
        <span class="mdl-layout-title">{{$route.name}}</span>
        
        <div class="mdl-layout-spacer"></div>

        <nav>
          <router-link v-if="auth" key="personal" to="/personal">
            <label class="mdl-button mdl-js-button mdl-button--icon">
              <i class="material-icons">message</i>
            </label>
          </router-link>
          <router-link v-if="auth" key="notif" to="/notifications">
            <label class="mdl-button mdl-js-button mdl-button--icon">
              <i class="material-icons">notifications</i>
            </label>
          </router-link>
        </nav>
      </div>
    </header>

    <div class="mdl-layout__drawer">
      <span v-if="!auth" class="mdl-layout-title">VAS</span>
      <span v-if="auth" class="mdl-layout-title" >{{name}}</span>
      <span v-if="auth" class="mdl-layout-title" style="font-size:1rem">{{currentClass}}</span>
      <span v-if="auth" class="mdl-layout-title" style="font-size:1rem">{{rno}}</span>
      <nav class="mdl-navigation">
        <router-link class="mdl-navigation__link" v-if="!auth" key="login" to="/" @click.native="hideMenu">Login</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="chat" to="/chat" @click.native="hideMenu">Chat</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="interest" to="/settings" @click.native="hideMenu">Settings</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="feedback" to="/feedback" @click.native="hideMenu">Feedback</router-link>
        <router-link class="mdl-navigation__link" key="about" to="/about" @click.native="hideMenu" replace>About</router-link>
        <router-link class="mdl-navigation__link" v-if="auth" key="logout" to="/" @click.native="onLogout" replace>Logout</router-link>
      </nav>
    </div>

    <main class="mdl-layout__content">
        <router-view></router-view>
    </main>
  </div>

</template>

<script>
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
    },
    currentClass () {
      return this.$store.getters.currentClass
    }
  },
  created () {
    this.$store.dispatch('tryAutoLogin')
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

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

a { color: inherit; }

</style>
