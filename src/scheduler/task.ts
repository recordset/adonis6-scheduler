import ms from 'ms'
import Locker from './locker.js'
import { CronTime } from 'cron-time-generator'
import { LockerInterface, LoggerService } from '@adonisjs/core/types'

export class CronTimeV2 extends CronTime {
    public static everySecond() {
        return '* * * * * *'
    }
    public static everyTwoSeconds() {
        return '*/2 * * * * *'
    }
    public static everyThreeSeconds() {
        return '*/3 * * * * *'
    }
    public static everyFourSeconds() {
        return '*/4 * * * * *'
    }
    public static everyFiveSeconds() {
        return '*/5 * * * * *'
    }
    public static everyTenSeconds() {
        return '*/10 * * * * *'
    }
    public static everyFifteenSeconds() {
        return '*/15 * * * * *'
    }
    public static everyThirtySeconds() {
        return '*/30 * * * * *'
    }
    public static everyMinute() {
        return '* * * * *'
    }
    public static everyTwoMinutes() {
        return '*/2 * * * *'
    }
    public static everyThreeMinutes() {
        return '*/3 * * * *'
    }
    public static everyFourMinutes() {
        return '*/4 * * * *'
    }
    public static everyFiveMinutes() {
        return '*/5 * * * *'
    }
    public static everyTenMinutes() {
        return '*/10 * * * *'
    }
    public static everyFifteenMinutes() {
        return '*/15 * * * *'
    }
    public static everyThirtyMinutes() {
        return '*/30 * * * *'
    }
}

/**
 * @module BaseTask
 * @description Task base class
 */
export class BaseTask {
    public name: string
    public locker: LockerInterface
    public startedAt: number
    public logger: LoggerService

    /**
     * Set enable use .lock file for block run retry task
     * Lock file save to `tmpPath`
     */
    public static get useLock(): boolean {
        return false
    }
    public static get schedule(): string {
        return '* * * * *'
    }

    constructor(
        protected tmpPath: string,
        logger: LoggerService
    ) {
        this.name = this._getName()
        this.locker = this._getLocker()
        this.startedAt = 0
        this.logger = logger
    }

    /**
     * Example input JasperEventsDrop
     * Example output jasper:events:drop
     */
    protected _getName(): string {
        return this.constructor.name
            .replace(/([A-Z])/g, ' $1')
            .split(' ')
            .splice(1)
            .map((str) => str.toLowerCase())
            .join('_')
            .toLowerCase()
    }
    protected _getLocker(): LockerInterface {
        return new Locker(this.name, this.tmpPath)
    }

    public async _run() {
        const useLock = (this.constructor as unknown as typeof BaseTask).useLock

        if (useLock) {
            const locked = await this.locker.check()
            if (locked) {
                this.logger.warn(
                    `${this.constructor.name}: Lock file exist so current task is running, let's skip`
                )
                return
            }

            await this.locker.lock()
        }

        this.startedAt = new Date().getMilliseconds()

        try {
            /**
             * Worker task handle
             */
            await this.handle()
        } catch (e) {
            this.logger.error(e)
        }

        if (useLock) {
            await this.locker.unlock()
        }
    }
    public async handle() {}

    /**
     * Get task running time duration
     */
    public duration(source = false): number {
        let duration: any = new Date().getMilliseconds() - this.startedAt

        if (source) {
            return duration
        }

        duration = ms(duration)
        return duration
    }
}
