<template>
    <div class="notifs">
        <div v-for="n in notifs" class="mdl-card custom">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">{{n.interest}}</h2>
                <div class="mdl-layout-spacer"></div>
                <p class="mdl-card__title-text">{{n.date}}</p>
            </div>
            <div class="mdl-card__supporting-text">
                {{n.notice}}
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "notif",
    mounted: function(){
      this.$store.dispatch('getPersonal')
    },
    computed: {
      notifs () {
        return this.$store.getters.personal
      },
    },
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