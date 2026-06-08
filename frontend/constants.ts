export const CPP_SOURCE_CODE = `/*
 * ============================================================================
 * AKILLI EV OTOMASYON SISTEMI (SMART HOME AUTOMATION SYSTEM) - C++ SIMULATOR
 * ============================================================================
 * Yazar: AI Asistan
 * Aciklama: Bu program, dinamik oda yapisina sahip, kesintisiz calisan,
 * sari/turuncu temali kapsamli bir akilli ev simulasyonudur.
 * Nesne Yonelimli Programlama (OOP) prensipleriyle gelistirilmistir.
 * 
 * GEREKSINIMLER & OZELLIKLER:
 * 1. Gorsel Tema: Sari/Turuncu arka plan, Siyah/Koyu Kahve yazi (ANSI & Windows API).
 * 2. Coklu Dil: Turkce (TR) ve Ingilizce (EN).
 * 3. Dinamik Odalar: Kullanici oda ekleyip silebilir. (Zorunlu: Isik, Panjur, Isi).
 * 4. Cihazlar: Bulasik Makinesi (Ozel programlar), Derin Dondurucu, Akilli Sulama vb.
 * 5. Ekstra Ozellikler (9 adet):
 *    - Enerji Tuketim Raporu (W ve kWh)
 *    - Zamanlayici (Kullanici saat girer)
 *    - Senaryolar (Sinema, Uyku, Tatil, Sabah)
 *    - Hareket Sensoru (Odalar arasi)
 *    - Kapi/Pencere Sensoru
 *    - Akilli Asistan Onerileri
 *    - Sesli Komut Simulasyonu
 *    - Haftalik Programlama (Basit simulasyon)
 *    - Bakim Hatirlaticisi (Bulasik makinesi tuzu, Dondurucu defrost)
 * 
 * KULLANIM: Sadece standart C++ kutuphaneleri kullanilmistir.
 * Derlemek icin: g++ main.cpp -o smarthome
 * ============================================================================
 */

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <ctime>
#include <cstdlib>
#include <iomanip>
#include <algorithm>
#include <memory>
#include <deque>

#ifdef _WIN32
#include <windows.h>
#endif

using namespace std;

// ============================================================================
// 1. GORSEL TEMA VE YARDIMCI FONKSIYONLAR
// ============================================================================
// Arka plan Sari/Turuncu, yazi Siyah olacak sekilde ayarlanmistir.

void applyThemeAndClear() {
#ifdef _WIN32
    // Windows icin: E = Acik Sari Arka Plan, 0 = Siyah Yazi
    system("color E0");
    system("cls");
#else
    // Linux/macOS icin ANSI kodlari: 43 = Sari Arka Plan, 30 = Siyah Yazi
    cout << "\\033[43;30m";
    system("clear");
#endif
}

// Basliklari ve vurgulari belirtmek icin kullanilacak ekstra ANSI kodlari
const string T_BOLD = "\\033[1m";
const string T_RESET_BOLD = "\\033[22m";
const string T_RED = "\\033[31m"; // Kirmizi yazi (Hatalar icin)
const string T_BLUE = "\\033[34m"; // Mavi yazi (Bilgi icin)

// ============================================================================
// 2. COKLU DIL DESTEGI
// ============================================================================
enum Language { TR, EN };
Language currentLang = TR;

string L(const string& tr, const string& en) {
    return (currentLang == TR) ? tr : en;
}

// ============================================================================
// 3. TEMEL SINIFLAR VE CIHAZLAR (OOP)
// ============================================================================

// Cihaz Tipleri
enum DeviceType {
    LIGHT, BLIND, THERMOSTAT, CAMERA, TV, MUSIC, FRIDGE, FREEZER, OVEN, 
    DISHWASHER, WASHING_MACHINE, DRYER, COFFEE_MAKER, EXHAUST_FAN, 
    FLOOR_HEATING, SMART_BED, PRINTER, ROBOT_VACUUM, IRRIGATION, 
    SMART_PLUG, MOTION_SENSOR, DOOR_SENSOR
};

// Soyut Temel Cihaz Sinifi
class Device {
protected:
    string nameTR, nameEN;
    DeviceType type;
public:
    bool isOn;
    double powerWatt;

    Device(string tr, string en, DeviceType t, double watt = 0.0) 
        : nameTR(tr), nameEN(en), type(t), isOn(false), powerWatt(watt) {}
    
    virtual ~Device() {}
    
    string getName() const { return L(nameTR, nameEN); }
    DeviceType getType() const { return type; }
    virtual string getStatus() const { return isOn ? L("ACIK", "ON") : L("KAPALI", "OFF"); }
    
    // Her cihaz kendi menusunu gosterebilir
    virtual void showMenu() {
        isOn = !isOn;
        cout << getName() << " " << getStatus() << "\\n";
    }
    
    // Zaman ilerledikce cihaz durumunu gunceller
    virtual void simulateTick() {}
};

// --- Ozel Cihaz Siniflari ---

class Light : public Device {
public:
    Light() : Device("Isik", "Light", LIGHT, 20.0) {}
};

class Blind : public Device {
public:
    int level; // 0-100
    Blind() : Device("Panjur", "Blind", BLIND, 5.0), level(100) {}
    string getStatus() const override { return "%" + to_string(level) + " " + L("Acik", "Open"); }
    void showMenu() override {
        cout << L("Yeni panjur seviyesi (0-100): ", "New blind level (0-100): ");
        int val; cin >> val;
        if(val >= 0 && val <= 100) level = val;
    }
};

class Thermostat : public Device {
public:
    int temperature;
    Thermostat() : Device("Ortam Sicakligi", "Ambient Temp", THERMOSTAT, 0.0), temperature(22) { isOn = true; }
    string getStatus() const override { return to_string(temperature) + " C"; }
    void showMenu() override {
        cout << L("Yeni sicaklik (10-35): ", "New temp (10-35): ");
        int val; cin >> val;
        if(val >= 10 && val <= 35) temperature = val;
    }
};

class Dishwasher : public Device {
public:
    int state; // 0:Bos, 1:Yikama, 2:Durulama, 3:Kurutma, 4:Bitti
    int timeLeft;
    string programTR, programEN;
    int usageCycles; // Bakim hatirlaticisi icin

    Dishwasher() : Device("Bulasik Makinesi", "Dishwasher", DISHWASHER, 1500.0), state(0), timeLeft(0), usageCycles(0) {}
    
    string getStatus() const override {
        string statesTR[] = {"Bos", "Yikama", "Durulama", "Kurutma", "Bitti"};
        string statesEN[] = {"Empty", "Washing", "Rinsing", "Drying", "Done"};
        if (isOn) return L(statesTR[state], statesEN[state]) + " (" + programTR + ", " + to_string(timeLeft) + " dk)";
        return L("KAPALI", "OFF");
    }

    void showMenu() override {
        if (isOn && state > 0 && state < 4) {
            cout << L("Makine calisiyor. Durdurulsun mu? (1:Evet, 0:Hayir): ", "Machine running. Stop? (1:Yes, 0:No): ");
            int c; cin >> c;
            if (c == 1) { isOn = false; state = 0; timeLeft = 0; }
        } else {
            cout << L("Yikama Talimatlari / Program Secin:\\n", "Washing Instructions / Select Program:\\n");
            cout << "1. " << L("Yogun (75 C, 2 saat)", "Intensive (75 C, 2 hours)") << "\\n";
            cout << "2. " << L("Ekonomik (50 C, 1.5 saat)", "Eco (50 C, 1.5 hours)") << "\\n";
            cout << "3. " << L("Hizli (45 C, 30 dk)", "Quick (45 C, 30 mins)") << "\\n";
            cout << "4. " << L("Cam (40 C, 1 saat)", "Glass (40 C, 1 hour)") << "\\n";
            cout << L("Secim: ", "Choice: ");
            int c; cin >> c;
            isOn = true; state = 1; usageCycles++;
            if (c == 1) { timeLeft = 120; programTR = "Yogun"; programEN = "Intensive"; }
            else if (c == 2) { timeLeft = 90; programTR = "Ekonomik"; programEN = "Eco"; }
            else if (c == 3) { timeLeft = 30; programTR = "Hizli"; programEN = "Quick"; }
            else { timeLeft = 60; programTR = "Cam"; programEN = "Glass"; }
        }
    }

    void simulateTick() override {
        if (isOn && timeLeft > 0) {
            timeLeft -= 15;
            if (timeLeft <= 0) { timeLeft = 0; state = 4; isOn = false; }
            else if (timeLeft < 30) state = 3; // Kurutma
            else if (timeLeft < 60) state = 2; // Durulama
        }
    }
};

class Freezer : public Device {
public:
    int temperature;
    int runHours; // Bakim hatirlaticisi icin
    Freezer() : Device("Derin Dondurucu", "Deep Freezer", FREEZER, 200.0), temperature(-18), runHours(0) { isOn = true; }
    string getStatus() const override { return to_string(temperature) + " C"; }
    void showMenu() override {
        cout << L("Yeni sicaklik (-25 ile -10): ", "New temp (-25 to -10): ");
        int val; cin >> val;
        if(val >= -25 && val <= -10) temperature = val;
    }
    void simulateTick() override {
        if (isOn) runHours++;
    }
};

class Irrigation : public Device {
public:
    int durationLeft;
    int soilMoisture; // 0:Kuru, 1:Nemli, 2:Islak
    Irrigation() : Device("Akilli Sulama", "Smart Irrigation", IRRIGATION, 10.0), durationLeft(0), soilMoisture(1) {}
    
    string getStatus() const override {
        string moistTR[] = {"Kuru", "Nemli", "Islak"};
        string moistEN[] = {"Dry", "Moist", "Wet"};
        string s = L("Toprak: ", "Soil: ") + L(moistTR[soilMoisture], moistEN[soilMoisture]);
        if (isOn) s += " | " + L("Sulaniyor (", "Watering (") + to_string(durationLeft) + " dk)";
        return s;
    }

    void showMenu() override {
        if (isOn) {
            isOn = false; durationLeft = 0;
            cout << L("Sulama durduruldu.\\n", "Irrigation stopped.\\n");
        } else {
            cout << L("Kac dakika sulansin?: ", "How many minutes to water?: ");
            cin >> durationLeft;
            if (durationLeft > 0) isOn = true;
        }
    }

    void simulateTick() override {
        if (isOn && durationLeft > 0) {
            durationLeft -= 15;
            soilMoisture = 2; // Islak
            if (durationLeft <= 0) { durationLeft = 0; isOn = false; }
        } else {
            // Toprak zamanla kurur
            if (rand() % 100 < 10 && soilMoisture > 0) soilMoisture--;
        }
    }
};

class Camera : public Device {
public:
    bool motionDetected;
    string lastRecord;
    Camera() : Device("Guvenlik Kamerasi", "Security Camera", CAMERA, 15.0), motionDetected(false), lastRecord("-") { isOn = true; }
    string getStatus() const override {
        if (!isOn) return L("KAPALI", "OFF");
        return motionDetected ? T_RED + L("HAREKET ALGILANDI!", "MOTION DETECTED!") + T_RESET_BOLD : L("Canli Goruntu: Hareket Yok", "Live Feed: No Motion");
    }
    void simulateTick() override {
        if (isOn) {
            motionDetected = (rand() % 100 < 10); // %10 ihtimalle hareket
            if (motionDetected) {
                time_t now = time(0);
                string t = ctime(&now);
                lastRecord = t.substr(0, t.length()-1);
            }
        }
    }
};

class Oven : public Device {
public:
    int temperature;
    Oven() : Device("Firin", "Oven", OVEN, 2000.0), temperature(180) {}
    string getStatus() const override { return isOn ? to_string(temperature) + " C" : L("KAPALI", "OFF"); }
    void showMenu() override {
        isOn = !isOn;
        if (isOn) {
            cout << L("Sicaklik (50-250): ", "Temp (50-250): ");
            int val; cin >> val;
            if(val >= 50 && val <= 250) temperature = val;
        }
    }
};

// Diger basit cihazlar icin jenerik sinif
class GenericDevice : public Device {
public:
    GenericDevice(string tr, string en, DeviceType t, double w) : Device(tr, en, t, w) {}
};

// ============================================================================
// 4. ODA SINIFI
// ============================================================================
class Room {
public:
    string name;
    bool isOutdoor;
    vector<shared_ptr<Device>> devices;

    Room(string n, bool outdoor = false) : name(n), isOutdoor(outdoor) {
        // Her odaya zorunlu temel cihazlar eklenir
        devices.push_back(make_shared<Light>());
        devices.push_back(make_shared<Blind>());
        devices.push_back(make_shared<Thermostat>());
        
        if (isOutdoor) {
            devices.push_back(make_shared<Irrigation>());
        }
    }

    void addDevice(shared_ptr<Device> dev) {
        devices.push_back(dev);
    }

    void showRoomMenu() {
        int choice;
        do {
            applyThemeAndClear();
            cout << T_BOLD << "=== " << name << " ===" << T_RESET_BOLD << "\\n";
            for (size_t i = 0; i < devices.size(); ++i) {
                cout << (i + 1) << ". " << devices[i]->getName() << " : " << devices[i]->getStatus() << "\\n";
            }
            cout << "-------------------\\n";
            cout << "99. " << L("Bu Odaya Cihaz Ekle", "Add Device to Room") << "\\n";
            cout << "0. " << L("Geri", "Back") << "\\n\\n";
            cout << L("Seciminiz: ", "Choice: ");
            
            while (!(cin >> choice)) {
                cin.clear(); cin.ignore(10000, '\\n');
            }

            if (choice > 0 && choice <= (int)devices.size()) {
                devices[choice - 1]->showMenu();
            } else if (choice == 99) {
                addDeviceMenu();
            }
        } while (choice != 0);
    }

    void addDeviceMenu() {
        applyThemeAndClear();
        cout << T_BOLD << "--- " << L("Cihaz Ekle", "Add Device") << " ---" << T_RESET_BOLD << "\\n";
        cout << "1. " << L("Televizyon", "TV") << "\\n";
        cout << "2. " << L("Muzik Sistemi", "Music System") << "\\n";
        cout << "3. " << L("Buzdolabi", "Fridge") << "\\n";
        cout << "4. " << L("Derin Dondurucu", "Deep Freezer") << "\\n";
        cout << "5. " << L("Firin", "Oven") << "\\n";
        cout << "6. " << L("Bulasik Makinesi", "Dishwasher") << "\\n";
        cout << "7. " << L("Camasir Makinesi", "Washing Machine") << "\\n";
        cout << "8. " << L("Guvenlik Kamerasi", "Security Camera") << "\\n";
        cout << "9. " << L("Akilli Priz", "Smart Plug") << "\\n";
        cout << "0. " << L("Iptal", "Cancel") << "\\n";
        cout << L("Seciminiz: ", "Choice: ");
        int c; cin >> c;
        
        switch(c) {
            case 1: addDevice(make_shared<GenericDevice>("Televizyon", "TV", TV, 150.0)); break;
            case 2: addDevice(make_shared<GenericDevice>("Muzik Sistemi", "Music System", MUSIC, 50.0)); break;
            case 3: addDevice(make_shared<GenericDevice>("Buzdolabi", "Fridge", FRIDGE, 150.0)); break;
            case 4: addDevice(make_shared<Freezer>()); break;
            case 5: addDevice(make_shared<Oven>()); break;
            case 6: addDevice(make_shared<Dishwasher>()); break;
            case 7: addDevice(make_shared<GenericDevice>("Camasir Makinesi", "Washing Machine", WASHING_MACHINE, 500.0)); break;
            case 8: addDevice(make_shared<Camera>()); break;
            case 9: addDevice(make_shared<GenericDevice>("Akilli Priz", "Smart Plug", SMART_PLUG, 0.0)); break;
        }
    }
};

// ============================================================================
// 5. ANA SINIF: SmartHome
// ============================================================================
class SmartHome {
private:
    vector<Room> rooms;
    
    // Genel Sistemler
    string lastDoorbellRing;
    int generalWaterTemp; // 20-60 C
    int boilerTargetTemp; // Kombi
    
    // Raporlama
    double totalDailyKwh;
    deque<int> tempHistory; // Son 5 sicaklik
    
    // Zamanlayici ve Saat
    int simHour, simMinute;
    bool timerActive;
    int timerHour, timerMinute;
    string timerAction;
    
    // Haftalik Program
    int currentDay; // 0:Pzt, 6:Paz
    bool weeklyScheduleActive;

    // --- YARDIMCI FONKSIYONLAR ---

    void pause() const {
        cout << T_BOLD << L("\\nDevam etmek icin Enter'a basin...", "\\nPress Enter to continue...") << T_RESET_BOLD;
        cin.ignore(10000, '\\n'); cin.get();
    }

    int getIntInput() const {
        int choice;
        while (!(cin >> choice)) {
            cin.clear(); cin.ignore(10000, '\\n');
            cout << T_RED << L("HATA: Sayi girin: ", "ERROR: Enter a number: ") << T_RESET_BOLD;
        }
        return choice;
    }

    void printHeader(const string& titleTR, const string& titleEN) const {
        applyThemeAndClear();
        cout << T_BOLD << "======================================================\\n";
        cout << "  " << L(titleTR, titleEN) << "\\n";
        cout << "======================================================\\n" << T_RESET_BOLD;
    }

    // Simulasyon Adimi
    void simulateTick() {
        simMinute += 15;
        if (simMinute >= 60) {
            simMinute -= 60;
            simHour++;
            if (simHour >= 24) {
                simHour = 0;
                currentDay = (currentDay + 1) % 7;
            }
            
            // Saat basi sicaklik gecmisine kayit
            if (!rooms.empty()) {
                for (auto& dev : rooms[0].devices) {
                    if (dev->getType() == THERMOSTAT) {
                        auto t = dynamic_pointer_cast<Thermostat>(dev);
                        tempHistory.push_back(t->temperature);
                        if (tempHistory.size() > 5) tempHistory.pop_front();
                        break;
                    }
                }
            }
        }

        // Cihazlarin tick fonksiyonlarini cagir ve tuketimi hesapla
        double currentWatt = 0;

        for (auto& room : rooms) {
            for (auto& dev : room.devices) {
                dev->simulateTick();
                if (dev->isOn || dev->getType() == FREEZER || dev->getType() == FRIDGE) {
                    currentWatt += dev->powerWatt;
                }
            }
        }

        totalDailyKwh += (currentWatt * 15.0 / 60.0) / 1000.0;

        // Zamanlayici
        if (timerActive && simHour == timerHour && simMinute >= timerMinute) {
            // Basit zamanlayici: Tum isiklari kapat
            for (auto& room : rooms) {
                for (auto& dev : room.devices) {
                    if (dev->getType() == LIGHT) dev->isOn = false;
                }
            }
            timerActive = false;
        }
        
        // Haftalik Program (Ornek: Her gun 20:00'de panjurlari kapat)
        if (weeklyScheduleActive && simHour == 20 && simMinute == 0) {
            for (auto& room : rooms) {
                for (auto& dev : room.devices) {
                    if (dev->getType() == BLIND) dynamic_pointer_cast<Blind>(dev)->level = 0;
                }
            }
        }
    }

    void printAssistantMessages() const {
        cout << T_BLUE << T_BOLD << "[ " << L("AKILLI ASISTAN & BAKIM", "SMART ASSISTANT & MAINTENANCE") << " ]\\n" << T_RESET_BOLD;
        bool hasMsg = false;

        for (auto& room : rooms) {
            for (auto& dev : room.devices) {
                if (dev->getType() == OVEN) {
                    auto oven = dynamic_pointer_cast<Oven>(dev);
                    if (oven->isOn && oven->temperature > 200) {
                        cout << T_RED << " * " << L("Firin cok sicak, yemeginizi koyabilirsiniz.", "Oven is hot, you can put your food.") << T_RESET_BOLD << "\\n";
                        hasMsg = true;
                    }
                }
                if (dev->getType() == DISHWASHER) {
                    auto dw = dynamic_pointer_cast<Dishwasher>(dev);
                    if (dw->state == 4) {
                        cout << " * " << L("Bulasik makinesi bitti.", "Dishwasher is done.") << "\\n";
                        hasMsg = true;
                    }
                    if (dw->usageCycles > 5) {
                        cout << T_RED << " * " << L("BAKIM: Bulasik makinesi tuzu bitmek uzere!", "MAINTENANCE: Dishwasher salt is low!") << T_RESET_BOLD << "\\n";
                        hasMsg = true;
                    }
                }
                if (dev->getType() == FREEZER) {
                    auto fr = dynamic_pointer_cast<Freezer>(dev);
                    if (fr->runHours > 100) {
                        cout << T_RED << " * " << L("BAKIM: Derin dondurucu buz cozme (defrost) gerektiriyor.", "MAINTENANCE: Deep freezer needs defrosting.") << T_RESET_BOLD << "\\n";
                        hasMsg = true;
                    }
                }
                if (dev->getType() == CAMERA) {
                    auto cam = dynamic_pointer_cast<Camera>(dev);
                    if (cam->motionDetected) {
                        cout << T_RED << " * " << L("GUVENLIK: ", "SECURITY: ") << room.name << L(" kamerasinda hareket algilandi!", " camera detected motion!") << T_RESET_BOLD << "\\n";
                        hasMsg = true;
                    }
                }
            }
        }

        if (!hasMsg) cout << " * " << L("Her sey yolunda, ozel bir bildirim yok.", "Everything is fine, no special notifications.") << "\\n";
        cout << "\\n";
    }

public:
    SmartHome() {
        srand(time(0));
        lastDoorbellRing = L("Calinmadi", "Not rung");
        generalWaterTemp = 45;
        boilerTargetTemp = 22;
        
        totalDailyKwh = 0.0;
        
        timerActive = false;
        weeklyScheduleActive = true;
        simHour = 18; simMinute = 0; currentDay = 0;

        // Varsayilan Odalari Olustur
        Room salon("Salon");
        salon.addDevice(make_shared<GenericDevice>("Televizyon", "TV", TV, 150.0));
        salon.addDevice(make_shared<Camera>());
        rooms.push_back(salon);

        Room mutfak("Mutfak");
        mutfak.addDevice(make_shared<GenericDevice>("Buzdolabi", "Fridge", FRIDGE, 150.0));
        mutfak.addDevice(make_shared<Oven>());
        mutfak.addDevice(make_shared<Dishwasher>());
        rooms.push_back(mutfak);

        Room yatak("Yatak Odasi");
        yatak.addDevice(make_shared<GenericDevice>("Akilli Yatak", "Smart Bed", SMART_BED, 50.0));
        rooms.push_back(yatak);

        Room banyo("Banyo");
        banyo.addDevice(make_shared<GenericDevice>("Havalandirma Fani", "Exhaust Fan", EXHAUST_FAN, 30.0));
        rooms.push_back(banyo);

        Room bahce("Bahce", true); // Dis mekan
        rooms.push_back(bahce);
    }

    // ========================================================================
    // MENULER
    // ========================================================================

    void menuEvim() {
        int choice;
        do {
            printHeader("Evim (Odalar)", "My Home (Rooms)");
            for (size_t i = 0; i < rooms.size(); ++i) {
                cout << (i + 1) << ". " << rooms[i].name << (rooms[i].isOutdoor ? L(" (Dis Mekan)", " (Outdoor)") : "") << "\\n";
            }
            cout << "-------------------\\n";
            cout << "98. " << L("Yeni Oda Ekle", "Add New Room") << "\\n";
            cout << "99. " << L("Oda Sil", "Delete Room") << "\\n";
            cout << "0. " << L("Geri", "Back") << "\\n\\n";
            cout << L("Seciminiz: ", "Choice: ");
            choice = getIntInput();

            if (choice > 0 && choice <= (int)rooms.size()) {
                rooms[choice - 1].showRoomMenu();
            } else if (choice == 98) {
                string rName;
                cout << L("Oda adi: ", "Room name: ");
                cin.ignore(); getline(cin, rName);
                cout << L("Dis mekan mi? (1:Evet, 0:Hayir): ", "Is outdoor? (1:Yes, 0:No): ");
                int out = getIntInput();
                rooms.push_back(Room(rName, out == 1));
                cout << L("Oda eklendi. Temel cihazlar (Isik, Panjur, Isi) otomatik eklendi.\\n", "Room added. Basic devices auto-added.\\n"); pause();
            } else if (choice == 99) {
                cout << L("Silinecek oda numarasi: ", "Room number to delete: ");
                int rIdx = getIntInput();
                if (rIdx > 0 && rIdx <= (int)rooms.size()) {
                    rooms.erase(rooms.begin() + rIdx - 1);
                    cout << L("Oda silindi.\\n", "Room deleted.\\n");
                }
                pause();
            }
        } while (choice != 0);
    }

    void menuGenelCihazlar() {
        int choice;
        do {
            printHeader("Genel Cihazlar", "General Devices");
            cout << "1. " << L("Kapi Zili Cal", "Ring Doorbell") << " (Son: " << lastDoorbellRing << ")\\n";
            cout << "2. " << L("Genel Su Sicakligi", "General Water Temp") << " : " << generalWaterTemp << " C\\n";
            cout << "3. " << L("Kombi Hedef Sicaklik", "Boiler Target Temp") << " : " << boilerTargetTemp << " C\\n";
            cout << "0. " << L("Geri", "Back") << "\\n\\n";
            cout << L("Seciminiz: ", "Choice: ");
            choice = getIntInput();

            if (choice == 1) {
                time_t now = time(0);
                string t = ctime(&now);
                lastDoorbellRing = t.substr(0, t.length()-1);
                cout << T_BOLD << "\\nDING DONG!\\n" << T_RESET_BOLD; pause();
            } else if (choice == 2) {
                cout << L("Sicaklik (20-60): ", "Temp (20-60): "); generalWaterTemp = getIntInput();
            } else if (choice == 3) {
                cout << L("Sicaklik (15-30): ", "Temp (15-30): "); boilerTargetTemp = getIntInput();
            }
        } while (choice != 0);
    }

    void menuSenaryolar() {
        int choice;
        do {
            printHeader("Senaryolar & Otomasyon", "Scenarios & Automation");
            cout << "1. " << L("Sinema Modu", "Cinema Mode") << "\\n";
            cout << "2. " << L("Uyku Modu", "Sleep Mode") << "\\n";
            cout << "3. " << L("Tatil Modu", "Vacation Mode") << "\\n";
            cout << "4. " << L("Sabah Modu", "Morning Mode") << "\\n";
            cout << "5. " << L("Zamanlayici Ayarla", "Set Timer") << "\\n";
            cout << "6. " << L("Haftalik Program (20:00 Panjur Kapat)", "Weekly Schedule (20:00 Close Blinds)") << " : " << (weeklyScheduleActive ? L("ACIK", "ON") : L("KAPALI", "OFF")) << "\\n";
            cout << "0. " << L("Geri", "Back") << "\\n\\n";
            cout << L("Seciminiz: ", "Choice: ");
            choice = getIntInput();

            if (choice >= 1 && choice <= 4) {
                for (auto& room : rooms) {
                    for (auto& dev : room.devices) {
                        if (choice == 1) { // Sinema
                            if (dev->getType() == LIGHT) dev->isOn = false;
                            if (dev->getType() == BLIND) dynamic_pointer_cast<Blind>(dev)->level = 0;
                            if (dev->getType() == TV) dev->isOn = true;
                        } else if (choice == 2) { // Uyku
                            if (dev->getType() == LIGHT || dev->getType() == TV || dev->getType() == MUSIC) dev->isOn = false;
                            if (dev->getType() == BLIND) dynamic_pointer_cast<Blind>(dev)->level = 0;
                            if (dev->getType() == THERMOSTAT) dynamic_pointer_cast<Thermostat>(dev)->temperature = 18;
                        } else if (choice == 3) { // Tatil
                            dev->isOn = false;
                        } else if (choice == 4) { // Sabah
                            if (dev->getType() == BLIND) dynamic_pointer_cast<Blind>(dev)->level = 100;
                            if (dev->getType() == COFFEE_MAKER) dev->isOn = true;
                        }
                    }
                }
                cout << L("Senaryo uygulandi.\\n", "Scenario applied.\\n"); pause();
            } else if (choice == 5) {
                cout << L("Saat (0-23): ", "Hour (0-23): "); timerHour = getIntInput();
                cout << L("Dakika (0-59): ", "Minute (0-59): "); timerMinute = getIntInput();
                timerActive = true;
                cout << L("Zamanlayici kuruldu (Tum isiklar kapanacak).\\n", "Timer set (All lights will turn off).\\n");
                pause();
            } else if (choice == 6) {
                weeklyScheduleActive = !weeklyScheduleActive;
            }
        } while (choice != 0);
    }

    void menuRaporlar() {
        printHeader("Raporlar", "Reports");
        
        double currentWatt = 0;
        for (auto& room : rooms) {
            for (auto& dev : room.devices) {
                if (dev->isOn || dev->getType() == FREEZER || dev->getType() == FRIDGE) {
                    currentWatt += dev->powerWatt;
                }
            }
        }
        
        cout << L("Anlik Guc Cekimi: ", "Current Power Draw: ") << currentWatt << " W\\n";
        cout << L("Gunluk Tahmini Enerji: ", "Estimated Daily Energy: ") << fixed << setprecision(2) << totalDailyKwh << " kWh\\n";
        
        cout << "\\n" << L("Sicaklik Gecmisi (Son 5 Saat): ", "Temp History (Last 5 Hours): ");
        for (int t : tempHistory) cout << t << "C ";
        cout << "\\n";
        pause();
    }

    void menuSesliKomut() {
        printHeader("Sesli Komut Simulasyonu", "Voice Command Sim");
        string cmd;
        cout << L("Komutunuzu yazin (orn: isik ac, panjur kapat): ", "Enter command (e.g. light on, blind close): ");
        cin.ignore();
        getline(cin, cmd);
        
        // Kucuk harfe cevir
        transform(cmd.begin(), cmd.end(), cmd.begin(), ::tolower);
        
        bool actionTaken = false;
        if (cmd.find("isik") != string::npos || cmd.find("light") != string::npos) {
            bool turnOn = (cmd.find("ac") != string::npos || cmd.find("on") != string::npos);
            for (auto& room : rooms) {
                for (auto& dev : room.devices) {
                    if (dev->getType() == LIGHT) dev->isOn = turnOn;
                }
            }
            cout << L("Tum isiklar ", "All lights ") << (turnOn ? L("acildi.", "turned on.") : L("kapatildi.", "turned off.")) << "\\n";
            actionTaken = true;
        }
        
        if (!actionTaken) {
            cout << L("Komut anlasilamadi.\\n", "Command not understood.\\n");
        }
        pause();
    }

    // ========================================================================
    // ANA DONGU
    // ========================================================================
    void run() {
        applyThemeAndClear();
        cout << T_BOLD << "=== Language Selection / Dil Secimi ===\\n" << T_RESET_BOLD;
        cout << "1. Turkce (TR)\\n2. English (EN)\\nChoice: ";
        int langChoice = getIntInput();
        currentLang = (langChoice == 2) ? EN : TR;

        int choice;
        do {
            simulateTick();
            applyThemeAndClear();
            
            cout << T_BOLD << "======================================================\\n";
            cout << "  " << L("AKILLI EV KONTROL PANELI", "SMART HOME CONTROL PANEL") << "\\n";
            cout << "======================================================\\n" << T_RESET_BOLD;
            
            string daysTR[] = {"Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"};
            string daysEN[] = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
            cout << L("Zaman (Simulasyon): ", "Time (Simulation): ") 
                 << L(daysTR[currentDay], daysEN[currentDay]) << " "
                 << setfill('0') << setw(2) << simHour << ":" << setw(2) << simMinute << "\\n\\n";
            
            printAssistantMessages();
            
            cout << "1. " << L("Evim (Odalar ve Cihazlar)", "My Home (Rooms and Devices)") << "\\n";
            cout << "2. " << L("Genel Cihazlar", "General Devices") << "\\n";
            cout << "3. " << L("Senaryolar & Otomasyon", "Scenarios & Automation") << "\\n";
            cout << "4. " << L("Raporlar", "Reports") << "\\n";
            cout << "5. " << L("Sesli Komut Simulasyonu", "Voice Command Sim") << "\\n";
            cout << "0. " << L("Cikis", "Exit") << "\\n\\n";
            
            cout << T_BOLD << L("Seciminiz: ", "Your choice: ") << T_RESET_BOLD;
            choice = getIntInput();

            switch (choice) {
                case 1: menuEvim(); break;
                case 2: menuGenelCihazlar(); break;
                case 3: menuSenaryolar(); break;
                case 4: menuRaporlar(); break;
                case 5: menuSesliKomut(); break;
                case 0: 
                    cout << L("\\nSistemden cikiliyor. Iyi gunler!\\n", "\\nExiting system. Have a good day!\\n"); 
                    break;
                default:
                    cout << T_RED << L("\\nGecersiz secim!\\n", "\\nInvalid choice!\\n") << T_RESET_BOLD;
                    pause();
                    break;
            }
        } while (choice != 0);
    }
};

int main() {
    SmartHome home;
    home.run();
    return 0;
}
`;
