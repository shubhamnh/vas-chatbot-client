<template>
    <div class="notifs">
        <div v-for="n in notifs" class="mdl-card custom">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">{{n.interest}}</h2>
                <div class="mdl-layout-spacer"></div>
                <p class="mdl-card__title-text">{{n.date}}</p>
            </div>
            <div class="mdl-card__supporting-text">
                {{n.notification}}
            </div>
              <div v-if="n.filepresent == 1" class="mdl-card__actions mdl-card--border">
                <a v-bind:href="serverurl+n.filename" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                  Download Attachment
                </a>
              </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "notif",
    mounted: function(){
      this.$store.dispatch('getNotifs')
    },
    computed: {
      notifs () {
        // this.scrollToEnd()
        return this.$store.getters.notifs
      },
      serverurl () {
        return process.env.SERVER_FILES_URL
      }
    }
  }
</script>

<style scoped>
    .custom {
        margin-bottom:10px;border-radius:10px;min-height:125px;width:100%;
    }
    .notifs {
        padding:20px;
        overflow:auto;
        background:#e0e0de;
        height:100%;
    }
</style>