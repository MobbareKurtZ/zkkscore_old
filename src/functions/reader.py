import time
from datetime import datetime
from urllib.parse import uses_relative
import RPi.GPIO as GPIO
import json
from mfrc522 import SimpleMFRC522


class Reader:
    reader = SimpleMFRC522()
    GPIO.setwarnings(False)
    read = True;

    def listen(self, timeout):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(7, GPIO.OUT)
        try:
            timeout = time.time() + int(timeout)
            self.read = True;
            GPIO.output(7, GPIO.HIGH)
            while self.read:
                id = self.reader.read_id_no_block()
                time.sleep(0.1)
                if time.time() > timeout or not id == None:
                    break
        finally:
                GPIO.output(7, GPIO.LOW)
                GPIO.cleanup()
        return id
    def stop(self):
        self.read = False;


class FileHandler:

    filename = 'data.json'

    def getUser(self, id):
        user = None
        data = self.readData()
        if id in data:
            user = data.get(id)
        else:
            user = self.register(id)
        return user

    def score(self, id, inc):
        user = self.getUser(id)
        if self.checkPay(user, id):
            user['score'] += int(inc)
            self.writeUser(user, id)
        return user

    def readData(self):
        with open(self.filename, 'r') as file:
            return json.load(file)

    def writeUser(self, userdata, id):
        data = self.readData()
        data.update({id: userdata})
        with open(self.filename, "w") as outfile:
            json.dump(data, outfile)

    def register(self, id):
        user = {'date': datetime.today().strftime(
            '%Y-%m-%d'), 'score': 0, 'pay': False}
        self.writeUser(user, id)
        return user

    def checkPay(self, user, id):
        date = datetime.strptime(user['date'], "%Y-%m-%d")
        today = datetime.today()
        diff = today - date
        if diff.days > 365/2:
            user["pay"] = False;
            self.writeUser(user, id)
            return False
        else:
            return user['pay']

    def pay(self, id):
        user = self.getUser(id)
        user["pay"] = True;
        user["date"] = datetime.today().strftime('%Y-%m-%d')
        self.writeUser(user, id)
