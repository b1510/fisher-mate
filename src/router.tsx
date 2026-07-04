import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { CapturePage } from './pages/CapturePage'
import { ReviewPage } from './pages/ReviewPage'
import { HistoryPage } from './pages/HistoryPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <CapturePage /> },
      { path: 'revue', element: <ReviewPage /> },
      { path: 'historique', element: <HistoryPage /> },
    ],
  },
])
