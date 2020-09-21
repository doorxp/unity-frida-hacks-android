**Horrible setup/installation notes:**

install nodejs 13 for windows - https://nodejs.org/en/download/current/

checkout repo

```
npm install frida-mono-api
npm install frida-inject
```

replace "node_modules\frida-mono-api\src\mono-api.js"        with https://raw.githubusercontent.com/GoSecure/frida-mono-api/extra/src/mono-api.js

replace "node_modules\frida-mono-api\src\mono-api-helper.js" with https://raw.githubusercontent.com/GoSecure/frida-mono-api/extra/src/mono-api-helper.js


**To print out the methods and fields of the "TakeDamage" class in the "com.xxxx.xxx" game:**
```
node injector.js com.xxxx.xxx main.js
```
Sample output
```
{
    "address": "0xe8733e0",
    "methods": {
        ...
        "Damage": {
            "address": "0xe887610",
            "jit_address": "0x1082bd20"
        },
        ...
    },
    "fields": {
        ...
        "isPlayerCharacter": {
            "address": "0xe8873d0",
            "offset": "0x1c",
            "type": "boolean"
        }
    }
}
```

**To apply my hacks to "com.xxxx.xxx":**
```
node injector.js com.xxxx.xxx main.js
```

Sample output:
```
Injected "main.js" into com.xxxx.xxx

[*] STARTED PLAYING: The Runaway
[+] Collision! Removing speed loss and disabling wipeout
[+] Collision! Removing speed loss and disabling wipeout
[+] Collision! Removing speed loss and disabling wipeout
[+] Collision! Removing speed loss and disabling wipeout

[*] STARTED PLAYING: Kill Screen
[+] Player took RPG damage: 31, health (before damage) was: 99
[+] Resetting RPG health to: 99
[+] Player took RPG damage: 33, health (before damage) was: 99
[+] Resetting RPG health to: 99

[*] STARTED PLAYING: Credits
```
