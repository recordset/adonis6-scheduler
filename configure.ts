/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import type Configure from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/index.js'

export async function configure(command: Configure) {
    const codemods = await command.createCodemods()

    // Add provider to rc file
    await codemods.updateRcFile((rcFile) => {
        rcFile
            .addProvider('@recordset/adonis6-scheduler/scheduler_provider')
            .addCommand('@recordset/adonis6-scheduler/commands')
    })

    // Create config file
    await codemods.makeUsingStub(stubsRoot, 'config/scheduler.stub', {})
}
