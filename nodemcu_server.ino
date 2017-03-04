#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino
//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "WiFiManager.h"          //https://github.com/tzapu/WiFiManager


#define RESET_BUTTON D5
int buttonState = 0;
  WiFiManager wifiManager;
  ESP8266WebServer server (80);

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
}



void reset_settings() {

      Serial.println("Resetting settings");
      wifiManager.resetSettings();
}






const int led = 13;


const int redPin = D2;
const int greenPin = D3;
const int bluePin = D4;

int brightness = 100;
String rgb_value;
int redValue, greenValue, blueValue;


void handleNotFound() {
  digitalWrite ( led, 1 );
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += ( server.method() == HTTP_GET ) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";

  for ( uint8_t i = 0; i < server.args(); i++ ) {
    message += " " + server.argName ( i ) + ": " + server.arg ( i ) + "\n";
  }

  server.send ( 404, "text/plain", message );
  digitalWrite ( led, 0 );
}

void setup ( void ) {

  Serial.begin(115200);
  pinMode(RESET_BUTTON, INPUT_PULLUP);
  digitalWrite(RESET_BUTTON, 1);
  //WiFiManager
  //Local intialization. Once its business is done, there is no need to keep it around

  //reset settings - for testing
 // wifiManager.resetSettings();

  //set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  wifiManager.setAPCallback(configModeCallback);

  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  if(!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  }



  pinMode ( led, OUTPUT );
  digitalWrite ( led, 0 );


  server.on ( "/", openPicker );
  server.on ( "/settings", retreiveCurrentSettings );
  server.on ( "/setcolor", handleColor );
  server.on ( "/brightness", handleBrightness );
  server.on ( "/inline", []() {
    server.send ( 200, "text/plain", "this works as well" );
  } );
  server.onNotFound ( handleNotFound );
  server.begin();
  Serial.println ( "HTTP server started" );
  setValue(0,0,0,0);
}

void loop ( void ) {
  buttonState = digitalRead(RESET_BUTTON);
  // is configuration portal requested?
  if (buttonState == LOW) {
      reset_settings();
      delay(1000);
  }

  server.handleClient();
}


String  hex2rgb(String str){
    String hexstring = str;
    long number = (long) strtol( &hexstring[0], NULL, 16 );
    int r = number >> 16;
    int g = number >> 8 & 0xFF;
    int b = number & 0xFF;

    String out =  String(r) + ":" +  String(g)  + ":" + String(b);
    redValue = r;
    greenValue = g;
    blueValue = b;
    return out;

}

void  setValue(int r, int g, int b, int brightness){
  //   g = 255 - g;
  Serial.print("setValue called with args: ");
  Serial.println(String(r) + "," +String( g )+ "," + String( b) + "; brightness: " + String(brightness));
  Serial.println("Values with brightness:" + String(r*brightness/100) + "," +String(g*brightness/100)+ "," +String(b*brightness/100) + "; brightness: " + String(brightness));

  analogWrite(redPin, r*brightness/100);
  analogWrite(greenPin, g*brightness/100);
  analogWrite(bluePin, b*brightness/100);

}





String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}




void retreiveCurrentSettings(){
  String message =  "{\"result\":\"OK\",\"brightness\":\""+String(brightness)+"\",\"rgb\":\""+rgb_value+"\"}";
   server.send ( 200, "application/json", message );
}



void handleBrightness(){
  String message = "brightness not  found";
  for ( uint8_t i = 0; i < server.args(); i++ ) {
    if( server.argName ( i )  == "brightness"){
       brightness =  server.arg ( i ).toInt() ;

      if(rgb_value){
          String xval = getValue(rgb_value, ':', 0);
          String yval = getValue(rgb_value, ':', 1);
          String zval = getValue(rgb_value, ':', 2);

          int red = xval.toInt();
          int green = yval.toInt();
          int blue = zval.toInt();
          message = "Reseived " + server.argName ( i ) + ": brightness" + brightness + ";\nRGB: " + rgb_value;
          Serial.println(message);
          setValue(red*4,green*4,blue*4, brightness);
      }
      else{
        message = "No prev RGB value stored";
      }
       break;
    }
  }
  server.send ( 200, "text/plain", message );
}



void handleColor(){
  String hexcolor;
  String message = "Color not  found";
  for ( uint8_t i = 0; i < server.args(); i++ ) {
    if( server.argName ( i )  == "color"){
      hexcolor =  server.arg ( i ) ;
      String past_rgb_val = rgb_value;
      rgb_value = hex2rgb(hexcolor);
      String xval = getValue(rgb_value, ':', 0);
      String yval = getValue(rgb_value, ':', 1);
      String zval = getValue(rgb_value, ':', 2);

      int red = xval.toInt();
      int green = yval.toInt();
      int blue = zval.toInt();

       message = "Past rgb: " + past_rgb_val + "\n"+ "Past brightness: " + String(brightness) + "%\n"+ "Reseived " + server.argName ( i ) + ": #" + hexcolor + "; rgb(" + xval +"," +yval+"," +  zval + ")\n";
       setValue(red*4,green*4,blue*4, brightness);
       Serial.println(message);
       break;
      }
  }
  server.send ( 200, "text/plain", message );
}





void openPicker() {
  char temp[2600];
  int sec = millis() / 1000;
  int min = sec / 60;
  int hr = min / 60;
  snprintf ( temp, 2600,

"<!DOCTYPE html>\
<html lang='en'>\
  <head>\
    <title>NODEMCU RGB Control</title>\
    <meta charset='utf-8'> \
    <meta http-equiv='X-UA-Compatible' content='IE=edge'> \
    <meta name='viewport' content='width=device-width, initial-scale=1'> \
    <style>\
      body { background-color: #cccccc; font-family: Arial, Helvetica, Sans-Serif; Color: #000088; }\
    </style>\
    <link rel='stylesheet' href='http://bgrins.github.io/spectrum/spectrum.css' /> \
    <link rel='stylesheet' href='//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'> \
    <link rel='stylesheet' href='https://kantorv.github.io/nodemcu_rgb_lamp/frontend/css/main.css' /> \
  </head>\
  <body>\
    <h1>Picker page</h1>\
    <p>Uptime: %02d:%02d:%02d</p>\
    <p><label for='slider'>Brightness:</label></p> \
    <div id='slider' style='margin: 10px 0;'></div> \
    <div class='ui-widget-content' id='slide_pickers_holder'><p class='ui-state-default ui-corner-all ui-helper-clearfix' style='padding:4px;margin:0;'> <span class='ui-icon ui-icon-pencil' style='float:left; margin:-2px 5px 0 0;'></span>Simple Colorpicker</p><div id='red'></div><div id='green'></div><div id='blue'></div><div id='swatch' class='ui-widget-content ui-corner-all'></div></div> \
    <input type='text' id='full' /> \
    <script src='https://code.jquery.com/jquery-3.1.1.min.js'></script> \
     <script src='https://code.jquery.com/ui/1.12.1/jquery-ui.js'></script> \
    <script src='http://bgrins.github.io/spectrum/spectrum.js'></script> \
    <script src='https://kantorv.github.io/nodemcu_rgb_lamp/frontend/js/main.js'></script> \
     <script src='https://kantorv.github.io/nodemcu_rgb_lamp/frontend/js/jquery.ui.touch-punch.min.js'></script> \
    </body>\
</html>",

    hr, min % 60, sec % 60
  );
  server.send ( 200, "text/html", temp );
}