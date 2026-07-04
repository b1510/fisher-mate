import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { CapturePage } from './pages/CapturePage'
import { ReviewPage } from './pages/ReviewPage'
import { HistoryPage } from './pages/HistoryPage'
import { StatsPage } from './pages/StatsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <CapturePage /> },
      { path: 'revue/:clientId', element: <ReviewPage /> },
      { path: 'historique', element: <HistoryPage /> },
      { path: 'stats', element: <StatsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
