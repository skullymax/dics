//#!/usr/bin/env node
//   Copyright 2016 prussian <generalunrest@airmail.cc>
//
//   Licensed under the Apache License, Version 2.0 (the "License")
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

var answers = [ 'Signs point to yes.', 'Yes.', 'Reply hazy, try again.', 'Without a doubt.', 'My sources say no.', 'As I see it, yes.', 'You may rely on it.', 'Concentrate and ask again.', 'Outlook not so good.', 'It is decidedly so.', 'Better not tell you now.', 'Very doubtful.', 'Yes - definitely.', 'It is certain.', 'Cannot predict now.', 'Most likely.', 'Ask again later.', 'My reply is no.', 'Outlook good.', 'Don\'t count on it.']

var irc_config = require('./config')
var irc = require('irc')
var client = new irc.Client(irc_config.server,irc_config.nick,irc_config.options)

// begin listening for messages
// it only listens for channel messages
// private messages will be ignored
client.addListener('message#',function (from, to, text) {

	// answer bots query
	if (/^[.!]bots/.test(text)) {
		client.say(to, "8ball-bot [NodeJS], highlight me and ask your yes or no questions!")
		return
	}

	// if message contains ${NICK}
	if (RegExp(irc_config.nick).test(text)) {
		client.say(to,from+": "+answers[Math.floor(Math.random()*answers.length)])
	}
}) 

// added pm for no real reason
// only because the telegram bot also has such feature.
client.addListener('pm', function (from) {
	client.say(from,from+": "+answers[Math.floor(Math.random()*answers.length)])
})

// listen for invites
// /invite $NICK will cause the bot to join that channel
client.addListener('invite',function(channel) {
	client.join(channel)
})

// optional telegram bot
if (irc_config.telegram_token !== '') {

	// for telegram bots
	var telegramBot = require('node-telegram-bot-api')

	var telebot = new telegramBot(irc_config.telegram_token, { polling: true })

	telebot.onText(/.*/, function (msg, match) {
		
		var from = msg.chat.id
		telebot.sendMessage(from, answers[Math.floor(Math.random()*answers.length)])
	})
}
