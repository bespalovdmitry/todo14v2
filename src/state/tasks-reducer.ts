import {TasksStateType} from '../App';
import {AddTodolistType, RemoveTodolistActionType, SetTodoLists} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from "redux";

export type SetTasksType = ReturnType<typeof setTasksAC>
export type AddTaskType = ReturnType<typeof addTaskAC>
export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistType
    | RemoveTodolistActionType
    | SetTodoLists
    | SetTasksType
    | AddTaskType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS": {
            return {...state, [action.todoListId]: action.tasks}
        }
        // case "SET-TODOLISTS": {
        //     const stateCopy = {...state}
        //     action.todoLists.forEach((tl) => {
        //         stateCopy[tl.id] = []
        //     })
        //     return stateCopy
        // }
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]:state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case "ADD-TASK": {
            return  {...state, [action.todoListId]:[action.task, ...state[action.todoListId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            state[action.todolistId] = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.todolistId];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (todoListId: string, tasks: Array<TaskType>) => {
    return {type: 'SET-TASKS', todoListId, tasks} as const
}

export const addTaskAC = (todoListId: string, task: TaskType) => {
    return {type: 'ADD-TASK', todoListId, task} as const
}

export const fetchTasksTC = (todoListId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todoListId)
            .then(res => dispatch(setTasksAC(todoListId, res.data.items)))
    }
}

export const createTaskTC = (todoListId: string, title: string) => {
  return (dispatch: Dispatch) => {
      todolistsAPI.createTask(todoListId, title)
          .then(res => dispatch(addTaskAC(todoListId, res.data.data.item)))
  }
}

export const removeTasksTC = (taskId: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then(() => dispatch(removeTaskAC(taskId, todolistId)))
    }
}

