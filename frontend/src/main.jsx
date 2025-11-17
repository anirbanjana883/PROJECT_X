import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Tailwind import

// 1. Import Router
import { BrowserRouter } from 'react-router-dom'

// 2. Import Redux
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

// 3. Import Theme Context
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux Store Provider (Outermost) */}
    <Provider store={store}>
      
      {/* React Router */}
      <BrowserRouter>
        
        {/* Theme Context Provider */}
        <ThemeProvider>
          <App />
        </ThemeProvider>
        
      </BrowserRouter>
      
    </Provider>
  </React.StrictMode>,
)