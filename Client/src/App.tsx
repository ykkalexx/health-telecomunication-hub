import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/root";
import { PersistGate } from "redux-persist/integration/react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { NotificationSettings } from "./components/NotificationSettings";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="flex flex-col items-center justify-center w-screen h-screen">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<NotificationSettings />} />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
