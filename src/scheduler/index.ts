import fs from 'fs'
import path from 'path'
import { RuntimeException } from '../exceptions/index.js'
import { BaseTask } from './task.js'
import NodeSchedule from 'node-schedule'
import cronstrue from 'cronstrue'
import { ApplicationService, LoggerService } from '@adonisjs/core/types'

export default class Scheduler {
    private appRootPath: string
    private tasksPath: string
    private registeredTasks: BaseTask[]
    private logger: LoggerService
    private app: ApplicationService

    /**
     */
    constructor(logger: LoggerService, app: ApplicationService) {
        this.app = app
        this.appRootPath = this.app.appRoot.pathname
        this.registeredTasks = []
        this.tasksPath = ''
        this.logger = logger

        this._configureTasksPath()
    }

    /**
     * Configure tasks absolute path for app
     * /<project-dir>/app/Tasks
     */
    private _configureTasksPath() {
        this.tasksPath = path.join(this.appRootPath, 'app', 'tasks')
        this.tasksPath = path.normalize(this.tasksPath)
    }

    /**
     * Load task file
     */
    private async _fetchTask(task: typeof BaseTask) {
        let taskInstance = new task(this.appRootPath + '/tmp/adonis6-scheduler/locks', this.logger)

        const taskInstanceConstructor = taskInstance.constructor as typeof BaseTask
        // Every task must expose a schedule
        if (!('schedule' in taskInstanceConstructor)) {
            throw RuntimeException.undefinedTaskSchedule(task.constructor.name)
        }

        // Every task must expose a handle function
        if (!('handle' in taskInstance)) {
            throw RuntimeException.undefinedTaskHandle(task.constructor.name)
        }

        // if (!(taskInstance instanceof Task)) {
        // 	throw RuntimeException.undefinedInstanceTask(file)
        // }

        // Track currently registered tasks in memory
        this.registeredTasks.push(taskInstance)
        // Before add task to schedule need check & unlock file if exist
        const locked = await taskInstance.locker.check()
        if (locked) {
            await taskInstance.locker.unlock()
        }

        // Register task handler
        const humanCron = cronstrue.toString(taskInstanceConstructor.schedule)

        NodeSchedule.scheduleJob(
            taskInstanceConstructor.schedule,
            taskInstance._run.bind(taskInstance)
        )

        this.logger.info(
            `Task ${taskInstanceConstructor.name} registered with schedule ${taskInstanceConstructor.schedule} (${humanCron})`
        )
    }

    public getRegisteredTasks() {
        return this.registeredTasks
    }

    /**
     * Register scheduled tasks for every task found in app/Tasks
     *
     * @public
     */
    public async run(taskClasses: Array<typeof BaseTask> = []) {
        this.logger.info('Scanning tasks path %s', this.tasksPath)

        if (taskClasses.length === 0) {
            try {
                const taskFiles = fs.readdirSync(this.tasksPath)

                for (const file of taskFiles) {
                    const isAllowed =
                        ['.js', '.ts'].includes(path.extname(file)) && !file.includes('.map')
                    if (isAllowed) {
                        const filePath = path.join(this.tasksPath, file)
                        let task: any

                        try {
                            task = await import(filePath)
                            await this._fetchTask(task.default)
                        } catch (e) {
                            if (e instanceof ReferenceError) {
                                this.logger.error(
                                    'Unable to import task class <%s>. Is it a valid javascript class?',
                                    file
                                )
                                return
                            } else {
                                throw e
                            }
                        }
                    }
                }
            } catch (e) {
                // If the directory isn't found, log a message and exit gracefully
                if (e.code === 'ENOENT') {
                    throw RuntimeException.notFoundTask(this.tasksPath)
                }
                throw e
            }
        }

        for (let task of taskClasses) {
            await this._fetchTask(task)
        }

        this.logger.info('scheduler running %d tasks', this.registeredTasks.length)
    }
}
