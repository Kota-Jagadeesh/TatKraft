package com.tatkraft.app.data.repository

import com.tatkraft.app.data.local.TaskDao
import com.tatkraft.app.data.model.Task
import com.tatkraft.app.data.model.TaskCategory
import kotlinx.coroutines.flow.Flow

class TaskRepository(private val taskDao: TaskDao) {

    val allTasks: Flow<List<Task>> = taskDao.getAllTasks()

    fun getTasksByCategory(category: TaskCategory): Flow<List<Task>> {
        return taskDao.getTasksByCategory(category)
    }

    suspend fun getTaskById(taskId: String): Task? {
        return taskDao.getTaskById(taskId)
    }

    suspend fun insertTask(task: Task) {
        taskDao.insertTask(task)
    }

    suspend fun updateTask(task: Task) {
        taskDao.updateTask(task)
    }

    suspend fun deleteTask(task: Task) {
        taskDao.deleteTask(task)
    }

    suspend fun deleteTaskById(taskId: String) {
        taskDao.deleteTaskById(taskId)
    }

    suspend fun toggleTaskCompletion(taskId: String, currentStatus: Boolean) {
        val newStatus = !currentStatus
        val completedAt = if (newStatus) System.currentTimeMillis() else null
        taskDao.updateTaskCompletion(taskId, newStatus, completedAt)
    }
}
