import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeTask extends BaseCommand {
    public static commandName = 'scheduler:run'
    public static description = 'Start one or more workers'

    static options: CommandOptions = {
        startApp: true,
        staysAlive: true,
    }

    /**
     * Execute command
     */
    async run() {
        const scheduler = await this.app.container.make('recordset/scheduler')
        await scheduler.run()
    }
}
