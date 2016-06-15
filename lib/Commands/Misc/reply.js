import escape from 'escape-string-regexp'
import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import BaseCommand from '../../Base/BaseCommand'

const expressions = require(path.join(process.cwd(), 'db/expressions.json'))
const channelsPath = path.join(process.cwd(), 'db/reply-channels.json')
const channels = require(channelsPath)

class Replies extends BaseCommand {
  static get name () {
    return 'replies'
  }

  static get description () {
    return 'Replies to certain keywords'
  }

  static get usage () {
    return [
      '- Toggles replies',
      'list - Lists replies'
    ]
  }

  replaceString (string) {
    let replacements = {
      '%sender%': this.sender.username,
      '%server%': this.server.name,
      '%channel%': this.channel.name
    }
    for (let str in replacements) {
      if (replacements.hasOwnProperty(str)) {
        string = string.replace(str, replacements[str])
      }
    }
    return string
  }

  hearExpression (exp) {
    this.hears(new RegExp(`\^${escape(exp)}\$`, 'i'), () => {
      let reply = ''
      let r = expressions[exp]
      if (Array.isArray(expressions[exp])) {
        reply = r[Math.floor(Math.random() * r.length)]
      } else {
        reply = r
      }
      reply = this.replaceString(reply)
      this.send(this.channel, reply)
    })
  }

  saveChannels () {
    fs.writeFile(channelsPath, JSON.stringify(channels, null, 2), (err) => {
      if (err) {
        this.logger.error(`Error saving to ${channelsPath}`, err)
        this.reply(`Error saving to channels list - ${err}`)
        return
      }
    })
  }

  handle () {
    this.responds(/^replies list$/i, () => {
      let reply = []
      for (let exp in expressions) {
        reply.push(`\`\`\`${exp}\`\`\``)
      }
      this.reply([
        'This is the list of expressions that the bot will reply to:',
        'ayy',
        reply.join(', ')
      ].join('\n'))
    })

    this.responds(/^replies$/i, () => {
      if (channels.indexOf(this.channel.id) > -1) {
        _.pull(channels, this.channel.id)
        this.reply('Banned replies on this channel.')
        this.saveChannels()
      } else {
        channels.push(this.channel.id)
        this.reply('Allowed replies on this channel.')
        this.saveChannels()
      }
    })

    this.hears(/^ay(y+)$/i, matches => {
      this.send(this.channel, `lma${Array(matches[1].length + 1).join('o')}`)
    })
  }

}

module.exports = Replies