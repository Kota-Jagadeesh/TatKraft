package com.tatkraft.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.tatkraft.app.data.model.Priority
import com.tatkraft.app.data.model.ReminderConfig
import com.tatkraft.app.data.model.Task
import com.tatkraft.app.data.model.TaskCategory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit

@Database(entities = [Task::class], version = 1, exportSchema = false)
abstract class TatKraftDatabase : RoomDatabase() {

    abstract fun taskDao(): TaskDao

    companion object {
        @Volatile
        private var INSTANCE: TatKraftDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): TatKraftDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    TatKraftDatabase::class.java,
                    "tatkraft_database"
                )
                    .addCallback(TatKraftDatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class TatKraftDatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialTasks(database.taskDao())
                    }
                }
            }

            suspend fun populateInitialTasks(taskDao: TaskDao) {
                val now = System.currentTimeMillis()
                val oneDay = TimeUnit.DAYS.toMillis(1)
                val oneHour = TimeUnit.HOURS.toMillis(1)

                val initialTasks = listOf(
                    Task(
                        title = "Google Summer Internship Application",
                        description = "Submit portfolio, resume with action verbs, and cover letter for SWE intern role.",
                        category = TaskCategory.INTERNSHIPS,
                        deadlineEpochMillis = now + (oneDay * 2) + (oneHour * 5),
                        priority = Priority.CRITICAL,
                        reminderConfig = ReminderConfig(
                            isEnabled = true,
                            daysBefore = 3,
                            frequencyPerDay = 3
                        )
                    ),
                    Task(
                        title = "Interactive Jetpack Compose Architecture",
                        description = "Implement Soft UI custom elevation modifiers and spring physics transitions.",
                        category = TaskCategory.PROJECTS,
                        deadlineEpochMillis = now + (oneDay * 4),
                        priority = Priority.HIGH,
                        reminderConfig = ReminderConfig(
                            isEnabled = true,
                            daysBefore = 2,
                            frequencyPerDay = 2
                        )
                    ),
                    Task(
                        title = "Masters Scholarship Statement of Purpose",
                        description = "Finalize 2-page essay on machine learning systems and overcoming friction.",
                        category = TaskCategory.APPLICATIONS,
                        deadlineEpochMillis = now + (oneDay * 1) + (oneHour * 2),
                        priority = Priority.CRITICAL,
                        reminderConfig = ReminderConfig(
                            isEnabled = true,
                            daysBefore = 3,
                            frequencyPerDay = 3
                        )
                    ),
                    Task(
                        title = "Operating Systems Final Project Benchmarking",
                        description = "Run thread pool scheduling latency tests and compile PDF report.",
                        category = TaskCategory.STUDIES,
                        deadlineEpochMillis = now - (oneHour * 12),
                        isCompleted = true,
                        completedAtEpochMillis = now - (oneHour * 2),
                        priority = Priority.NORMAL
                    )
                )

                for (task in initialTasks) {
                    taskDao.insertTask(task)
                }
            }
        }
    }
}
