const { Command, RichDisplay } = require('klasa')

const crypto = require('../../functions/crypto')



module.exports = class extends Command {

  constructor (...args) {

    super(...args, {

      aliases: ['ml', 'modlogs'],

      permLevel: 7,

      botPerms: ['EMBED_LINKS', 'MANAGE_MESSAGES'],

      description: 'Check the modlog for a user',

      usage: '[user:user]',

      usageDelim: ' '

    })

    this.album = new RichDisplay(

      new this.client.methods.Embed())

  }



  async run (msg, [user]) {

    if (!msg.guild) return msg.reply('⚠ Sorry, this command must be used in a server.')

    // Check if all requirements are met

    if (!user) return msg.reply('⚠ Sorry, you didn\'t give a user to check.')

    const allLogs = await msg.guildConfigs.modlogs

    const userLogs = allLogs.filter(log => log.user === user.id)

    this.album.pages = []

    if (!userLogs || userLogs.length === 0) return msg.reply(`There were no modlogs found for ${user.tag}.`)

    const logsByType = {

      Mute: [],

      Unmute: [],

      Ban: [],

      Unban: [],

      Warn: [],

      Kick: []

    }

    for (const log of userLogs) {

      logsByType[log.type].push(log)

    }

    const keys = Object.keys(logsByType)

    for (const key of keys) {

      if (logsByType[key].length === 0) continue

      this.album.addPage(e => {

        e.setAuthor(`${key} History In ${msg.guild.name} Server`, this.client.user.displayAvatarURL())

          .setThumbnail(this.client.user.displayAvatarURL())

          .setColor('#F05213')

          .setDescription(`**${key}** History For ${user.tag}`)



        for (const log of logsByType[key]) {

          const reason = crypto.decrypt(log.reason)

          const time = new Date(log.time)

          e.addField(`Moderator: ${this.client.users.get(log.mod).username}`, `Date Of Action: ${time}\nReason: ${reason}`)

        }

        return e

      })

    }



    this.album.run(await msg.sendMessage('Loading modlog history...'), {time: 300000})

  }



  async init () {

    // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)

  }

}
