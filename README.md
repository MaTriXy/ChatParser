# Chat Parser
[![Build Status](https://travis-ci.org/StreamJar/ChatParser.svg?branch=master)](https://travis-ci.org/StreamJar/ChatParser)
[![Coverage Status](https://coveralls.io/repos/github/StreamJar/ChatParser/badge.svg?branch=master)](https://coveralls.io/github/StreamJar/ChatParser?branch=master)

An issue we're running to at StreamJar is everybody handles their chats completely different. Which when you want to support lots of different services in the same way, it can cause less than ideal situations.

## Quick Note.
Smashcast has some interesting quirks.. in order to parse user ids, you must set a function `sc.setUserIdentifier()` which takes a function from username to id.

## Installation
To install, simply install it via NPM.
```
npm install --save chat-parser
```

## Getting Started
Getting started is simple. Require the module, create a new instance.. and parse.
```
import { MixerParser } from 'chat-parser';

const parser = new MixerParser({ developers: [1], bots: [2] });

parser.parse({
	// raw message
}, 'bot-username'),them(msg => { /* */ });
```

## Expected object
This module expects slightly different things depending on the platform (look in /examples for example objects).
- For Mixer, pass the data portion of the ChatMessage packet.
- For Twitch, pass the PRIVMSG as a string.
- For Smashcast, pass the "params" part of the chat packet.


## Parsed Message
The parsed message contains basic user information and the message itself.
```
{
	"user": {
		"userId": 373,
		"username": "Luke",
		"roles": [ Role{ role: 'Owner', level: 50 }],
		"primaryRole": Role{ role: 'Owner', level: 50 },
	},
	'metadata": {
		"command": false,
		"commandName": "give",
		"description": '@Luke 100',
	},
	"message": [
		{
			"type": 'text',
			"text": "hello",
		}
	]
}
```


### Types of message
Currently there are 4 types of message. Text, link, mention and emoticon.

#### Text:
```
{
	"type": "text",
	"text": "hello"
}
```

#### Link:
```
{
	"type": "link",
	"text": "https://google.com",
	identifier: "https://google.com",
}
```

#### Mention:
```
{
	"type": "mention",
	"text": "@StreamJar",
	identifier: "StreamJar",
}
```

#### Emoticon
Emoticons are handled differently between Twitch/Smashcast and Mixer, we call this 'sprite' and 'direct'.

##### Sprite:
```
{
	"type":"emoticon",
	"text":":D",
	"identifier":{
	"type":"sprite",
	"pack":"https://mixer.com/_latest/emoticons/default.png",
	"coords":{
		"x":72,
		"y":0,
		"width":24,
		"height":24
	}
}
```
##### Direct:
```
{
	"type":"emoticon",
	"text":":D",
	"identifier":{
	"type":"direct",
	"url":"https://smashcast.tv/static/img/chat/default/lol1.png"
}
```
