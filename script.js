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
var plot1 = null;
var flag = 0;


function TT(){
    // let button = document.querySelector(".temp");
    // let status = document.querySelector("#status");
    // var tt = document.getElementById("topic");
    // tt.value = "test";
    // status.value = "Test 2";
    // button.textContent = "Test 2";
    if(flag == 0){
        i++;
    }
    
    let rearmement = document.querySelector("#rearmement");
    let temperature = document.querySelector(".degre");
    temperature.textContent = i.toString();
    if(i>10 && rearmement.checked){
        temperature.textContent = "ALERTE";
        flag = 1;
        i=0;
        const webhookURL = 'https://maker.ifttt.com/trigger/alert_museum/json/with/key/KauxDKYMOtdLxqcE5DLMPaIv1I91HBJNFqk9_7nv1g?value1=value1&value2=value2&value3=value3';
        rearmement.checked = false;
        flag = 0;
    // Écoutez le résultat de l'applet IFTTT
    fetch(webhookURL, {
        method: 'POST',
    })
    };

    var date= new Date();
	var xlabel = date.getMinutes() + ":"+ date.getSeconds();

	tab_temp.push([xlabel,parseFloat(i)]); //payload à la place de i
	if (tab_temp.length > 20 ) tab_temp.shift();
	if (plot1) plot1.destroy();

	plot1 = $.jqplot('chart1', [tab_temp], {  
      	series:[{showMarker:false}],
      	axes:{
        xaxis:{
          label:'temps (S)',
	  labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	  renderer: $.jqplot.CategoryAxisRenderer,
        },
        yaxis:{
          label:'Temperature ( °C )',
	  labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        }
      }
  });
};

var plot1 = null;
var plot2 = null;
var i=1;
var tab_temp = [];
var tab2 = [];
function onMessageArrived(message) {
	var topic = message.destinationName;
	var payload = message.payloadString;
	if(topic === "TT/Aff"){
	payload = JSON.parse(payload);
	for (var i=0; i<payload.length;i++){
	  tab2.push(data[i].time, data[i].temp);
	}
	if (plot2) plot2.destroy();
	plot2 = $.jqplot('chart2', tab2, {  
      		series:[{showMarker:false}],
      		axes:{
        	xaxis:{
          	  label:'heure (S)',
	  	  labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	  	  renderer: $.jqplot.CategoryAxisRenderer,
        	},
        	yaxis:{
          	  label:'Temperature ( °C )',
	  	  labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        	}
      	  }
  	});
	}
	if(topic === "TT/Temp"){
	//$('#ws').prepend('<li>' + topic + ' = ' + payload + '</li>');
	var date= new Date();
	var xlabel = date.getMinutes() + ":"+ date.getSeconds();

	tab_temp.push([xlabel,parseFloat(payload)]);
	if (tab_temp.length > 20 ) tab_temp.shift();
	if (plot1) plot1.destroy();

	plot1 = $.jqplot('chart1', [tab_temp], {  
      	series:[{showMarker:false}],
      	axes:{
        xaxis:{
          label:'temps (S)',
	  labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
	  renderer: $.jqplot.CategoryAxisRenderer,
        },
        yaxis:{
          label:'Temperature ( °C )',
	  labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        }
      }
  });
}
};

$(document).ready(function() {
    setInterval(TT, 1000);
    onMessageArrived()
    //TT();
    MQTTconnect();
    $("#Button1").click(function() {
        mqtt.send("TT/led","ON");
    });
    $("#Button0").click(function() {
        mqtt.send("TT/led","OFF");
    });
});
