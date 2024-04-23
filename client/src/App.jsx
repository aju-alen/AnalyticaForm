import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth:"100vw" }}>

      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout> {/* Render Layout component here */}
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet /> {/* Render Outlet inside Layout */}
          </Suspense>
        </Layout>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;