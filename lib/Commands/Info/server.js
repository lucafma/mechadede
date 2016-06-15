import BaseCommand from '../../Base/BaseCommand'

class ServerInfo extends BaseCommand {
  static get name () {
    return 'server'
  }

  static get description () {
    return 'Shows information of the server'
  }

  get noPrivate () {
    return true
  }

  getAllRoles (roles) {
    let list = []
    for (let role of roles) {
      list.push(role.name)
    }
    list.splice(list.indexOf('@everyone'), 1)
    return list.join(', ')
  }

  fetchServer (server) {
    return [
      '```xl',
      `${server.name}`,
      `ID: ${server.id}`,
      `Region: ${server.region}`,
      `Members: ${server.members.length} (${
        server.members.reduce((count, member) => {
          count += member.status === 'online' ? 1 : 0
          return count
        }, 0)} online)`,
      `Owner: ${server.owner.username} <${server.owner.id}>`,
      `Roles: ${this.getAllRoles(server.roles)}`,
      '```'
    ].join('\n')
  }

  handle () {
    this.responds(/^server$/i, () => {
      this.send(this.channel, this.fetchServer(this.server))
    })
  }
}

module.exports = ServerInfo