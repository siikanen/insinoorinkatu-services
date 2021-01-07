import React from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import Expense from './view/Expenses/ExpenseView/Expense'
import DashboardView from './view/dashboard/dashboardView'
import LoginForm from './components/login/LoginForm'
import UpdateExpenseView from './view/Expenses/UpdateExpenseView/UpdateExpenseView'
import CreateExpenseView from './view/Expenses/CreateExpenseView/CreateExpenseView'
import NotFoundView from './view/errors/NotFoundView'
import { Navigate } from 'react-router'

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      {
        path: 'expenses/update/:id',
        element: <UpdateExpenseView></UpdateExpenseView>
      },
      {
        path: 'expenses/create',
        element: <CreateExpenseView></CreateExpenseView>
      },
      { path: 'expenses/:id', element: <Expense></Expense> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/app/404"></Navigate> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [{ path: 'login', element: <LoginForm /> }]
  }
]

export default routes
