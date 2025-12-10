import CalorieConverter from './pages/CalorieConverter';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Calorie Converter',
    path: '/',
    element: <CalorieConverter />
  }
];

export default routes;
