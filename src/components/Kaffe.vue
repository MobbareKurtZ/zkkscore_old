<template>
  <div v-if="score || showScore" class="kaffe-wrapper">
    <div class="kaffe-score" v-if="score">
      <div v-if="!card">
        <img src="@/assets/scan.gif" alt="scan" />
        <h3>Select cups amount on keypad</h3>
        <h1>{{ amount }} cups</h1>
        <h2>Scan card after the correct amount is selected</h2>
      </div>
      <div v-if="card">
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
          this.card = true;
          setTimeout(
            function () {
              this.reset();
            }.bind(this),
            4000
          );
          break;
      }
    },
  },
};
</script>