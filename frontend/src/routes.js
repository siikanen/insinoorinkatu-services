import React from 'react'
import { Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import MainLayout from './layouts/MainLayout'

import DashboardView from './view/dashboard'
import LoginForm from './components/login/LoginForm'

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      // { path: 'account', element: <AccountView /> },
      // { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      // { path: 'products', element: <ProductListView /> },
      // { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginForm /> }
      // { path: 'register', element: <RegisterView /> },
      //     { path: '404', element: <NotFoundView /> },
      //     { path: '/', element: <Navigate to="/app/dashboard" /> },
      //     { path: '*', element: <Navigate to="/404" /> }
    ]
  }
]

export default routes
