const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: '',
			permissionLevel: 10,
			aliases: ['cs'],
			usage:'<name:...str>',
		});
	}

	async run(message, [name]) {
		this.client.guilds.create(name).then(response => {console.log(response);})
    }

}
