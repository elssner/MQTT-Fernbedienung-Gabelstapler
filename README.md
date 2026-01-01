
Diese Seite bei [https://elssner.github.io/MQTT-Fernbedienung-Gabelstapler/](https://elssner.github.io/MQTT-Fernbedienung-Gabelstapler/) öffnen.

## Calliope WLAN Fernbedienung (MQTT / IoT)

![](doc/DSC00693_Fernbedienung_512.JPG)

* Calliope v3 Projekt laden: [elssner/MQTT-Fernbedienung-Gabelstapler](https://elssner.github.io/MQTT-Fernbedienung-Gabelstapler/)
* WLAN Modul: [Cytron: Grove WiFi 8266 - IoT for micro:bit and beyond](doc/)
* Andere 8266 oder 8285 Module sind nicht geeignet.
* I²C Qwiic Joystick und LCD Display (Qwiic oder Grove) sind optional.

#### LED Farben
* `weiß` am Anfang eines Ereignisses (zeigt, dass Taste gedrückt wurde)
* `grün` bei OK nach einem AT-Kommando
* `rot` bei Fehler nach einem AT-Kommando
* `orange` Warnung
* `blau` Verbindung ist aktiv
* `a gelb` Gabelstapler mit Gesten steuern
* `c gelb` Verbindung getrennt (mit Knopf B)


### `a` beim Start
* `a weiß` serielle Schnittstelle wird initialisiert
* `a gelb` 2 Sekunden warten auf Stromversorgung
* LCD Display erkennen und initialisieren
* `b orange` wenn kein Display erkannt
* AT+RST (Reset WLAN Modul)
* `a grün` bei Erfolg `a rot` bei Fehler
* Anzeige der AT Response auf LCD Display

Jetzt sollte `a grün` leuchten und - wenn kein Display angeschlossen ist - `b orange`.

### `b` Kopf B geklickt
* WLAN verbinden <ins>wenn MQTT nicht verbunden</ins>
  * `b weiß` wenn Kopf B geklickt
  * WLAN verbinden (SSID und Password)
  * `b grün` bei Erfolg `b rot` bei Fehler
* MQTT trennen <ins>wenn MQTT verbunden</ins>
  * `a aus` und  `b aus`
  * <ins>MQTT trennen</ins>
  * `c gelb` bei Erfolg `c rot` bei Fehler
* Anzeige der AT Response auf LCD Display

Jetzt sollte beim Verbinden `a grün` und `b grün` leuchten.
Nach dem Trennen nur `c gelb`.

### `c` Kopf B halten
* `c weiß` Kopf B erkannt, loslassen
* MQTT Client vorbereiten (ID, Username, Password)
* `c rot` bei Fehler
* bei Erfolg
  * MQTT Client verbinden (IP Adresse, Port)
  * `c grün` bei Erfolg, `c orange` bei Fehler
  * <ins>MQTT ist verbunden</ins>
  * `a blau` wenn Gesten aktiviert
  * `b blau` wenn Joystick angeschlossen
* Anzeige der AT Response auf LCD Display

`c grün` MQTT verbunden und Fernbedienung bereit\
`b blinkt blau` Daten vom Joystick werden gesendet\
`a blau` Gesten für Omniwheels (mit *Kopf A geklickt* aktivieren)\
`a gelb` Gesten für Gabelstapler (mit *Kopf A+B geklickt* aktivieren)

> Gesten für Omniwheels funktionieren nur, wenn kein LCD Display angeschlossen ist.

### Kopf A geklickt
* wenn Display angeschlossen
  * die letzten 10 Response Strings im LCD Display anzeigen
  * mit jedem Klick auf A wird weiter geschaltet (nur vorwärts)
* wenn kein Display angeschlossen und <ins>MQTT verbunden</ins>
  * Gesten für Omniwheels abwechselnd an und aus schalten
  * `a lila` Geschwindigkeit beim Neigen langsamer
  * `a blau` Geschwindigkeit beim Neigen max (512)
  * `a aus` Gesten aus geschaltet

### Kopf A halten
* wenn Display angeschlossen
  * AT+MQTTCONN? MQTT Status abrufen und anzeigen
* wenn kein Display angeschlossen
  * den letzten Response String im Calliope Display anzeigen

### Kopf A+B geklickt
* Gesten für Gabelstapler an/aus schalten
* `a gelb` Gabelstapler aktiviert `a aus` Gesten aus geschaltet
* *nach vorne neigen* und *nach hinten neigen* schaltet den Gabelstapler Motor\
für 2,55 Sekunden an. Die Geste muss bis zur gewünschten Höhe wiederholt werden.

***nach links neigen* oder *nach rechts neigen* ändert das Verhalten vom Joystick**
* Geschwindigkeit von 512 reduziert: links geneigt=max 200; rechts geneigt=max 300
* (links/rechts geneigt) Joystick vor/zurück
  * Omniwheels rangieren mit Joystick synchron vor/zurück (keine Lenkung)
* (links/rechts geneigt) Joystick links/rechts
  * Omniwheels rangieren mit Joystick synchron links/rechts (keine Lenkung)

**ohne Neigung steuert der Joystick die Omniwheels normal, aber langsamer**
* Geschwindigkeit reduziert auf 40% (wenn Joystick am Anschlag)
* Fahren und Lenken; Joystick links/rechts: Drehen auf der Stelle (langsam)

### Joystick
* `b blinkt blau`
* Fahren und Lenken nach dem Prinzip Raupensteuerung.
* Die Räder vorn und hinten sind synchronisiert.
* Joystick nach rechts oder links: Drehen auf der Stelle.
* Joystick Button schaltet das I²C Relais und das Licht am Modell.

### Gesten (Calliope neigen, kippen, drehen)
* `a blau` bei Stop, `a magenta` beim Neigen
* `a rot` bei MQTT Publish Fehler
* wenn nach vorne neigen
* wenn nach hinten neigen
* wenn nach links neigen
* wenn nach rechts neigen
* wenn Display nach unten
* wenn Display nach oben

↶| |↷
---|---|---
↖|↑|↗
←|↯|→
↙|↓|↘

Modell fährt in die entsprechende Richtung. Die Tabelle zeigt alle möglichen Richtungen (8 gerade, 2 auf der Stelle drehen und Stop).
Dabei werden teilweise zwei aufeinander folgende Gesten ausgewertet (erst links/rechts neigen, dann vor/zurück oder nach unten drehen).

![](doc/DSC00693_1920.JPG)
