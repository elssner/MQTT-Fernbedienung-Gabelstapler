
Diese Seite bei [https://elssner.github.io/MQTT-Fernbedienung/](https://elssner.github.io/MQTT-Fernbedienung/) öffnen

## Calliope WLAN Fernbedienung (MQTT / IoT)

![](doc/DSC00693_Fernbedienung_512.JPG)

* Calliope v3 Projekt laden: [elssner/MQTT-Fernbedienung](https://elssner.github.io/MQTT-Fernbedienung/)
* WLAN Modul: [Cytron: Grove WiFi 8266 - IoT for micro:bit and beyond](doc/)
* Andere 8266 oder 8285 Module sind nicht geeignet.
* I²C Qwiic Joystick und LCD Display (Qwiic oder Grove) sind optional.

#### LED Farben
* `weiß` am Anfang eines Ereignisses (zeigt, dass Taste gedrückt wurde)
* `grün` bei OK nach einem AT-Kommando
* `rot` bei Fehler nach einem AT-Kommando
* `orange` Warnung
* `blau` Verbindung ist aktiv
* `gelb` Verbindung getrennt (mit Knopf B)


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

`c grün` zeigt an, dass MQTT verbunden und die Fernbedienung bereit ist.\
`b blinkt blau`, wenn die Daten vom Joystick gesendet werden.\
`a blau`, wenn die Gesten gesendet werden (muss noch aktiviert werden).

> Gesten funktionieren nur, wenn kein LCD Display angeschlossen ist.

### Kopf A geklickt
* wenn Display angeschlossen
  * die letzten 10 Response Strings im LCD Display anzeigen
  * mit jedem Klick auf A wird weiter geschaltet (nur vorwärts)
* wenn kein Display angeschlossen und <ins>MQTT verbunden</ins>
  * Gesten abwechselnd an und aus schalten
  * `a lila` Geschwindigkeit beim Neigen langsamer
  * `a blau` Geschwindigkeit beim Neigen max (512)
  * `a aus` Gesten aus geschaltet

### Kopf A halten
* wenn Display angeschlossen
  * AT+MQTTCONN? MQTT Status abrufen und anzeigen
* wenn kein Display angeschlossen
  * den letzten Response String im Calliope Display anzeigen

### Kopf A+B geklickt
* zur Zeit nicht verwendet

### Joystick
* `b blinkt blau`
* Fahren und Lenken nach dem Prinzip Raupensteuerung.
* Die linken Räder und die rechten Räder sind jeweils synchronisiert.
* Joystick nach rechts oder links: Drehen auf der Stelle.
* Joystick Button schaltet das I²C Relais und das Licht am Modell.

### Gesten (Calliope neigen, kippen, drehen)
* `a blau` bei Stop, `a aus` beim Neigen
* `a rot` bei MQTT Publish Fehler
* wenn Logo nach unten
* wenn Logo nach oben
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



> Diese Seite bei [https://elssner.github.io/mqtt-fernbedienung-gabelstapler/](https://elssner.github.io/mqtt-fernbedienung-gabelstapler/) öffnen

## Als Erweiterung verwenden

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Neues Projekt**
* klicke auf **Erweiterungen** unter dem Zahnrad-Menü
* nach **https://github.com/elssner/mqtt-fernbedienung-gabelstapler** suchen und importieren

## Dieses Projekt bearbeiten

Um dieses Repository in MakeCode zu bearbeiten.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Importieren** und dann auf **Importiere URL**
* füge **https://github.com/elssner/mqtt-fernbedienung-gabelstapler** ein und klicke auf Importieren

#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
