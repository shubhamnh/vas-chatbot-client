<template>
    <div>
            <br><br>
            <mdl-textfield floating-label="Subject" v-model="subject" class="input"></mdl-textfield>
            <br>
            <mdl-textfield floating-label="Message" v-model="details" class="input" textarea rows="6"></mdl-textfield>
            <br>
            <button v-mdl @click="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>

        <mdl-snackbar display-on="submit"></mdl-snackbar>
    </div>
</template>

<script>
import axios from 'axios'
  export default {
    name: "Feedback",
    methods: {
      submit () {
        axios.post('/api/feedback/', {subject: this.subject, details: this.details}, this.config)
            .then(res => {
              console.log(res)
              this.subject = null
              this.details = null
              this.$root.$emit('submit', { message: 'Thank you for the feedback! :D' })
            })
            .catch(error => {
              console.log(error)
              this.$root.$emit('submit', { message: 'Feedback could not be submitted' })
            })
      },
    },
    data () {
      return {
        details: null,
        subject: null,
        config: this.$store.getters.config,
      }
    }
  }
</script>

<style scoped>
</style>