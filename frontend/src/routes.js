import React from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import Expense from './view/Expenses/ExpenseView/Expense'
import DashboardView from './view/dashboard/dashboardView'
import LoginForm from './components/login/LoginForm'
import CreateExpenseView from './view/Expenses/CreateExpenseView/CreateExpenseView'

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      {
        path: 'expenses/create',
        element: <CreateExpenseView></CreateExpenseView>
      },
      { path: 'expenses/:id', element: <Expense></Expense> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [{ path: 'login', element: <LoginForm /> }]
  }
]

export default routes
