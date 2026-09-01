import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home.tsx";
import Auth from "../pages/Auth.tsx"
import NotFound from "../pages/NotFound.tsx";
import TermsOfUse from "../pages/Termsofuse.tsx";
import HelpCenter from "../pages/HelpCenter.tsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.tsx";
import Affiliates from "../pages/Affiliates.tsx";
import Dashboard from "../pages/aAuth/Dashboard.tsx";
import Profile from "../pages/aAuth/Profile.tsx";
import Settings from "../pages/aAuth/Settings.tsx";
import PrivateRoute from "../components/PrivateRoute.tsx";
import Recharge from "../pages/aAuth/Recharge.tsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth/>}/>
      <Route path="/afiliados" element={<Affiliates />} />
      <Route path="/termos" element={<TermsOfUse/>}/>
      <Route path="/central-de-ajuda" element={<HelpCenter/>}/>
      <Route path="/privacidade" element={<PrivacyPolicy/>}/>
      <Route path="*" element={<NotFound/>}/>

      {/* Protegido por login */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/configuracoes"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/recarga"
        element={
          <PrivateRoute>
            <Recharge />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}