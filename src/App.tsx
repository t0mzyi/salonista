import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CustomerFlow from './modules/customer/CustomerFlow';
import StaffFlow    from './modules/staff/StaffFlow';
import OwnerFlow    from './modules/owner/OwnerFlow';
import AdminFlow    from './modules/admin/AdminFlow';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*"         element={<CustomerFlow />} />
        <Route path="/staff/*"   element={<StaffFlow />} />
        <Route path="/owner/*"   element={<OwnerFlow />} />
        <Route path="/admin/*"   element={<AdminFlow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
