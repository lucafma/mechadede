import BaseCommand from '../../Base/BaseCommand'
import _ from 'lodash'
import path from 'path'

const eightball = require(path.join(process.cwd(), 'db/eightball.json'))

class EightBall extends BaseCommand {
  static get name () {
    return '8ball'
  }

  static get description () {
    return 'Asks the crystal ball a question'
  }

  static get aliases () {
    return [
      'eightball'
    ]
  }

  static get usage () {
    return [
      '<question> - Asks the crystall ball this question'
    ]
  }

  handle () {
    this.responds(/^(8ball|eightball)$/i, matches => {
      this.send(this.channel,
        `:8ball: | ${this.sender.username}, what is your question?`)
    })

    this.responds(/^(8ball|eightball) (.+)$/i, matches => {
      let reply = _.sample(eightball)
      this.send(this.channel,
        `:8ball: | ${this.sender.username}, **${reply}**`)
    })
  }
}

module.exports = EightBall