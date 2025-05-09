#include <Servo.h>

#define SERVO1_PIN 11
#define SERVO2_PIN 12
#define SERVO3_PIN 13

#define FORWARD 180
#define NEUTRAL 90
#define REVERSE 0

Servo servos[3];

void setup()
{
  Serial.begin(115200);

  servos[0].attach(SERVO1_PIN);
  servos[1].attach(SERVO2_PIN);
  servos[2].attach(SERVO3_PIN);

  for (int i = 0; i < 3; i++) {
    servos[i].write(NEUTRAL);
  }
}

void loop()
{
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();  // remove trailing newline or whitespace

    if (input.equalsIgnoreCase("conn")) {
      Serial.println("conn"); // echo back connection check
    } 
    else if (input.length() >= 4 && input.charAt(0) == 'V') {
      int colonIndex = input.indexOf(':');
      if (colonIndex > 1 && colonIndex < input.length() - 1) {
        int servoIndex = input.substring(1, colonIndex).toInt();
        int angle = input.substring(colonIndex + 1).toInt();

        if (servoIndex >= 0 && servoIndex < 3 && angle >= -90 && angle <= 90) {
          int mappedAngle = map(angle, -90, 90, 0, 180);
          servos[servoIndex].write(mappedAngle);

          Serial.println(input); // echo back
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
