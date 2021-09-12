import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import ChatView from './components/ChatView'
import SettingsView from './components/SettingsView'
import LoginView from './components/LoginView'
import NotifView from './components/NotifView'
import IndividualView from './components/IndividualView'
import FeedbackView from './components/FeedbackView'
import AboutView from './components/AboutView'
import NotFoundComponent from './components/NotFoundComponent'
import store from './store'
import idb from './idb'

Vue.use(Router)

// Set up routing and match routes to components
export default new Router({
  //Hash # mode is default
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Virtual Assistant for Students',
      component: LoginView
    },
    {
      path: '/chat',
      name: 'Chatbot',
      component: ChatView,
      beforeEnter (to, from, next) {
        if (store.state.Token) {
          var dbPromise = idb.open('messages-store')
          dbPromise.then(function(db) {
              var tx = db.transaction('messages', 'readonly');
              var storage = tx.objectStore('messages');
              storage.getAll().then(function(res) {
                  store.commit('messages', res);
                  next()
                })
            });
        } else {
          next('/')
        }
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
      beforeEnter (to, from, next) {
        if (store.state.Token) {
          axios.get('/api/settings/', store.state.config)
              .then(res => {
                // localStorage.setItem('name', res.data.name);
                store.commit('userInfo', {
                  batch: res.data.batch,
                  interests: res.data.interests
                })
                console.log(res)
                next()
              })
              .catch(error => {
                console.log(error)
                next()
              })
        } else {
          next('/')
        }
      }
    },
    {
      path: '/notif',
      name: 'Notifications',
      component: NotifView,
      beforeEnter (to, from, next) {
        if (store.state.Token) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/personal',
      name: 'Personal Messages',
      component: IndividualView,
      beforeEnter (to, from, next) {
        if (store.state.Token) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: FeedbackView,
      beforeEnter (to, from, next) {
        if (store.state.Token) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView
    },
    {
      path: '*',
      name: 'Page Not Found',
      component: NotFoundComponent
    }
  ]
})
