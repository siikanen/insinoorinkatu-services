import { createStore, combineReducers,applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import usersReducer from './reducers/usersReducer'
import expensesReducer from './reducers/expensesReducer'
import alertReducer from './reducers/alertReducer'
const reducer = combineReducers({
  users: usersReducer,
  expenses: expensesReducer,
  alert: alertReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
