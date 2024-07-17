import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { store } from './redux/store';
import HomePage from './pages/HomePage';
import CoinDetails from './components/CoinDetails';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
