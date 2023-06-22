import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/home'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Chat } from './pages/chat'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Login } from './pages/login'
import './css/global.css'
import TeacherComment from './pages/teacher-comment'

const router = createBrowserRouter([
   {
      path: '/',
      element: <Home />
   },
   {
      path: '/chat',
      element: <Chat />
   },
   {
      path: '/login',
      element: <Login />
   },
   {
      path: '/teacher-comment',
      element: <TeacherComment />
   }])

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <React.StrictMode>
      <QueryClientProvider client={queryClient}>
         <RouterProvider router={router} />
      </QueryClientProvider>
   </React.StrictMode>
)
