package com.tatkraft.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.tatkraft.app.data.model.Task
import com.tatkraft.app.data.model.TaskCategory
import com.tatkraft.app.data.repository.TaskRepository
import com.tatkraft.app.reminder.ReminderScheduler
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class DashboardAnalytics(
    val totalTasks: Int = 0,
    val completedCount: Int = 0,
    val pendingCount: Int = 0,
    val completionPercentage: Float = 0f,
    val urgentCount: Int = 0,
    val overdueCount: Int = 0,
    val categoryCounts: Map<TaskCategory, Int> = emptyMap()
)

sealed interface UiEvent {
    data class TaskCompleted(val task: Task) : UiEvent
    data class TaskDeleted(val task: Task) : UiEvent
    data class ShowToast(val message: String) : UiEvent
}

class TaskViewModel(
    private val repository: TaskRepository,
    private val reminderScheduler: ReminderScheduler
) : ViewModel() {

    private val _selectedCategory = MutableStateFlow<TaskCategory?>(null)
    val selectedCategory: StateFlow<TaskCategory?> = _selectedCategory

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery

    private val _filterUrgentOnly = MutableStateFlow(false)
    val filterUrgentOnly: StateFlow<Boolean> = _filterUrgentOnly

    private val _uiEvents = MutableSharedFlow<UiEvent>()
    val uiEvents: SharedFlow<UiEvent> = _uiEvents.asSharedFlow()

    val allTasks: StateFlow<List<Task>> = repository.allTasks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val filteredTasks: StateFlow<List<Task>> = combine(
        allTasks,
        _selectedCategory,
        _searchQuery,
        _filterUrgentOnly
    ) { tasks, category, query, urgentOnly ->
        tasks.filter { task ->
            val matchesCategory = category == null || task.category == category
            val matchesQuery = query.isBlank() ||
                    task.title.contains(query, ignoreCase = true) ||
                    task.description.contains(query, ignoreCase = true)
            val matchesUrgent = !urgentOnly || task.isUrgent
            matchesCategory && matchesQuery && matchesUrgent
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val analytics: StateFlow<DashboardAnalytics> = allTasks.combine(MutableStateFlow(Unit)) { tasks, _ ->
        val total = tasks.size
        val completed = tasks.count { it.isCompleted }
        val pending = total - completed
        val percentage = if (total > 0) (completed.toFloat() / total.toFloat()) * 100f else 0f
        val urgent = tasks.count { it.isUrgent }
        val overdue = tasks.count { it.isOverdue }

        val categoryMap = TaskCategory.values().associateWith { cat ->
            tasks.count { it.category == cat }
        }

        DashboardAnalytics(
            totalTasks = total,
            completedCount = completed,
            pendingCount = pending,
            completionPercentage = percentage,
            urgentCount = urgent,
            overdueCount = overdue,
            categoryCounts = categoryMap
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DashboardAnalytics())

    fun setCategoryFilter(category: TaskCategory?) {
        _selectedCategory.value = category
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun toggleUrgentFilter() {
        _filterUrgentOnly.value = !_filterUrgentOnly.value
    }

    fun toggleTaskCompletion(task: Task) {
        viewModelScope.launch {
            val willBeCompleted = !task.isCompleted
            repository.toggleTaskCompletion(task.id, task.isCompleted)

            if (willBeCompleted) {
                reminderScheduler.cancelRemindersForTask(task.id)
                _uiEvents.emit(UiEvent.TaskCompleted(task))
            } else {
                reminderScheduler.scheduleRemindersForTask(task.copy(isCompleted = false))
            }
        }
    }

    fun saveTask(task: Task) {
        viewModelScope.launch {
            val existing = repository.getTaskById(task.id)
            if (existing != null) {
                repository.updateTask(task)
            } else {
                repository.insertTask(task)
            }
            reminderScheduler.scheduleRemindersForTask(task)
            _uiEvents.emit(UiEvent.ShowToast(if (existing != null) "Task updated" else "Task added!"))
        }
    }

    fun deleteTask(task: Task) {
        viewModelScope.launch {
            reminderScheduler.cancelRemindersForTask(task.id)
            repository.deleteTask(task)
            _uiEvents.emit(UiEvent.TaskDeleted(task))
        }
    }

    class Factory(
        private val repository: TaskRepository,
        private val reminderScheduler: ReminderScheduler
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return TaskViewModel(repository, reminderScheduler) as T
        }
    }
}
