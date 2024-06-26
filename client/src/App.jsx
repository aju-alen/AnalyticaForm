import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from 'react-router-dom'
import MainNavBar from './components/MainNavBar';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavBarPages = ['/', '/register', '/login', '/forget-password'];
  const isDynamicRoute = (path) => /^\/user-survey\/.+$/.test(path);
  const shouldHideNavBar = hideNavBarPages.includes(location.pathname) || isDynamicRoute(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: "100vw" }}>
      {!shouldHideNavBar && <MainNavBar />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateNewSurvey = lazy(() => import('./pages/CreateNewSurvey'));
const UserSubmitSurvey = lazy(() => import('./pages/UserSubmitSurvey'));
const ProductDisplay = lazy(() => import('./pages/ProductDisplay'));
const SuccessPaymentPage = lazy(() => import('./pages/SuccessPaymentPage'));
const ForgetPassword = lazy(() => import('./pages/ForgetPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

const App = () => {

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('userAccessToken'); // Change this according to your authentication mechanism
  };

  const ProtectedRoute = ({ element, ...rest }) => {
    if (isAuthenticated()) {
      console.log('User is authenticated');
      return element;
    } else {
      console.log('User is not authenticated');
      return <Navigate to="/login" />;
    }
  };

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
        {
          path: "/user-survey/:surveyId",
          element: <UserSubmitSurvey />,
        },
        {
          path: "/forget-password",
          element: <ForgetPassword />,
        },
        {
          path: '/reset-password/:resetToken',
          element: <ResetPassword />,
        },
        {
          path: "/dashboard",
          element: <ProtectedRoute element={<Dashboard />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/dashboard/create-survey/:surveyId",
          element: <ProtectedRoute element={<CreateNewSurvey />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/product-display",
          element: <ProtectedRoute element={<ProductDisplay />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/payment-success",
          element: <ProtectedRoute element={<SuccessPaymentPage />} />, // Wrap Dashboard inside ProtectedRoute
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
