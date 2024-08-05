import React, { useState, createContext, useContext } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store.jsx';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Loader } from './Components/Loader/Loader.jsx';

// Create a context to share the loading state
const LoadingContext = createContext();

// Custom hook to use the loading state in other components
export const useLoading = () => useContext(LoadingContext);

export const Main = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <LoadingContext.Provider value={{ loading, setLoading }}>
          <Loader loading={loading} />
          <App />
        </LoadingContext.Provider>
      </Provider>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
   <Main />
);
