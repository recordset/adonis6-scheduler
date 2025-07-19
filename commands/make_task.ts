import { BaseCommand, args } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/index.js'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeTask extends BaseCommand {
    public static commandName = 'make:task'
    public static description = 'Generate task from template'
    static options: CommandOptions = {
        allowUnknownFlags: true,
    }

    @args.string({ description: 'Name of the task class' })
    declare name: string

    async run() {
        const codemods = await this.createCodemods()

        await codemods.makeUsingStub(stubsRoot, 'command/main.stub', {
            entity: this.app.generators.createEntity(this.name),
        })
    }
}
