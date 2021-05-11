<template>
  <div class="container login">
      <br><br><br>
      <img src="../assets/logo.png" style="width:200px">
      <br><br>
	  <form @submit.prevent="onSubmit">
		  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
			<input v-model="rollnum" class="mdl-textfield__input" type="text" id="rollnum">
			<label class="mdl-textfield__label" for="rollnum">Roll Number</label>
			<span class="mdl-textfield__error">Please check your roll number again!</span>
		  </div>
		  <br>
		  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
			<input v-model="password" class="mdl-textfield__input" type="password" id="password">
			<label class="mdl-textfield__label" for="password">Password</label>
		  </div>
		  <br>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" type="submit">Sign In</button>
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
import idb from '../idb'
import '../utility'
import data from '../data'

export default {
  methods: {
    onSubmit () {
      this.rollnum = this.rollnum.toUpperCase()
      const formData = {
        username: this.rollnum,
        password: this.password,
      }
      console.log(formData)

      this.clearAllData('messages')
      axios.post('/api-token-auth/', {
        rno: this.rollnum,
        password: this.password
      })
        .then(res => {
          console.log(res)
          
          localStorage.setItem('token', res.data.access)
          localStorage.setItem('rno', this.rollnum)
          axios.get('/login/info/'+this.rollnum+'/', {headers: {'Authorization': 'Bearer '+res.data.access}})
              .then(resp => {
                localStorage.setItem('name', resp.data.name);
                this.$store.commit('setName', resp.data.name)
                console.log(resp)
              })
              .catch(error => {
                console.log(error)
              })
          this.$store.commit('authUser', {
            token: res.data.access,
            config: {headers: {'Authorization': 'Bearer '+res.data.access}},
            rno: this.rollnum
          })
          for (var y = 0; y < this.messno; y++) {
            console.log(this.messages[y])
            this.writeData('messages', this.messages[y], y+1).then(function() {
              if (y === 5) {
                router.replace('/chat');
              }
            })
          }
          
        })
        .catch(error => {
            if(error.response.status === 400)
              this.$root.$emit('anyerror', { message: 'Incorrect Roll Number or Password!' })
            else if(error.response.status === 500)
              this.$root.$emit('anyerror', { message: 'Server Error' })
            else
              this.$root.$emit('anyerror', { message: 'Could not login' })
            console.log(error)
        })
    },
    writeData(st, data, i) {
        return this.dbPromise
          .then(function(db) {
            var tx = db.transaction(st, 'readwrite');
            var storage = tx.objectStore(st);
            storage.put(data, i);
            return tx.complete;
        });
    },
    clearAllData(st) {
      return this.dbPromise
        .then(function(db) {
          var tx = db.transaction(st, 'readwrite');
          var storage = tx.objectStore(st);
          storage.clear();
          return tx.complete;
        });
    }
  },
  created() {
    this.$store.commit('dbPromise', this.dbPromise)
  },
  data () {
    return {
      rollnum: '',
      password: '',
      testId: process.env.VUE_APP_TEST_ID,
      testPass: process.env.VUE_APP_TEST_PASS,
      messages: data.messages,
      messno: data.messages.length,
      dbPromise: idb.open('messages-store', 1, function (db) {
            if (!db.objectStoreNames.contains('messages')) {
              db.createObjectStore('messages');
            }
          })
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
.waiting {
  padding: 10px;
  color: #555;
}

body{
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #303F9F;
}
</style>
