import type { ApplicationService } from '@adonisjs/core/types'
// import Scheduler from '../src/Scheduler/index.js'

export default class SchedulerProvider {
    constructor(protected app: ApplicationService) {}

    register() {
        this.app.container.singleton('recordset/scheduler', async () => {
            const Scheduler = await import('../src/scheduler/index.js')
            const logger = await this.app.container.make('logger')

            return new Scheduler.default(logger, this.app)
        })
    }
}
