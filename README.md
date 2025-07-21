# @recordset/adonis6-scheduler

A modern, TypeScript-first scheduler/cron integration for AdonisJS 6.

## 🚀 Features

- `make:task` command for generating scheduled task classes
- `scheduler:run` command for running scheduler workers
- BaseTask class for clean task organization
- Flexible cron schedule configuration
- TypeScript-first, ESM-ready

## 📦 Installation

1. Install dependencies:
    ```bash
    npm install @recordset/adonis6-scheduler
    ```
2. Configure:
    ```bash
    node ace configure @recordset/adonis6-scheduler
    ```
3. Generate jobs with:
    ```bash
    node ace make:task MyTask
    ```
4. Start the worker:
    ```bash
    node ace scheduler:run
    ```

## 🧑‍💻 Example Task

```typescript
import { BaseTask } from '@recordset/adonis6-scheduler/task'

export default class MyTask extends BaseTask {
    static schedule = '0 0 * * *' // every day at midnight

    async handle() {
        // Task logic here
    }
}
```

## 📚 Documentation

- `SETUP.md` - Step-by-step setup instructions
- `SUMMARY.md` - Package overview and features

## 📝 License

MIT
