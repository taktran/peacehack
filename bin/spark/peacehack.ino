/**
 * #peacehack lights
 *
 * https://github.com/taktran/peacehack
 *
 * Internet connected lights
 */

// Set pin numbers
const int buttonPin = D0;

const int rgbRedPin = A0;
const int rgbGreenPin = A1;
const int rgbBluePin = A4;

const int HTTP_OK = 200;

int buttonState = 0; // variable for reading the pushbutton status
int prevButtonState = buttonState;

int rgbRed = 0;
int rgbGreen = 0;
int rgbBlue = 0;

char rgbColors[64];

String publishEventPrefix = "rgb:";
String publishEventName = String(publishEventPrefix + Spark.deviceID());

int random(int maxRand) {
  return rand() % maxRand + 1;
}

void splitArgStringToArray(String arguments, String *target){
  int numArgs = 0;
  int beginIdx = 0;
  int idx = arguments.indexOf(";");
  int NOT_FOUND = -1;

  while (idx != NOT_FOUND) {
    String arg = arguments.substring(beginIdx, idx);
    arg.trim();
    target[numArgs] = arg;

    beginIdx = idx + 1;
    idx = arguments.indexOf(";", beginIdx);
    ++numArgs;
  }

  // Single or last parameter
  String lastArg = arguments.substring(beginIdx);
  target[numArgs] = lastArg;
}

void setRGBColor(String command) {

  String data[3] = { NULL };
  splitArgStringToArray(command, data);

  rgbRed = data[0].toInt() % 256;
  rgbGreen = data[1].toInt() % 256;
  rgbBlue = data[2].toInt() % 256;

  sprintf(rgbColors, "{\"r\":%i,\"g\":%i,\"b\":%i}", rgbRed, rgbGreen, rgbBlue);
  Spark.publish(publishEventName, rgbColors);
}

void nextRandomColor() {
  rgbRed = random(255);
  rgbGreen = random(255);
  rgbBlue = random(255);

  sprintf(rgbColors, "{\"r\":%i,\"g\":%i,\"b\":%i}", rgbRed, rgbGreen, rgbBlue);
  Spark.publish(publishEventName, rgbColors);
}

void writeRgbColor() {
  analogWrite(rgbRedPin, rgbRed);
  analogWrite(rgbGreenPin, rgbGreen);
  analogWrite(rgbBluePin, rgbBlue);
}

int changeRGB(String command) {
  setRGBColor(command);

  return HTTP_OK;
}

int randomRGB(String command) {
  nextRandomColor();

  return HTTP_OK;
}

void setup() {
  // Start serial connection
  Serial.begin(9600);

  /**
   * Change RGB with specific color with command.
   *
   * Command is in the format:
   *
   *    [red_color];[green_color];[blue_color]
   *
   * where [red_color] (and similar) is equal to a number between 0-255
   *
   * To call (with authentication):
   *
   *    POST https://api.spark.io/v1/devices/[device_id]/update
   */
  Spark.function("update", changeRGB);

  /**
   * Change RGB to a random color
   *
   * To call (with authentication):
   *
   *    POST https://api.spark.io/v1/devices/[device_id]/random
   */
  Spark.function("random", randomRGB);

  // Register state variable
  Spark.variable("state", &rgbColors, STRING);

  // Initialize the pushbutton pin as an input
  pinMode(buttonPin, INPUT);

  // Initialize RGB LEDs
  pinMode(rgbRedPin, OUTPUT);
  pinMode(rgbGreenPin, OUTPUT);
  pinMode(rgbBluePin, OUTPUT);

  // Set initial colour
  nextRandomColor();
}

void loop() {
  // Store previous button state
  prevButtonState = buttonState;

  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH) { // Pressed
    buttonState = 1;
  } else if (buttonState == LOW) { // Not pressed
    buttonState = 0;
  }

  // Do something, if button state changes
  if ((prevButtonState != buttonState) && (buttonState == 0)) {
    Serial.println("Button pressed");

    nextRandomColor();
  }

  writeRgbColor();

  // Give it a bit of time to breathe
  delay(10);
}