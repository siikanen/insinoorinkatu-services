import React from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'
import SingleExpenseView from './view/Expenses/ExpenseView/index'
import DashboardView from './view/dashboard/dashboardView'
import LoginView from './view/login/LoginView'
import RegisterView from './view/Users/Register/Register'
import UpdateExpenseView from './view/Expenses/UpdateExpenseView/index'
import CreateExpenseView from './view/Expenses/CreateExpenseView/CreateExpenseView'
import NotFoundView from './view/errors/NotFoundView'
import { Navigate } from 'react-router'
import AllExpensesView from './view/Expenses/AllExpenseView/index'
import AllUsersView from './view/Users/AllUsers'

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      {
        path: 'expenses',
        element: <AllExpensesView></AllExpensesView>
      },
      {
        path: 'expenses/update/:id',
        element: <UpdateExpenseView></UpdateExpenseView>
      },
      {
        path: 'expenses/create',
        element: <CreateExpenseView></CreateExpenseView>
      },
      { path: 'expenses/:id', element: <SingleExpenseView></SingleExpenseView> },
      { path: '404', element: <NotFoundView /> },

      {path: 'users', element: <AllUsersView></AllUsersView>},
      { path: '*', element: <Navigate to="/app/404"></Navigate> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      {path:'Register',element:<RegisterView></RegisterView>},
      { path: '/', element: <Navigate to="/login"></Navigate> }
      //{ path: '*', element: <Navigate to="/"></Navigate> }
    ]
  }
]

export default routes
