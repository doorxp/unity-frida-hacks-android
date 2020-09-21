const FridaInject = require('frida-inject');
const Frida = require('frida');

var proc = process.argv[2];
var file = process.argv[3];

if (!proc || !file) {
	console.log('Usage:');
	console.log('  node injector.js {executable} {script}');
	console.log();
	console.log('example:');
	console.log('  node injector.js 198X.exe enumerator-test.js');
	process.exit(1);
}
async function main() {

	const device = await Frida.getUsbDevice();

	const pid = await device.spawn(proc);

	const session = await device.attach(proc)

	

	FridaInject({
		device: device,
		pid: pid,
		session: session,
		scripts: [file],
		onAttach: session => console.log('Injected "' + file + '" ' + proc)
	});
	
	device.resume(pid)
}


main();
