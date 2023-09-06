const RPiMfrc522 = require("rpi-mfrc522");

class Reader {
  constructor() {
    console.log('Init reader')
    this.mfrc522 = new RPiMfrc522();
    this.count = 0;
  }

  run() {
    let uid;
    this.mfrc522.init()
      .then(() => {
        uid = this.cardDetect()
          .catch(error => {
            console.log('ERROR', error.message);
          });
        this.count = 0;
      })
      .catch(error => {
        console.log('ERROR:', error.message)
      });
    return uid
  }

  async cardDetect() {
    if (this.count > 10) {
      return null
    }
    this.count++;

    console.log("Looking for card...")
    if (!(await this.mfrc522.cardPresent())) {
      console.log('No card')
      return this.reLoop();
    }

    let uid = await this.mfrc522.antiCollision();
    if (!uid) {
      console.log('Collision');
      return this.reLoop();
    }

    uid = this.uidToString(uid)

    console.log('Card detected, UID ' + uid);
    await this.mfrc522.resetPCD()
    return uid;
  }

  reLoop() {
    setTimeout(() => { this.cardDetect() }, 25);
  }

  uidToString(uid) {
    return uid.reduce((s, b) => { return s + (b < 16 ? '0' : '') + b.toString(16); }, '');
  }
}

r = new Reader();
r.run()
