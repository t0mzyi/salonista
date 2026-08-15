import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

import CustomerFlow from './modules/customer/CustomerFlow';
import StaffFlow    from './modules/staff/StaffFlow';
import OwnerFlow    from './modules/owner/OwnerFlow';
import AdminFlow    from './modules/admin/AdminFlow';

import NotFound from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/staff/*"   element={<StaffFlow />} />
          <Route path="/owner/*"   element={<OwnerFlow />} />
          <Route path="/admin/*"   element={<AdminFlow />} />
          <Route path="/*"         element={<CustomerFlow />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

