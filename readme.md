# Skyweb
Unofficial Skype API for nodejs via 'Skype (HTTP)' protocol. 

If you want to create a bot, take a look at https://github.com/Microsoft/BotBuilder first.👌  

##Running example
As username and password you should use your Skype account or your Microsoft account.
```sh
git clone https://github.com/ShyykoSerhiy/skyweb.git
cd skyweb
npm install
cd dist/demo
node demo.js username password
```
After 'Skyweb is initialized now' appears in console any message you receive in your Skype will be automatically replied.

##Usage
###Initializing and login
```js
Skyweb = require('skyweb');
var skyweb = new Skyweb();
skyweb.login(username, password).then(function (skypeAccount) {
    console.log('Skyweb is initialized now');
});
```

###Getting contacts info
```js
var skyweb = new Skyweb();
skyweb.login(username, password).then((skypeAccount) => {    
    console.log('Your contacts : ' + JSON.stringify(skyweb.contactsService.contacts, null, 2));
});
```

###Setting status
```js
var skyweb = new Skyweb();
skyweb.login(username, password).then((skypeAccount) => {
    skyweb.setStatus('Hidden'); //Now everybody thinks I'm sleeping
});
```
Currently supported values are : "Hidden" | "Online" | "Away" | "Busy"

##What's not working and probably never will.
* [Old P2P group chats](https://github.com/ShyykoSerhiy/skyweb/issues/6). According to  [Skype community site ](http://community.skype.com/t5/Skype-for-Web-Beta/Group-chats-missing-on-skype-web/td-p/3884218) only new, Cloud based group chats are shown in SkypeWeb Beta(therefore works in this API). The old P2P group chats are not.  

##Disclaimer 
This project relies on SkypeWeb Skype implementation. If Microsoft Corporation decides to remove Skype
implementation (or change it in any) skyweb might not be in working state. Therefore it's not recommended to use it 
in any critical part of production code. In fact it's not recommended to use it in production at all.

[MIT License](https://github.com/ShyykoSerhiy/skyweb/blob/master/LICENSE.md).

