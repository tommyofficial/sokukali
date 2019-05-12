const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { RichEmbed } = require('discord.js')

module.exports = class ModerationWarnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'uyar',
			aliases: ['uyarı', 'sunucuda uyar', 'uyarıat', 'uyarı ver'],
			group: 'moderasyon',
			memberName: 'uyar',
			description: 'İstediğiniz kişiye uyarı verir.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					label: 'kullanıcı',
					prompt: 'Kimi uyarmak istersin?',
					type: 'member'
				},
				{
					key: 'sebep',
					label: 'sebep',
					prompt: 'Neden bu kişiyi uyarmak istiyorsun?',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission("KICK_MEMBERS")
	}

	async run(msg, args) {
		let guild = msg.guild
		const member = args.member;
		const user = member.user;
		const reason = args.sebep;
		const kasa = this.client.provider.get(msg.guild.id, 'modKasa', []);
		const eskikasano = Number(kasa);
		const kasano = parseInt(eskikasano) + 1;
		this.client.provider.set(msg.guild.id, 'modKasa', kasano);
		const vt = this.client.provider.get(msg.guild.id, 'modLog', []);
		const db = this.client.provider.get(msg.guild.id, 'modLog', []);
		if (db ==! "evet") return msg.channel.send(' Lütfen `mod-log-ayarla` komutu ile mod-log kanalı belirleyiniz.');
		let modlog = vt;
		if (!modlog) return msg.channel.send(' Mod-log olarak belirlediğiniz kanal silinmiş, lütfen yeni  bir mod-log kanalı açıp `mod-log-ayarla` komutu ile mod-log olarak ayarlayınız.');
		if (user.id === msg.author.id) return msg.say(' Kendini uyaramazsın.')
		if (member.highestRole.calculatedPosition > msg.member.highestRole.calculatedPosition - 1) {
			return msg.say(' Bu kişinin senin rollerinden/rolünden daha yüksek rolleri/rolü var.');
		}
		if (!msg.guild.member(user).kickable) return msg.channel.send(' Bu kişiyi uyaramıyorum çünkü `benden daha yüksek bir role sahip` ya da `bana gerekli yetkileri vermedin`.');
		const embed = new RichEmbed()
	  .setColor("RANDOM")
		.addField(`Eylem:`, "Uyarma")
		.addField(`Kullanıcı:`, `${user.tag} (${user.id})`)
		.addField(`Yetkili:`, `${msg.author.tag} (${msg.author.id})`)
		.addField(`Sebep:`, reason)
	  .setFooter(`Dragons BOT | Kasa: ${kasano}`)
		.setTimestamp()
		guild.channels.get(modlog).send(embed);
		member.send('**' + msg.guild.name + '** sunucusunda `' + msg.author.tag + '` adlı kişi/yetkili tarafından ___' + reason + '___ sebebi ile uyarıldın.')
		return msg.channel.send('İşlem başarılı!');
	}
};
