input.onGesture(Gesture.TiltRight, function () {
    richtung = "_right"
    neigen()
})
function neigen () {
    if (g_status == 1) {
        mqtt_publish_bt("bt" + richtung, bt_speed)
    } else {
        g_status += 1
        mqtt_publish_bt("bt_stop", 0)
    }
}
input.onGesture(Gesture.ScreenDown, function () {
    g_status += 2
    mqtt_publish_bt("bt_turn" + richtung, bt_speed)
})
function mqtt_publish_joystick () {
    pins.read_joystick()
    if (last_joystick_button != "1" && pins.get_button_on_off()) {
        mqtt_publish_relay("1")
    } else if (last_joystick_button != "0" && !(pins.get_button_on_off())) {
        mqtt_publish_relay("0")
    }
    if (joystick_fahren == pins.get_x() && joystick_lenken == pins.get_y()) {
        pins.comment(pins.pins_text("wenn nichts geändert, kein Publish"))
    } else {
        i_payload += 1
        if (serial.mqtt_publish("topic", serial.string_join(";", i_payload, "j", pins.get_x(), pins.get_y()))) {
            pins.comment(pins.pins_text("wenn Publish erfolgreich, x y Werte speichern"))
            joystick_fahren = pins.get_x()
            joystick_lenken = pins.get_y()
        } else {
            pins.comment(pins.pins_text("wenn Publish false, nach Pause noch mal versuchen"))
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.b), 0xff0000)
            basic.pause(200)
        }
        lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
    }
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (!(lcd.get_display(lcd.eDisplay.none))) {
        lcd.write_array(serial.get_response(), lcd.eINC.inc1)
    } else if (mqtt_connected) {
        gesten = !(gesten)
        if (gesten && bt_speed == 384) {
            bt_speed = 512
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.a), 0x0000ff)
        } else if (gesten) {
            bt_speed = 384
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.a), 0x7f00ff)
        } else {
            mqtt_publish_stop_a_aus()
        }
    }
})
input.onGesture(Gesture.TiltLeft, function () {
    richtung = "_left"
    neigen()
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (!(mqtt_connected)) {
        basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.b), 0xffffff)
        basic.setLedColors2(basic.basicv3_rgbled(basic.eRGBLED.b), 0xff0000, serial.wifi_connect("TXT4.0-sWp6", "ozvTwHC7"), 0x00FF00)
    } else {
        mqtt_connected = false
        mqtt_publish_stop_a_aus()
        basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.b), Colors.Off)
        basic.setLedColors2(basic.basicv3_rgbled(basic.eRGBLED.c), 0xff0000, serial.at_command(serial.serial_eAT(serial.eAT_commands.at_mqttclean), 2), 0xffff00)
    }
    lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
})
input.onGesture(Gesture.LogoDown, function () {
    g_status += 2
    mqtt_publish_bt("bt_fw" + richtung, bt_speed)
})
function mqtt_publish_stop_a_aus () {
    i_payload += 1
    basic.setLedColors2(basic.basicv3_rgbled(basic.eRGBLED.a), 0xff0000, serial.mqtt_publish("topic", serial.string_join(";", i_payload, "bt_stop", 0)), 0x000000)
    lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
}
input.onButtonEvent(Button.A, input.buttonEventValue(ButtonEvent.Hold), function () {
    if (!(lcd.get_display(lcd.eDisplay.none))) {
        if (serial.at_command(serial.serial_eAT(serial.eAT_commands.at_mqttconn), 5)) {
            lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
        }
    } else {
        basic.showString("" + (serial.get_response()[serial.get_response_index()]))
    }
})
input.onButtonEvent(Button.B, input.buttonEventValue(ButtonEvent.Hold), function () {
    basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.c), 0xffffff)
    mqtt_connected = false
    if (serial.mqtt_client("calliope")) {
        basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.c), 0xff8000)
        lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
        if (serial.mqtt_connect("192.168.8.2", 1884)) {
            i_payload = 0
            joystick_fahren = 128
            joystick_lenken = 128
            last_joystick_button = "0"
            mqtt_connected = true
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.a), 0x0000ff, gesten)
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.b), 0x0000ff, pins.joystick_connected())
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.c), 0x00ff00)
        } else {
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.c), 0xff0000)
        }
    } else {
        basic.setLedColors2(basic.basicv3_rgbled(basic.eRGBLED.c), 0xff0000, serial.at_command(serial.serial_eAT(serial.eAT_commands.at_mqttclean), 2), 0xffff00)
    }
    lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
})
input.onGesture(Gesture.ScreenUp, function () {
    mqtt_publish_bt("bt_stop", 0)
    richtung = ""
    if (g_status != 1) {
        g_status = 0
    }
})
input.onGesture(Gesture.LogoUp, function () {
    g_status += 2
    mqtt_publish_bt("bt_bw" + richtung, bt_speed)
})
function mqtt_publish_relay (on: string) {
    i_payload += 1
    if (serial.mqtt_publish("topic", serial.string_join(";", i_payload, on))) {
        last_joystick_button = on
    } else {
        basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.b), 0xff0000)
        basic.pause(200)
    }
    lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
}
function mqtt_publish_bt (button_id: string, speed: number) {
    if (mqtt_connected && gesten && last_button_id != button_id) {
        i_payload += 1
        if (serial.mqtt_publish("topic", serial.string_join(";", i_payload, button_id, speed))) {
            basic.setLedColors2(basic.basicv3_rgbled(basic.eRGBLED.a), 0xff00ff, button_id == "bt_stop", 0x0000ff)
            last_button_id = button_id
        } else {
            basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.a), 0xff0000)
            basic.pause(200)
        }
        lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
    }
}
let last_button_id = ""
let gesten = false
let mqtt_connected = false
let i_payload = 0
let joystick_lenken = 0
let joystick_fahren = 0
let last_joystick_button = ""
let bt_speed = 0
let g_status = 0
let richtung = ""
basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.a), 0xffffff)
serial.init_serial()
basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.a), 0xff8000)
basic.pause(2000)
lcd.init_display(lcd.eDisplay.qwiic_20_4, true)
if (lcd.get_display(lcd.eDisplay.none)) {
    basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.b), 0xff8000)
    basic.pause(2000)
}
basic.setLedColors2(basic.basicv3_rgbled(basic.eRGBLED.a), 0xff0000, serial.at_command(serial.serial_eAT(serial.eAT_commands.at_rst), 5), 0x00FF00)
lcd.write_array(serial.get_response(), lcd.eINC.inc0, serial.get_response_index())
basic.forever(function () {
    if (mqtt_connected && pins.joystick_connected()) {
        mqtt_publish_joystick()
        basic.setLedColors1(basic.basicv3_rgbled(basic.eRGBLED.b), 0x0000ff, input.runningTime() % 1000 > 500)
        basic.pause(100)
    }
})
