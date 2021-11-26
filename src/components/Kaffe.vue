<template>
  <div v-if="score || showScore" class="kaffe-wrapper">
    <div class="kaffe-score" v-if="score">
      <div v-if="!card">
        <img src="@/assets/scan.gif" alt="scan" />
        <h3>Select cups amount on keypad</h3>
        <h1>{{ amount }} cups</h1>
        <h2>Scan card after the correct amount is selected</h2>
      </div>
      <div v-if="card && score">
        <h1>{{ amount }} cups registered!</h1>
        <font-awesome-icon :icon="['fas', 'mug-hot']" size="6x" />
      </div>
    </div>
    <div class="kaffe-show-score" v-if="showScore">
      <div v-if="!card">
        <img src="@/assets/scan.gif" alt="scan" />
        <h2>Scan card to show your score</h2>
      </div>
      <div v-if="card">
        <h2>Your score is {{ scoreCount }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Kaffe",
  created: function () {
    window.addEventListener("keyup", this.onkey);
  },
  beforeDestroy: function () {
    window.removeEventListener("keyup", this.onkey);
  },
  data() {
    return {
      amount: 0,
      score: false,
      scoring: false,
      showScore: false,
      scoreCount: 0,
      card: false,
      register: false
    };
  },
  methods: {
    incAm() {
      if (this.scoring) {
        this.amount++;
      }
    },
    decAm() {
      if (this.scoring && this.amount > 0) {
        this.amount--;
      }
    },
    reset() {
      this.score = false;
      this.amount = 0;
      this.scoreCount = 0;
      this.card = false;
      this.scoring = false;
      this.showScore = false;
      this.register = false;
    },
    onkey(e) {
      switch (e.key) {
        case "l": // INC
          this.incAm();
          break;
        case "k": // DEC
          this.decAm();
          break;
        case "t": // SHOW SCORE
          this.showScore = true;
          break;
        case "y": // SCORING
          this.scoring = true;
          this.score = true;
          break;
        case "h": // CARD SCANNED
          this.getCard();
          if (this.showScore) {
            this.getScore(this.uuid)
          } else if (this.score) {
            this.addScore(this.uuid)
          }
          setTimeout(
            function () {
              this.reset();
            }.bind(this),
            4000
          );
          break;
      }
    },
    async getCard() {
      // await 
      user = {uuid: "432", score: 4, date: "11-12-2021"};
      this.uuid = user.uuid;
      if (this.uuid == "unknown" || date > currentDate) {
        this.register();
      }
      this.card = true;
    },
    async getScore(uuid) {
      // await get from server
      this.scoreCount = 4;
    },
    async addScore(uuid) {
      //await inc score with amount to server
      console.log(`ADDED ${this.amount} TO ${this.uuid}`)
    },
    async register(uuid) {
      this.register = true;
    }
  },
};
</script>