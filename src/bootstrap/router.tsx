import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import HomeLayout from '@/layouts/Home/HomeLayout';
import AppError from '@/views/app/error/AppError';

const Home = lazy(() => import('@/views/app/home'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <AppError />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
