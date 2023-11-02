var mqtt;
var reconnectTimeout = 2000;
function MQTTconnect() {
	mqtt = new Paho.MQTT.Client("localhost",8000,"/mqtt","web_" + parseInt(Math.random() * 100, 10) );
	var options = {
		timeout: 3,
		useSSL: false,
		cleanSession: true,
		onSuccess: onConnect,
		onFailure: function (message) {
			$('#status').val("Connection failed: " + message.errorMessage + "Retrying");
			setTimeout(MQTTconnect, reconnectTimeout);
		}
	};
	mqtt.onConnectionLost = onConnectionLost;
	mqtt.onMessageArrived = onMessageArrived;
	mqtt.connect(options);
}
function onConnect() {
	$('#status').val('Connected to host ');
	// Connection succeeded; subscribe to our topic
	mqtt.subscribe("TT/led", {qos: 2});
	mqtt.subscribe("TT/Temp", {qos: 2});
	mqtt.subscribe("TT/Aff", {qos: 2});
	$('#topic').val("TT/led et Temp")
}
function onConnectionLost(response) {
	setTimeout(MQTTconnect, reconnectTimeout);
	$('#status').val("connection lost: " + responseObject.errorMessage + ". Reconnecting");
};
var i = 0;

function TT(){
    // let button = document.querySelector(".temp");
    // let status = document.querySelector("#status");
    // var tt = document.getElementById("topic");
    // tt.value = "test";
    // status.value = "Test 2";
    // button.textContent = "Test 2";
    i++;
    let temperature = document.querySelector(".degre");
    temperature.textContent = i.toString();
    if(i>30){
        temperature.textContent = "ALERTE";
    }
};

$(document).ready(function() {
    setInterval(TT, 1000);
    //TT();
    MQTTconnect();
    $("#Button1").click(function() {
        mqtt.send("TT/led","ON");
    });
    $("#Button0").click(function() {
        mqtt.send("TT/led","OFF");
    });
});
