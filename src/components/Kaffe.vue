<template>
  <div v-if="score || showScore" class="kaffe-wrapper">
    <div class="kaffe-score" v-if="score">
      <div v-if="!card">
        <img src="@/assets/scan.gif" alt="scan" class="scan" />
        <h3>Select cups amount on keypad</h3>
        <h1>{{ amount }} cups</h1>
        <h2>Scan card after the correct amount is selected</h2>
      </div>

      <div v-if="card && !register">
        <h1>{{ amount }} cups registered!</h1>
        <font-awesome-icon :icon="['fas', 'mug-hot']" size="6x" />
        <h2>Your score is {{ scoreCount }}</h2>
      </div>

      <div v-if="card && register">
        <h1>Looks like you haven't paid for this half-year!</h1>
        <img src="@/assets/qr.png" alt="scan" id="qr" />
        <h2>Please pay, then press the pay button to continue!</h2>
        <h3>Press the X if you wish to cancel!</h3>
      </div>
    </div>

    <div class="kaffe-show-score" v-if="showScore">
      <div v-if="!card">
        <img src="@/assets/scan.gif" alt="scan" class="scan" />
        <h2>Scan card to show your score</h2>
      </div>

      <div v-if="(card && !register) || scoreCount != 0">
        <h2>Your score is {{ scoreCount }}</h2>
        <font-awesome-icon :icon="['fas', 'mug-hot']" size="6x" />
      </div>

      <div v-if="card && register && scoreCount == 0">
        <h1>You don't have any score!</h1>
        <h2>Please try to pay first by scoring some coffee.</h2>
      </div>
    </div>
  </div>
</template>

<script>
let tm;
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
      register: false,
      tm: null,
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
    reset(timeout) {
      clearTimeout(this.tm);
      this.tm = setTimeout(
        function () {
          this.score = false;
          this.amount = 0;
          this.scoreCount = 0;
          this.card = false;
          this.scoring = false;
          this.showScore = false;
          this.register = false;
        }.bind(this),
        timeout
      );
    },
    stop() {
      clearTimeout(this.tm);
    },
    onkey(e) {
      switch (e.key) {
        case "AudioVolumeUp": // INC
          this.incAm();
          break;
        case "AudioVolumeDown": // DEC
          this.decAm();
          break;
        case "5": // SHOW SCORE
          if (!this.scoring) {
            this.showScore = true;
            this.getScore();
          }
          break;
        case "6": // SCORING
          if (!this.showScore) {
            this.scoring = true;
            this.score = true;
            this.addScore();
          }
          break;
        case "2": // PAY
          if (this.register) {
            this.pay();
          }
          break;
        case "1": // RESET
          this.reset(0);
      }
    },
    async getCard() {
      this.reset(15000);
      const uid = await this.reader.run()
      if (uid != null) {
        this.card = true;
      } else {
        this.reset(0);
      }
      return uid;
    },
    async getUser() {
      const uid = await this.getCard();
      const user = await this.dataHandler.getUser(uid);
      return user
    },
    async getScore() {
      const uid = await this.getCard();
      if (uid) {
        const user = await this.dataHandler.getUser(uid)
        this.scoreCount = user.score;
        this.register = !user.paid;
        this.reset(4000);
      }
    },
    async addScore() {
      const uid = await this.getCard();
      if (uid) {
        await this.dataHandler.addScore(uid, this.score).then((response) => {
            if (!response.pay) {
              this.register = true;
              this.stop();
            } else {
              this.scoreCount = response.data.score;
              this.reset(4000);
            }
          });
      }
    },
    async pay() {
      this.dataHandler.pay();
      this.reset();
    },
  },
};
</script>
