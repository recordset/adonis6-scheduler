
# @recordset/adonis6-scheduler

A modern, TypeScript-first scheduler/cron integration for AdonisJS 6.

## 🚀 Features

- `make:task` command for generating scheduled task classes
- `scheduler:run` command for running scheduler workers
- BaseTask class for clean task organization
- Flexible cron schedule configuration
- TypeScript-first, ESM-ready


## 📦 Installation

```bash
npm install @recordset/adonis6-scheduler
```

### (Optional) Configure with Ace command

```bash
node ace configure @recordset/adonis6-scheduler
```

## ⚡ Quick Start

1. Register the provider and commands in `adonisrc.ts`:

```typescript
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  providers: [
    () => import('@recordset/adonis6-scheduler/scheduler_provider'),
  ],
  commands: [
    () => import('@recordset/adonis6-scheduler/commands/make_task'),
    () => import('@recordset/adonis6-scheduler/commands/scheduler_run'),
  ],
})
```

2. Create a new scheduled task:

```bash
node ace make:task SendReportTask
```

3. Implement your task logic:

```typescript
import { BaseTask } from '@recordset/adonis6-scheduler/src/scheduler/task'

export default class SendReportTask extends BaseTask {
  static schedule = '0 0 * * *' // every day at midnight

  async handle() {
    // Task logic here
  }
}
```

4. Start the scheduler worker:

```bash
node ace scheduler:run
```

## 📚 Documentation

- `SETUP.md` - Step-by-step setup instructions
- `SUMMARY.md` - Package overview and features

## 📝 License

MIT
