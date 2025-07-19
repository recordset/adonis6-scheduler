import app from '@adonisjs/core/services/app'
import Scheduler from '../src/scheduler/index.js'

let scheduler: Scheduler

await app.booted(async () => {
    scheduler = await app.container.make('recordset/scheduler')
})

export { scheduler as default }
