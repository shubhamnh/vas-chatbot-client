<template>
  <div class="container login">
    <br><br><br>

    <img src="../assets/logo.png" style="width:200px">

    <br><br>

    <form @submit.prevent="onSubmit">

      <div
        class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input v-model="rollnum"
          class="mdl-textfield__input" type="text"
          id="rollnum">
        <label class="mdl-textfield__label"
          for="rollnum">Roll Number</label>
        <span class="mdl-textfield__error">Please check your
          roll number again!</span>
      </div>

      <br>

      <div
        class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input v-model="password"
          class="mdl-textfield__input" type="password"
          id="password">
        <label class="mdl-textfield__label"
          for="password">Password</label>
      </div>

      <br>

      <button
        class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
        type="submit">Sign In</button>

    </form>

    <br><br><br>

    <p><strong>Test Creds</strong></p>
    <p>Roll No: {{ testId }}</p>
    <p>Pass: {{ testPass }}</p>

    <mdl-snackbar display-on="anyerror"></mdl-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import { dbPromise, writeData, clearAllData } from '../helpers/utility'
import { startMessages } from '../startMessages'

export default {
  name: "Login",
  methods: {
    onSubmit() {
      this.rollnum = this.rollnum.toUpperCase()
      const formData = {
        username: this.rollnum,
        password: this.password,
      }
      console.log(formData)

      clearAllData(this.dbPromise, 'messages')

      axios.post('/api/token-auth/', {
          username: this.rollnum,
          password: this.password
        }).then(res => {
          console.log(res)

          localStorage.setItem('token', res.data.access)
          localStorage.setItem('rno', this.rollnum)
          this.$store.commit('authUser', {
            token: res.data.access,
            config: {
              headers: {
                'Authorization': 'Bearer ' + res.data.access
              }
            },
            rno: this.rollnum
          })

          axios.get('/api/profile/', {
              headers: {
                'Authorization': 'Bearer ' + res.data.access
              }
            })
            .then(resp => {
              localStorage.setItem('name', resp.data.name);
              localStorage.setItem('currentClass', resp.data.current_class);
              this.$store.commit('setName', resp.data.name)
              this.$store.commit('setCurrentClass', resp.data.current_class)
              console.log(resp)
            })
            .catch(error => {
              console.log(error)
            })

          this.startMessages.forEach(async (message, i) => {
            await writeData(this.dbPromise, 'messages', message, i+1)
            this.messages.push(message)
          });
          router.replace('/chat');
        }).catch(error => {
          console.log(error)
          if (error.response.status === 400)
            this.$root.$emit('anyerror', {
              message: 'Incorrect Roll Number or Password!'
            })
          else if (error.response.status === 500)
            this.$root.$emit('anyerror', {
              message: 'Server Error'
            })
          else
            this.$root.$emit('anyerror', {
              message: 'Could not login'
            })
          console.log(error)
        })
    },
  },
  data () {
    return {
      rollnum: '',
      password: '',
      testId: process.env.VUE_APP_TEST_ID,
      testPass: process.env.VUE_APP_TEST_PASS,
      startMessages: startMessages,
      messages: this.$store.getters.messages,
      dbPromise: dbPromise
    }
  }
}

MaterialTextfield.prototype.checkValidity = function () {
    if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
        if (this.element_.getElementsByTagName('input')[0].value.length > 0) {
              this.element_.classList.add(this.CssClasses_.IS_INVALID);
        }
    }
};
</script>

<style scoped>
  body{
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #303F9F;
  }
</style>
