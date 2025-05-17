#include <Arduino.h>
#include <FirebaseClient.h>
#include "ExampleFunctions.h"
#include "DHT.h"
#include <Adafruit_SGP40.h>
#include <WiFiManager.h>
#include <time.h>  // For NTP time

// Sensor setup
Adafruit_SGP40 sgp;
#define DHTPIN 4
#define DHTTYPE DHT22
#define MQ135 34
#define MQ7 35
DHT dht(DHTPIN, DHTTYPE);

// Firebase credentials
#define API_KEY "AIzaSyB7XYxfnJjWTXdzhoNp0v2V-jdTON9Qci4"
#define USER_EMAIL "qwer@qwer.com"
#define USER_PASSWORD "123456"
#define DATABASE_URL "https://naqa-f6853-default-rtdb.asia-southeast1.firebasedatabase.app/"

// Firebase objects
SSL_CLIENT ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);
UserAuth user_auth(API_KEY, USER_EMAIL, USER_PASSWORD, 3000);
FirebaseApp app;
RealtimeDatabase Database;
AsyncResult databaseResult;

// Sensor readings
int MQ135_reading = 0;
int MQ7_reading = 0;
float humd = 0;
float temp = 0;

// Timestamp control
unsigned long lastSent = 0;
const unsigned long sendInterval = 10000; // 10 seconds

// Function declarations
void set_await();
void show_status(bool status);
void processData(AsyncResult &aResult);

void setup() {
  Serial.begin(115200);
  dht.begin();
  analogReadResolution(12);

  if (!sgp.begin()) {
    Serial.println("SGP40 sensor not found :(");
    while (1);
  }

  // WiFiManager setup
  WiFiManager wm;
  bool res = wm.autoConnect("Naqa_Setup");
  if (!res) {
    Serial.println("Failed to connect to Wi-Fi");
    ESP.restart();
  }

  Serial.println("WiFi connected. Syncing time...");
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  // Wait for NTP sync
  while (time(nullptr) < 100000) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nTime synced!");

  // Firebase setup
  Firebase.printf("Firebase Client v%s\n", FIREBASE_CLIENT_VERSION);
  set_ssl_client_insecure_and_buffer(ssl_client);
  initializeApp(aClient, app, getAuth(user_auth), auth_debug_print, "🔐 authTask");

  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);
}

void loop() {
  app.loop();
  processData(databaseResult);

  // Check if it's time to send data
  if (app.ready() && millis() - lastSent > sendInterval) {
    set_await();
    lastSent = millis();
  }
}

void set_await() {
  bool status;
  uint16_t sraw;
  int32_t voc_index;

  humd = dht.readHumidity();
  temp = dht.readTemperature();
  MQ135_reading = analogRead(MQ135);
  MQ7_reading = analogRead(MQ7);

  if (isnan(humd) || isnan(temp)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  sraw = sgp.measureRaw(temp, humd);
  voc_index = sgp.measureVocIndex(temp, humd);

  unsigned long timestamp = time(nullptr);  // Proper UNIX timestamp

  Serial.printf("Humidity: %.2f%%, Temp: %.2f°C, MQ135: %d, MQ7: %d, VOC Index: %d, Time: %lu\n",
                humd, temp, MQ135_reading, MQ7_reading, voc_index, timestamp);

  status = Database.set<int>(aClient, "/MQ135", MQ135_reading);  show_status(status);
  status = Database.set<int>(aClient, "/MQ7", MQ7_reading);      show_status(status);
  status = Database.set<int>(aClient, "/VOC", voc_index);        show_status(status);
  status = Database.set<number_t>(aClient, "/humid", number_t(humd, 2)); show_status(status);
  status = Database.set<number_t>(aClient, "/temp", number_t(temp, 2));  show_status(status);
  status = Database.set<number_t>(aClient, "/timestamp", number_t((float)timestamp, 0)); show_status(status);
}

void show_status(bool status) {
  if (status)
    Serial.println("✅ Success");
  else
    Firebase.printf("❌ Error: %s, Code: %d\n", aClient.lastError().message().c_str(), aClient.lastError().code());
}

void processData(AsyncResult &aResult) {
  if (!aResult.isResult()) return;

  if (aResult.isEvent())
    Firebase.printf("📩 Event: %s, %s, Code: %d\n", aResult.uid().c_str(), aResult.eventLog().message().c_str(), aResult.eventLog().code());

  if (aResult.isDebug())
    Firebase.printf("🛠 Debug: %s, %s\n", aResult.uid().c_str(), aResult.debug().c_str());

  if (aResult.isError())
    Firebase.printf("❗ Error: %s, %s, Code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());

  if (aResult.available())
    Firebase.printf("📦 Result: %s, Payload: %s\n", aResult.uid().c_str(), aResult.c_str());
}