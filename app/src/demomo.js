import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import DistrictDataFetcher from './components/Districtdatafetcher';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/district" element={<DistrictDataFetcher />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
