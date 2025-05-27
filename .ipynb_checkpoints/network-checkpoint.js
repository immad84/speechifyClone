const os = require("os");

const interfaces = os.networkInterfaces();
let appIP = '127.0.0.1'; // fallback

for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      appIP = iface.address;
      break;
    }
  }
}

const appaddress = `http://${appIP}:3000/`;

console.log("App Address:", appaddress);
