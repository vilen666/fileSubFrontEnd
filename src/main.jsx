import React from 'react'
import { Provider } from 'react-redux';
import { store } from './store/store.jsx';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
    <ToastContainer/>
    <Provider store={store}>
      <App />
    </Provider>
    </>
)
