var Accessory, Service, Characteristic, UUIDGen;

bar net = require('net');

module.exports = function(homebridge) {
  //Accessory = homebridge.platformAccessory;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  //UUIDGen = homebridge.hap.uuid;

  homebridge.registerAccessory("homebridge-tivo-control", "TiVo" TiVoControl);
}

function TiVoControl(log, config) {
  log("TiVoControl init");

  var platform = this;
  this.log = log;
  this.config = config;

  this.service = new Service.Switch(this.config.name);
  this.service.getCharacteristic(Characteristic.On).on('set', this.activate.bind(this));
  this.service.getCharacteristic(Characteristic.On).on('get', function() {return false});
}

TiVoControl.prototype.sendKey = function(key) {

  var platform = this;

  var sock = net.createConnection({
    port: this.config.port,
    host: this.config.host
  });

  sock.on('connect', function(data) {
    platform.log("connection created");
    sock.write("IRCODE " + key + "\r")
  })

  setTimeout(function() {
    sock.end();
    sock.destroy();
  }, 1000);
}

TiVoControl.prototype.activate = function(state, callback) {
  if(state) {
    this.sendKey("CHANNELUP");
  }
  callback(null);
}

TiVoControl.prototype.getServices = function() {
  return [this.service];
}


