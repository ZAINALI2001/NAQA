#include <Arduino.h>
#include <FirebaseClient.h>
#include "ExampleFunctions.h"
#include "DHT.h"
#include <Adafruit_SGP40.h>
#include <WiFiManager.h>
#include <time.h>

// ==== Sensor Definitions ====
#define DHTPIN 4
#define DHTTYPE DHT22
#define MQ135 34
#define MQ7 35
#define RL_VALUE 10.0  // kΩ
#define VREF 5.0       // ADC reference voltage

DHT dht(DHTPIN, DHTTYPE);
Adafruit_SGP40 sgp;

// ==== Firebase Configuration ====
#define API_KEY "AIzaSyB7XYxfnJjWTXdzhoNp0v2V-jdTON9Qci4"
#define USER_EMAIL "qwer@qwer.com"
#define USER_PASSWORD "123456"
#define DATABASE_URL "https://naqa-f6853-default-rtdb.asia-southeast1.firebasedatabase.app/"

SSL_CLIENT ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);
UserAuth user_auth(API_KEY, USER_EMAIL, USER_PASSWORD, 3000);
FirebaseApp app;
RealtimeDatabase Database;
AsyncResult databaseResult;

// ==== Calibration Constants ====
float R0_MQ135 = 76.63;  // Adjust after clean-air calibration
float R0_MQ7   = 10.00;  // Adjust after clean-air calibration

// ==== Variables ====
float humd = 0, temp = 0;
unsigned long lastSent = 0;
const unsigned long sendInterval = 10000; // 10 seconds

// ==== Helper Functions ====
float calculateRS(int raw_adc) {
  float voltage = raw_adc * (VREF / 4095.0);
  return ((VREF - voltage) * RL_VALUE) / voltage;
}

float getMQ135PPM(int raw_adc) {
  float Rs = calculateRS(raw_adc);
  float ratio = Rs / R0_MQ135;
  return 116.6020682 * pow(ratio, -2.769034857);  // CO₂ approximation
}

float getMQ7PPM(int raw_adc) {
  float Rs = calculateRS(raw_adc);
  float ratio = Rs / R0_MQ7;
  return 99.042 * pow(ratio, -1.518);  // CO ppm
}

void show_status(bool status) {
  if (status)
    Serial.println("✅ Data sent");
  else
    Firebase.printf("❌ Error: %s, Code: %d\n", aClient.lastError().message().c_str(), aClient.lastError().code());
}

// ==== Always Send Heartbeat ====
void sendHeartbeat() {
  unsigned long timestamp = time(nullptr);
  Serial.printf("💓 Heartbeat sent: timestamp = %lu\n", timestamp);
  bool status = Database.set<number_t>(aClient, "/AirQuality/timestamp", number_t((float)timestamp, 0));
  show_status(status);
}

// ==== Send Full Sensor Data with Averaging ====
void sendSensorData() {
  const int sampleCount = 5;
  const int sampleDelay = 200;

  float totalTemp = 0, totalHumid = 0, totalCO2 = 0, totalCO = 0;
  int totalVOC = 0;
  int totalMQ135_raw = 0, totalMQ7_raw = 0;
  uint16_t totalSRAW = 0;

  for (int i = 0; i < sampleCount; i++) {
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int mq135 = analogRead(MQ135);
    int mq7 = analogRead(MQ7);
    float co2 = getMQ135PPM(mq135);
    float co = getMQ7PPM(mq7);
    int voc = sgp.measureVocIndex(t, h);
    uint16_t sraw = sgp.measureRaw(t, h);

    if (!isnan(t) && !isnan(h)) {
      totalTemp += t;
      totalHumid += h;
      totalCO2 += co2;
      totalCO += co;
      totalVOC += voc;
      totalMQ135_raw += mq135;
      totalMQ7_raw += mq7;
      totalSRAW += sraw;
    }

    delay(sampleDelay);
  }

  float avgTemp = totalTemp / sampleCount;
  float avgHumid = totalHumid / sampleCount;
  float avgCO2 = totalCO2 / sampleCount;
  float avgCO = totalCO / sampleCount;
  int avgVOC = totalVOC / sampleCount;
  int avgMQ135_raw = totalMQ135_raw / sampleCount;
  int avgMQ7_raw = totalMQ7_raw / sampleCount;
  int avgSRAW = totalSRAW / sampleCount;

  unsigned long timestamp = time(nullptr);

  Serial.printf("📊 AVG Temp: %.2f°C, Humid: %.2f%%, CO2: %.2f ppm, CO: %.2f ppm, VOC: %d\n",
                avgTemp, avgHumid, avgCO2, avgCO, avgVOC);

  bool status;
  status = Database.set<number_t>(aClient, "/AirQuality/temp", number_t(avgTemp, 2)); show_status(status);
  status = Database.set<number_t>(aClient, "/AirQuality/humid", number_t(avgHumid, 2)); show_status(status);
  status = Database.set<int>(aClient, "/RawData/MQ135_raw", avgMQ135_raw); show_status(status);
  status = Database.set<int>(aClient, "/RawData/MQ7_raw", avgMQ7_raw); show_status(status);
  status = Database.set<number_t>(aClient, "/AirQuality/CO2_ppm", number_t(avgCO2, 2)); show_status(status);
  status = Database.set<number_t>(aClient, "/AirQuality/CO_ppm", number_t(avgCO, 2)); show_status(status);
  status = Database.set<int>(aClient, "/AirQuality/VOC", avgVOC); show_status(status);
  status = Database.set<int>(aClient, "/RawData/VOC_RAW", avgSRAW); show_status(status);
  status = Database.set<number_t>(aClient, "/AirQuality/last_data_push", number_t((float)timestamp, 0)); show_status(status);
  status = Database.set<number_t>(aClient, "/AirQuality/timestamp", number_t((float)timestamp, 0)); show_status(status);
}

// ==== Setup ====
void setup() {
  Serial.begin(115200);
  dht.begin();
  analogReadResolution(12);

  if (!sgp.begin()) {
    Serial.println("SGP40 sensor not found");
    while (1);
  }

  WiFiManager wm;
  if (!wm.autoConnect("Naqa_Setup")) {
    Serial.println("WiFi failed. Restarting...");
    ESP.restart();
  }

  Serial.println("Syncing time...");
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  while (time(nullptr) < 100000) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\n⏱ Time synced");

  Firebase.printf("Firebase Client v%s\n", FIREBASE_CLIENT_VERSION);
  set_ssl_client_insecure_and_buffer(ssl_client);
  initializeApp(aClient, app, getAuth(user_auth), auth_debug_print, "🔐 authTask");
  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);

  Serial.println("Warming up sensors...");
  delay(15000);
}

// ==== Loop ====
void loop() {
  app.loop();

  if (millis() - lastSent > sendInterval && app.ready()) {
    lastSent = millis();

    sendHeartbeat();

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    if (!isnan(t) && !isnan(h)) {
      temp = t;
      humd = h;
      sendSensorData();
    } else {
      Serial.println("⚠️ DHT failed. Heartbeat sent, skipping full upload.");
    }
  }
}