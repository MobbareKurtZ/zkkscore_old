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
      path: "http://localhost:5000",
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
          this.axios.get(this.path + "/stop");
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
      await this.axios.get(this.path + "/scan?timeout=15").then((response) => {
        this.uuid = response.data;
	console.log(response.data)
        if (this.uuid != "None") {
          this.card = true;
        }
      });
    },
    async getScore() {
      console.log("SCANNSDJISJFIHAIDSa")
      await this.getCard();
      if (this.card) {
        await this.axios
          .get(this.path + "/get-user?uuid=" + this.uuid)
          .then((response) => {
            this.scoreCount = response.data.score;
            if (!response.data.pay) {
              this.register = true;
            }
            this.reset(4000);
          });
      }
    },
    async addScore() {
      await this.getCard();
      if (this.card) {
        await this.axios
          .get(this.path + "/score?uuid=" + this.uuid + "&inc=" + this.amount)
          .then((response) => {
            if (!response.data.pay) {
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
      this.axios.post(this.path + "/pay?uuid=" + this.uuid);
      this.reset();
    },
  },
};
</script>
