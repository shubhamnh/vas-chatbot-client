import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'
import idb from './idb'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Token: null,
    rno: null,
    name: null,
    currentClass: null,
    messages: null,
    settings: null,
    config: null,
    notifs: null,
    personal: null,
    dbPromise: null,
  },
  mutations: {
    authUser (state, userData) {
      state.Token = userData.token
      state.config = userData.config
      state.rno = userData.rno
    },
    setName (state, name) {
      state.name = name
    },
    setCurrentClass (state, current_class) {
      state.currentClass = current_class
    },
    userInfo (state, info){
      state.settings = info
    },
    notifs (state, notifs){
      state.notifs = notifs
    },
    personal (state, personal){
      state.personal = personal
    },
    storeUser (state, user) {
      state.user = user
    },
    setConfig (state) {
      state.config = {headers: {'Authorization': 'Bearer '+state.Token}}
    },
    clearAuthData (state) {
      state.Token = null
      state.rno = null
      state.config = null
      state.name = null
      state.currentClass = null
    },
    setBotMessage (state, messagedata) {
      console.log(messagedata)
      state.messages.push({'text': messagedata.message, 'time': messagedata.time, 'who': messagedata.who,})
    },
    messages (state, messages) {
      state.messages = messages
    },
    dbPromise (state, promise) {
      state.dbPromise = promise
    }
  },
  //commit for mutations, dispatch for actions
  actions: {
    setLogoutTimer ({commit}, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData')
      }, expirationTime * 1000)
    },
    tryAutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      commit('authUser', {
        token: token,
        rno: localStorage.getItem('rno')
      })
      commit('setName', localStorage.getItem('name'))
      commit('setCurrentClass', localStorage.getItem('currentClass'))
      commit('setConfig')
      router.replace('/chat')
    },
    logout ({commit}) {
      commit('clearAuthData');
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      
      var dbPromise = idb.open('messages-store')
      dbPromise
        .then(function(db) {
          var tx = db.transaction('messages', 'readwrite');
          var storage = tx.objectStore('messages');
          storage.clear();
          return tx.complete;
        })
    },
    verifyToken ({commit, state}) {
      axios.post('/api/token-verify/', {
        token: state.Token
      })
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })

    },
    getNotifs ({commit, state}) {
      axios.get('/api/groupnotif/', state.config)
          .then(res => {
            commit('notifs', res.data)
            console.log(res)
          })
          .catch(error => {
            console.log(error)
          })
    },
    getPersonal ({commit, state}) {
      axios.get('/api/individualnotif/', state.config)
          .then(res => {
            commit('personal', res.data)
            console.log(res)
          })
          .catch(error => {
            console.log(error)
          })
    },
    setMessages ({commit}, messages) {
      commit('messages', messages)
    }
    // updateInterests ({commit, state}, interests) {
    //
    // }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.Token !== null
    },
    messages (state) {
      return state.messages
    },
    settings (state) {
      return state.settings
    },
    rno (state) {
      return state.rno
    },
    name (state) {
      return state.name
    },
    currentClass (state) {
      return state.currentClass
    },
    notifs (state) {
      return state.notifs
    },
    personal (state) {
      return state.personal
    },
    config (state) {
      return state.config
    },
    dbPromise (state) {
      return state.dbPromise
    }
  }
})
