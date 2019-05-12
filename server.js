const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const path = require('path'),
moment = require('moment'),
sqlite = require('sqlite');

const ayarlar = require('./data/ayarlar.json');

const client = new CommandoClient({
    commandPrefix: ayarlar.PREFIX,
    unknownCommandResponse: false,
    owner: ayarlar.SAHIP,
    disableEveryone: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
		['sunucu', 'Sunucu Komutları'],
		['bot', 'Bot Komutları'],
		['ayarlar', 'Ayarlar'],
		['admin', 'Admin'],
        ['moderasyon', 'Moderasyon'],
        ['başvuru', 'Başvuru'],
        ['kullanıcı', 'Kullanıcı'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

	sqlite.open(path.join(__dirname, "json.sqlite")).then((db) => {
		client.setProvider(new SQLiteProvider(db));
	});

client.on('ready', () => {
client.user.setPresence({
        game: {
            name: 'Henüz Yardım Komutu Yok Ama Prefixim "."',
            type: "STREAMING",
            url: "https://www.twitch.tv/justwinner06"
        }
    });

  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] LOG: Aktif, Komutlar yüklendi!`);
});

client.on('error', err => {
	console.log(err)
});

client.login(ayarlar.TOKEN);