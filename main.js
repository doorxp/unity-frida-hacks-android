const HookModuleName = 'libil2cpp.so'

// const fs = require("frida-fs");

function main() {
	const module = Module.findBaseAddress(HookModuleName);


	// const addr = 0x0175CA28;//GetAssetFileURL
	// const addr = 0x01870EA4; //CreateResourceList
	// const addr = 0x01759ED8;//ForeachCallback
	// const addr = 0x018720F8; //DectryptAssetBundle
	//const addr = 0x0187A52C; //UpdateKey

	const addr = 0x0187264C; //ReadAssetBundleAsyncFromMemory

	// const addr = 0x01776658; //ReadAsync

	// const addr = 0x018720F8 //DectryptAssetBundle


	const func = module.add(addr);
	console.log('[+] hook ' + addr.toString(16));


	Interceptor.attach(module.add(0x01776658), {
		onEnter: function(args) {
			// let arg1 = args[1].add(0x14);
// 			console.log(args[1].readByteArray(40));
// 			console.log(args[1].add(0x10).readPointer().toInt32());
// 				console.log(arg1.readUtf16String());
			// 	let arg2 = args[2];
			// 	console.log(arg2.toInt32())
		}
	});

	var onDectryptCompleted = null;

	var fileId = 0;

	Interceptor.attach(func, {
		onEnter: function(args) {
			console.log("Enter");

			// console.log(args[0].readByteArray(100));
			//
			// const THIS = args[0].readPointer();
			// console.log(THIS.toString(16));
			//
			// console.log(THIS.readPointer().add(0x10).readByteArray(100));

 			let len = args[1].add(0x18).readPointer().toInt32();


			let arg1 = args[1].add(0x14 + 0xC);
			// console.log(arg1.readByteArray(65504));
			var name = "/data/local/tmp/data/file_" + fileId + ".data";
			console.log(name);
			fileId = fileId + 1;
			
			var file = new File(name, "wb");
			
			file.write(arg1.readByteArray(len));
			file.close();
			console.log("end!!");

			onDectryptCompleted = args[2];

			// console.log(onDectryptCompleted.readByteArray(256));
			//
			// 			console.log(arg1.readUtf16String());
			//
			//
			// 	 		let args2 = args[2].add(0x14+0xc).toInt32();
			// 			console.log("=>0x",args2.toString(16));
			//
			// 	// 	 console.log("===>",args2.readUtf16String());
			// 			// console.log(args2.readByteArray(16));
			// 	//
			// 			console.log("\n\n=>>>>>>");
			// 	//
			// 			// let args3 = args[3].add(0);
			// 			// console.log(args3.readByteArray(200));

		},
		onLeave: function(retval) {
			// console.log("0x" + addr.toString(16) + " return :", retval.add(0x14).readUtf16String());
			// console.log(retval.readByteArray(200));
			// console.log('====>',onDectryptCompleted.readByteArray(256));
		}

	});

}






var hasEnterMain = false;

function start() {
	var func = Module.findExportByName(null, "dlopen")

	Interceptor.attach(func, {
		onEnter: function(args) {
			this.so_path = Memory.readCString(args[0])
		},
		onLeave: function(retval) {

			// console.log(this.so_path);

			if (this.so_path.indexOf(HookModuleName) < 0 || hasEnterMain) {
				return
			}

			console.log("Enter Main 0");

			hasEnterMain = true;
			main()
		}
	});
}

start();

Process.enumerateModules({
	onMatch: function(e) {

	},
	onComplete: function() {
		var addr = Module.findBaseAddress(HookModuleName);
		if (!!addr && !hasEnterMain) {
			console.log("Enter Main 1");
			hasEnterMain = true;
			main();
		}
	}
});
