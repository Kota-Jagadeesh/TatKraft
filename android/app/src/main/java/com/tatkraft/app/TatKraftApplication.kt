package com.tatkraft.app

import android.app.Application
import com.tatkraft.app.data.local.TatKraftDatabase
import com.tatkraft.app.data.repository.TaskRepository
import com.tatkraft.app.reminder.ReminderScheduler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob

class TatKraftApplication : Application() {
    val applicationScope = CoroutineScope(SupervisorJob())

    val database by lazy { TatKraftDatabase.getDatabase(this, applicationScope) }
    val repository by lazy { TaskRepository(database.taskDao()) }
    val reminderScheduler by lazy { ReminderScheduler(this) }
}
