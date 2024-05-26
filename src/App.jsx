import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import PaymentPage from './pages/PaymentPage';
import Imgmap from "./pages/Imgmap";


export default function App() {
  return (
    <div> 
      <BrowserRouter>
        <Routes>
          <Route path="payment" element={<PaymentPage />} />
          <Route path="imagemap" element={<Imgmap />} />

        </Routes>
      </BrowserRouter>
    </div> 
  );
}
