# #peacehack

A light hack for [#peacehack](http://talkingpeacefestival.org/events/event/peacehack/).

## Development

Install pre-requisites

    npm install

Start the server

    gulp

Extra options for the default `gulp` task:

* `--port [port]` [default=4000] Port that the server is run on
* `--lp [livereload port]` [default=35729] Port that livereload runs on
* `--debug` Enable debug mode:
    * Tests are run with Chrome (so you can use web inspector)
* `--jsreload` Enable live reload for javascript files (off by default)

Run the backend server

    npm run dev

A hack for now (TODO: merge with backend server), but run the socket server (for real time communication)

    npm run socket

### Spark core

Install pre-requisites

    npm install -g spark-cli
    spark cloud login

Get device state

    spark get [device_name] state

Monitor state

    spark monitor [device_name] state 5000

Update color

    spark call [device_name] update "100;100;0"

To flash the device with code

    spark flash [device_name] bin/spark/peacehack.ino

#### Serial

To debug the spark, you can monitor serial output.

Firstly, in the setup code

    void setup() {
        // Start serial connection
        Serial.begin(9600);

        // ...
    }

List connected serial devices

    spark serial list

Connect to device

    spark serial monitor [list_id]

## Secrets

On local dev, create a `config/_secrets.js` file in the format

    module.exports = {
      "API_KEY": "some_key",

      "FONDANT_KEY": "some_key",
      "MOCHI_KEY": "some_key"
    };

These are set up on production with environment variables eg,

    heroku config:set --app peacehack API_KEY=some_key

## Deployment

Initialise deployment with

    npm run shipit:init

Deploy with

    npm run shipit

### Initial setup

Ran this once, for heroku with secrets:

    heroku config:add ENV=production --app peacehack
    heroku config:add API_KEY=spark_api_key --app peacehack
    heroku config:add SPARK_ID=spark_device_id --app peacehack
