import createResolver from 'options-resolver'
import chalk from 'chalk'
import Logger from './Services/Logger'
import Loader from './Services/Loader'
import Container from './Services/Container'
import ConfigLoader from './Services/ConfigLoader'

class Bot {
  constructor (debug, params) {
    this.debug = !!debug
    this.logger = new Logger(debug, null)
    let resolver = this.buildResolver()
    params = params || new ConfigLoader(this.logger).params
    resolver
    .resolve(params)
    .then(() => {
      this.buildContainer(params)
    })
    .catch(err => this.logger.error('Error resolving params:', err))
  }

  buildResolver () {
    let resolver = createResolver()
    resolver
    .setDefaults({
      'prefix': '!',
      'admin_id': []
    })
    .setRequired([
      'token',
      'prefix'
    ])
    .setAllowedTypes('prefix', 'string')
    .setAllowedTypes('admin_id', 'array')
    .setAllowedTypes('token', 'string')
    return resolver
  }

  buildContainer (params) {
    this.params = params
    this.container = new Container({
      logger: this.logger,
      params: this.params
    }, this.debug)

    this.run()
  }

  run () {
    this.logger.info(`Starting ${chalk.cyan('mechadede')} v` +
    `${process.env.npm_package_version || '1.2.0'}`)

    let loader = new Loader(this.container)
    loader.start()

    loader.on('ready', this.onReady.bind(this))
  }

  onReady () {
    this.logger.info('Bot is connected, awaiting messages')
  }
}

module.exports = Bot