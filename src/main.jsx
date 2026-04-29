import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.body.dir = 'rtl';
document.documentElement.lang = 'ar';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);