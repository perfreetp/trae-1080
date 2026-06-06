import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Requirement from "@/pages/Requirement";
import Teams from "@/pages/Teams";
import Portfolio from "@/pages/Portfolio";
import Quotes from "@/pages/Quotes";
import Orders from "@/pages/Orders";
import Schedule from "@/pages/Schedule";
import Delivery from "@/pages/Delivery";
import Review from "@/pages/Review";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requirement" element={<Requirement />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </Layout>
    </Router>
  );
}
