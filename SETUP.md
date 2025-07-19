# Setup Instructions for @recordset/adonis6-scheduler

## 1. Install the package

```bash
npm install @recordset/adonis6-scheduler
```

## 2. Register the provider in adonisrc.ts

Add the provider to your `adonisrc.ts` file:

```typescript
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  // ... other config
  
  providers: [
    // ... other providers
    () => import('@recordset/adonis6-scheduler/scheduler_provider'),
  ],
  
  commands: [
    // ... other commands
    () => import('@recordset/adonis6-scheduler/commands/make_task'),
    () => import('@recordset/adonis6-scheduler/commands/scheduler_run'),
  ],
})
```

## 3. Create a scheduled task

```bash
node ace make:task SendReportTask
```

## 4. Example task implementation

```typescript
import { BaseTask } from '@recordset/adonis6-scheduler/src/scheduler/task'

export default class SendReportTask extends BaseTask {
  static schedule = '0 0 * * *' // every day at midnight

  async handle() {
    // Task logic here
  }
}
```

## 5. Start the scheduler worker

```bash
node ace scheduler:run
```

That's it! Your scheduler integration is ready to use.
