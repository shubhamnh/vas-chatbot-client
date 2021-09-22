<template>
    <div class="chat">
        <div>
            <ul class="messview" ref="messview">
                <li v-for="(message, index) in this.messages" :key="index" stagger="1000" style="width:100%">
                    <div v-if="message.who === 'bot'">
                        <div v-if="message.text" class="msj macro">
                            <div class="avatar"><img class="img-circle" style="width:100%;" src="../assets/bot.svg" /></div>
                            <div class="text text-l">
                                <p><span v-html="message.text"></span></p>
                                <p><small>{{message.time}}</small></p>
                            </div>
                        </div>

                        <div v-else-if="message.image" class="msj macro img-res">
                            <div class="text text-l">
                                <img :src="message.image" class="content-pad">
                                <p><small>{{message.time}}</small></p>
                            </div>
                        </div>

                        <div v-else-if="message.table" class="msj macro">
                            <div class="text text-l">
                                <div class="table content-pad" v-html="message.table"></div>
                                <p><small>{{message.time}}</small></p>
                            </div>
                        </div>

                    </div>

                    <div v-else class="msj-rta macro">
                        <div class="text text-r">
                            <p><span v-html="message.text"></span></p>
                            <p><small>{{message.time}}</small></p>
                        </div>
                        <div class="avatar" style="padding:0px 0px 0px 10px !important">
                            <img class="img-circle" style="width:100%;" src="../assets/user.png" />
                        </div>
                    </div>
                </li>
                
                <li v-if="this.processing" style="width:100%">
                    <div class="msj" style="margin-bottom:10px;width:80%;border-radius:5px;padding:5px;display:flex;">
                        <div>
                            <p style="line-height= 13px;font-size= 12px;" v-html="processingText"></p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="typefield">
            <div class="faq">
                <button v-for="(faq, index) in this.faqs" :key="index" v-mdl type="button" @click="sendfaq(faq)" class="mdl-chip chip">
                    <span v-mdl class="mdl-chip__text">{{faq}}</span>
                </button>
            </div>
            <div style="position:relative; display:flex; width:100%; margin-left:10px;">
                <div v-mdl class="mdl-textfield mdl-js-textfield" style="width:80%;">
                    <textarea v-mdl  @keyup.enter="processQuery" class="mdl-textfield__input" type="text" rows="1" v-model="query" id="query-text"></textarea>
                    <label v-mdl class="mdl-textfield__label" for="query-text">How can I help you?</label>
                </div>
                <button v-mdl @click="processQuery" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                    <i class="material-icons">send</i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import { dbPromise, writeData, clearAllData, readAllData } from '../helpers/utility'
  
  export default {
    name: "Chat",
    methods: {
      processQuery () {
        this.query = this.query.trim()
        const userMessage = {
            'text': this.query,
            'time': this.currentTime(),
            'who': 'me',
        }

        this.messages.push(userMessage)
        writeData(dbPromise, 'messages', userMessage, this.messages.length + 1)

        axios.post('/api/query/', {query: this.query}, this.config)
            .then(res => {
              this.processing = false

              res.data.response.forEach(message => {
                let botMessage = {
                    'time': this.currentTime(),
                    'who': 'bot',
                }
                for (const key in message) {
                    botMessage[key] = message[key]
                    this.messages.push(botMessage)
                    writeData(dbPromise, 'messages', botMessage, this.messages.length + 1)
                }
              });
              
              console.log(res)
            })
            .catch(error => {
              console.log(error) 
              if (error.response.status === 401) {
                this.$store.dispatch('logout')
                this.$router.push('/')
              }
              this.processingText = 'Something went wrong..'
            })

        this.query = ''
        this.processingText = "Just a moment...."
        this.processing = true
        setTimeout(()=>{
            this.processingText = "Just a moment....<br>First response may take a minute or two. I'm waking up from my sleep!"
        }, 5000)
        
      },
      sendfaq (query) {
          this.query = query
          this.processQuery()
      },
      currentTime(){
        let date = new Date()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours === 0 ? 12 : hours // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes
        let strTime = hours + ':' + minutes + ' ' + ampm
        return strTime
      }
    },
    computed: {
      messages() {
          return this.$store.getters.messages
      }
    },
    mounted () {
        const container = this.$refs.messview
        container.scrollTop = container.scrollHeight
    },
	updated () {
		const container = this.$refs.messview
        container.scrollTop = container.scrollHeight
    },
    data () {
      return {
        query: '',
        config: this.$store.getters.config,
        // messages: this.$store.getters.messages,
        processing: false,
        processingText: 'Just a moment....',
        dbPromise: dbPromise,
        faqs: ['Hello','What\'s the schedule?','Time Table','Tomorrow\'s lectures', 'Apply for Concession']
      }
    }
  }
</script>

<style scoped>
    .chat {
        text-align: center;
    }
    .mytext{
        border:0;padding:10px;background:whitesmoke;
    }
    .text{
        width:75%;display:flex;flex-direction:column;padding-top:5px;
    }
    .text > p:first-of-type{
        width:100%;margin-top:0;margin-bottom:auto;line-height: 13px;font-size: 13px;
    }
    .text > p:last-of-type{
        width:100%;text-align:right;color:silver;margin-bottom:-7px;margin-top:auto;
    }
    .text-l{
        float:left;padding-right:10px;
    }
    .text-r{
        float:right;padding-left:10px;
    }
    .avatar{
        display:flex;
        justify-content:center;
        align-items:center;
        width:25%;
        float:left;
        padding-right:10px;
    }
    .messview{
        background-color:#e0e0de;
        width: 100%;
        width: -moz-available;
        width: -webkit-fill-available;
        width: fill-available;
    }
    .macro{
        margin-bottom:10px;width:85%;border-radius:5px;padding:5px;display:flex;
    }
    .msj-rta{
        float:right;background:whitesmoke;
    }
    .msj{
        float:left;background:white;
    }
    .img-res{
        justify-content: center;
        padding: 1rem 0rem;
    }
    .img-res >>> img {
        border-radius:5px;
    }
    .faq {
        overflow: auto;
        position: relative;
        display: flex;
        width: 100%;
    }
    .chip {
        margin: 5px;
    }

    .frame{
        background:#e0e0de;
        height:100%;
        overflow:hidden;
        padding:0;
    }
    .typefield{
        position: fixed;
        left: 0;
        bottom: 0;
        width:100%;
        background:white;
        border-radius:10px;
    }
    div ul{
        height:85%;
        overflow:hidden;
        overflow-y:scroll;
    }

    ul {
        font-family: 'Roboto';
        list-style-type: none;
        padding: 0px 12px;
        margin: 0px;
        position:absolute;
        display:flex;
        flex-direction: column;
    }
    .messview > li:first-of-type{
        padding-top: 10px;
    }  
    .messview > li:last-of-type{
        padding-bottom: 40px;
    }
    
    .table >>> table {
        border-collapse: collapse;
    }

    .table >>> th {
        padding: 4px;
        font-size: 12px;
    }

    .table >>> td {
        padding: 4px;
        font-size: 12px;
    }

    .content-pad {
        padding-bottom:3px
    }

    p {
        margin-top: 5px;
    }
    .msj:before{
        width: 0;
        height: 0;
        content:"";
        top:-5px;
        left:-14px;
        position:relative;
        border-style: solid;
        border-width: 0 13px 13px 0;
        border-color: transparent #ffffff transparent transparent;
    }
    .msj-rta:after{
        width: 0;
        height: 0;
        content:"";
        top:-5px;
        left:14px;
        position:relative;
        border-style: solid;
        border-width: 13px 13px 0 0;
        border-color: whitesmoke transparent transparent transparent;
    }
    input:focus{
        outline: none;
    }
    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #d4d4d4;
    }
    ::-moz-placeholder { /* Firefox 19+ */
        color: #d4d4d4;
    }
    :-ms-input-placeholder { /* IE 10+ */
        color: #d4d4d4;
    }
    :-moz-placeholder { /* Firefox 18- */
        color: #d4d4d4;
    }
</style>
