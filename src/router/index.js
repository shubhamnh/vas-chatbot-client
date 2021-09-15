import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import Chat from '../pages/Chat'
import Settings from '../pages/Settings'
import Login from '../pages/Login'
import GroupNotification from '../pages/GroupNotification'
import PersonalNotification from '../pages/PersonalNotification'
import Feedback from '../pages/Feedback'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import store from '../store'
import { dbPromise, readAllData } from '../helpers/utility'

Vue.use(Router)

// Set up routing and match routes to components
export default new Router({
  //Hash # mode is default
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Virtual Assistant for Students',
      component: Login
    },
    {
      path: '/chat',
      name: 'Chatbot',
      component: Chat,
      beforeEnter (to, from, next) {
        if (store.state.Token) {
          readAllData(dbPromise, 'messages').then( messages => {
            store.commit('setMessages', messages)
            next()
          }).catch(err => {
            console.log(err)
          })
          // next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
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
      path: '/notifications',
      name: 'Notifications',
      component: GroupNotification,
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
      component: PersonalNotification,
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
      component: Feedback,
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
      component: About
    },
    {
      path: '*',
      name: 'Page Not Found',
      component: NotFound
    }
  ]
})
