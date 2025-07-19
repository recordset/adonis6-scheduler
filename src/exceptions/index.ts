import { Exception } from '@adonisjs/core/exceptions'

export class RuntimeException extends Exception {
    /**
     * This exception is raised when task an undefined schedule
     */
    public static undefinedTaskSchedule(task: string) {
        return new this(`${task} is not defined on schedule value`)
    }

    /**
     * This exception is raised when task an undefined handle
     */
    public static undefinedTaskHandle(task: string) {
        return new this(`${task} is not defined on handle value`)
    }

    /**
     * This exception is raised when task an undefined handle
     */
    public static undefinedInstanceTask(task: string) {
        return new this(`${task} is not extend of class Task`)
    }

    /**
     * This exception is raised when task an undefined handle
     */
    public static notFoundTask(dir: string) {
        return new this(`Not found task dir ${dir}`)
    }
}
