<template>
    <div>
        <div>
            <ul class="messview" ref="messview">
                <li v-for="message in this.messages" stagger="1000" style="width:100%">
                    <div v-if="message.who === 'bot'" class="msj macro">
                        <div class="avatar"><img class="img-circle" style="width:100%;" src="../assets/bot.svg" /></div>
                        <div class="text text-l">
                            <p><span v-html="message.text"></span></p>
                            <p><small>{{message.time}}</small></p>
                        </div>
                    </div>

                    <div v-else class="msj-rta macro">
                        <div class="text text-r">
                            <p><span v-html="message.text"></span></p>
                            <p><small>{{message.time}}</small></p>
                        </div>
                        <div class="avatar" style="padding:0px 0px 0px 10px !important">
                            <img class="img-circle" style="width:100%;" src="../assets/user.jpg" />
                        </div>
                    </div>
                </li>
                
                <li v-if="this.processing" style="width:100%">
                    <div class="msj" style="margin-bottom:10px;width:38%;border-radius:10px;padding:5px;display:flex;">
                        <div>
                            <p style="line-height= 13px;font-size= 12px;">{{processingText}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="typefield">
            <div class="faq" style="position:relative; display:flex; width:100%;">
                    <button v-for="faq in this.faqs" v-mdl type="button" v-on:click="sendfaq(faq)" class="mdl-chip chip">
                        <span v-mdl class="mdl-chip__text">{{faq}}</span>
                    </button>
            </div>
            <div style="position:relative; display:flex; width:100%;">
                <div v-mdl class="mdl-textfield mdl-js-textfield" style="width:80%;">
                    <textarea v-mdl  v-on:keyup.enter="mymess" class="mdl-textfield__input" type="text" rows="1" ref="mymess" id="mymess"></textarea>
                    <label v-mdl class="mdl-textfield__label" for="mymess">How can I help you?</label>
                </div>
                <button v-mdl v-on:click="mymess" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                    <i class="material-icons">send</i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
  import data from '../data'
  import axios from 'axios'
  import idb from '../idb'
  
  export default {
    methods: {
      mymess: function () {
        const query = {
          text: this.$refs.mymess.value,
        }
        console.log(query)
        this.messages.push({'text': this.$refs.mymess.value, 'time': this.currentTime(), 'who': 'me',})
        this.writeData('messages', {'text': this.$refs.mymess.value, 'time': this.currentTime(), 'who': 'me'}, this.messages.length+1)
        this.$refs.mymess.value = ''
        this.processingText = 'Just a moment....'
        this.processing = true
        axios.post('/login/query/', {query: query.text}, this.config)
            .then(res => {
              this.processing = false
              this.messages.push({'text': res.data.response, 'time': this.currentTime(), 'who': 'bot',})
              this.writeData('messages', {'text': res.data.response, 'time': this.currentTime(), 'who': 'bot'}, this.messages.length+1)
              console.log(res)
            })
            .catch(error => {
              console.log(error)
              this.processingText = 'An error occurred..'
            })
      },
      sendfaq: function(query) {
          this.$refs.mymess.value = query
          this.mymess()
      },
      currentTime(){
        var date = new Date()
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours === 0 ? 12 : hours // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes
        var strTime = hours + ':' + minutes + ' ' + ampm
        return strTime
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
	updated() {
		const container = this.$refs.messview
        container.scrollTop = container.scrollHeight
    },
    data () {
      return {
        messno: data.messages.length,
        config: this.$store.getters.config,
        processing: false,
        processingText: 'Just a moment....',
        dbPromise: idb.open('messages-store'),
        faqs: ['Current lecture','Todays lecture','Tomorrows lecture','Next lecture','My Result','My Pointer']
      }
    }
  }
</script>

<style scoped>
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
    }
    .macro{
        margin-bottom:10px;width:85%;border-radius:10px;padding:5px;display:flex;
    }
    .msj-rta{
        float:right;background:whitesmoke;
    }
    .msj{
        float:left;background:white;
    }
    .faq {
        overflow-x: auto;
    }
    .chip {
        margin-top:5px;
        margin-right:5px;
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
        padding:0px 10px;
    }
    div ul{
        height:90%;
        width:98%;
        overflow:hidden;
        overflow-y:scroll;
    }

    ul {
        font-family: 'Roboto';
        width:100%;
        list-style-type: none;
        padding:18px;
        position:absolute;
        bottom:36px;
        display:flex;
        flex-direction: column;
    }
    .messview > li:first-of-type{
        padding-top: 10px;
    }  
    .messview > li:last-of-type{
        padding-bottom: 50px;
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
