import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "@adimis/react-formix/dist/style.css";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="h-full">
      <div className='flex justify-center sm:m-3 m-1 items-center h-full'>
        <App />
      </div>
    </div>
  </React.StrictMode>,
)
