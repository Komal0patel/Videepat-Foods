import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PageList from './pages/PageList';
import PageEditor from './pages/PageEditor';
import ProductList from './pages/ProductList';
import ProductEditor from './pages/ProductEditor';
import CouponList from './pages/CouponList';
import CouponEditor from './pages/CouponEditor';
import Dashboard from './pages/Dashboard';
import ThemeSettings from './pages/ThemeSettings';
import Settings from './pages/Settings';
import StoryList from './pages/StoryList';
import StoryEditor from './pages/StoryEditor';
import HeroEditor from './pages/HeroEditor';
import { StoreProvider } from './context/StoreContext';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Editor has its own layout or no sidebar */}
          <Route path="/pages/edit/:id" element={<PageEditor />} />
          <Route path="/pages/new" element={<PageEditor />} />
          <Route path="/stories/edit/:id" element={<StoryEditor />} />
          <Route path="/stories/new" element={<StoryEditor />} />

          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pages" element={<PageList />} />
                <Route path="/stories" element={<StoryList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/new" element={<ProductEditor />} />
                <Route path="/products/edit/:id" element={<ProductEditor />} />
                <Route path="/coupons" element={<CouponList />} />
                <Route path="/coupons/new" element={<CouponEditor />} />
                <Route path="/coupons/edit/:id" element={<CouponEditor />} />
                <Route path="/hero" element={<HeroEditor />} />
                <Route path="/theme" element={<ThemeSettings />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
