<template>
    <div class="notifs">
        <div v-for="notif in notifs" :key="notif.creation_date+notif.teacher" class="mdl-card custom">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">{{notif.subject}}</h2>
                <div class="mdl-layout-spacer"></div>
                <p class="mdl-card__title-text">{{notif.creation_date}}</p>
            </div>
            <div class="mdl-card__supporting-text">
                <p>From: {{notif.teacher}}</p>
                <p>Notice: {{notif.notice}}</p>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "PersonalNotification",
    mounted () {
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
    margin: 20px auto;
    border-radius:10px;
    min-height:125px;
  }
  .notifs {
    overflow:auto;
    background:#e0e0de;
    height:100%;
  }
</style>