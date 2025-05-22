#include <Servo.h>

#define SERVO1_PIN 11
#define SERVO2_PIN 12
#define SERVO3_PIN 13
#define SERVO4_PIN 10
#define PUMP_PIN 9

#define FORWARD 180
#define NEUTRAL 90
#define REVERSE 0

Servo servos[3];
Servo pump;

void setup()
{
  Serial.begin(115200);

  servos[0].attach(SERVO1_PIN);
  servos[1].attach(SERVO2_PIN);
  servos[2].attach(SERVO3_PIN);
  servos[3].attach(SERVO4_PIN);

  pump.attach(PUMP_PIN);
  pump.writeMicroseconds(1000);  
  delay(3000);

  for (int i = 0; i < 4; i++) {
    servos[i].write(NEUTRAL);
  }
}

void loop()
{
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input.equalsIgnoreCase("conn")) {
      Serial.println("conn");
    } 
    else if (input.startsWith("p:")) {
      int throttle = input.substring(2).toInt();
      if (throttle >= 0 && throttle <= 100) {
        int pulse = map(throttle, 0, 100, 1000, 2000);
        pump.writeMicroseconds(pulse);
        Serial.println(input);
      } else {
        Serial.println("ERR: Invalid throttle");
      }
    }
    else if (input.length() >= 4 && input.charAt(0) == 'V') {
      int colonIndex = input.indexOf(':');
      if (colonIndex > 1 && colonIndex < input.length() - 1) {
        int servoIndex = input.substring(1, colonIndex).toInt();
        int angle = input.substring(colonIndex + 1).toInt();

        if (servoIndex >= 0 && servoIndex < 3 && angle >= -90 && angle <= 90) {
          int mappedAngle = map(angle, -90, 90, 0, 180);
          servos[servoIndex].write(mappedAngle);
          Serial.println(input);
        } else {
          Serial.println("ERR: Invalid range");
        }
      } else {
        Serial.println("ERR: Invalid format");
      }
    } 
    else {
      Serial.println("ERR: Invalid command");
    }
  }
}
