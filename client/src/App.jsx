import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from 'react-router-dom'
import MainNavBar from './components/MainNavBar';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';
import TagManager from "react-gtm-module";
import GoogleAnalytics from './components/GoogleAnalytics';

const tagManagerArgs = {
  gtmId: "GTM-MS8JP2FD", // Replace with your actual GTM ID
};

TagManager.initialize(tagManagerArgs);

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavBarPages = ['/', '/register', '/login', '/forget-password','/about','/features','/pricing','/market','/contact-us'];
  const hideFooterPages = ['/user-survey'];
  const isDynamicRoute = (path) => /^\/user-survey\/.+$/.test(path);
  const shouldHideNavBar = hideNavBarPages.includes(location.pathname) || isDynamicRoute(location.pathname);
  const shouldHideFooter = hideFooterPages.includes(location.pathname) || isDynamicRoute(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: "100vw" }}>
      {!shouldHideNavBar && <MainNavBar />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
     {!shouldHideFooter && <Footer />}  
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
const Analytics = lazy(() => import('./pages/Analytics'));
const Error404 = lazy(() => import('./pages/404Error'));
const UserAnalytics = lazy(() => import('./pages/UserAnalytics'));
const Usersurveyanalytics = lazy(() => import('./pages/User-survey-analytics'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const AdminSurveyData = lazy(() => import('./pages/AdminSurveyData'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const UserMarket = lazy(() => import('./pages/UserMarket'));
const About = lazy(() => import('./pages/About'));
const FeaturesHome = lazy(() => import('./pages/FeaturesHome'));

const App = () => {

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('userAccessToken'); // Change this according to your authentication mechanism
  };

  const isSuperAdmin = () => {
    console.log(JSON.parse(localStorage.getItem('userAccessToken')).isSuperAdmin, 'isSuperAdmin in protected routes');
    return JSON.parse(localStorage.getItem('userAccessToken')).isSuperAdmin; // Change this according to your authentication mechanism
  };

  const SuperAdminProtectedRoute = ({ element, ...rest }) => {
    if (isSuperAdmin()) {
      return element;
    } else {
      console.log(isSuperAdmin(), 'isSuperAdmin in FINALSprotected routes');
      console.log('User is not Super Admin');
      return <Navigate to="/404" />;
    }
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
        <GoogleAnalytics />
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
          path: '/terms-of-use',
          element: <TermsOfUse />,
        },
        {
          path: 'dapp/privacy-policy',
          element: <PrivacyPolicy />,
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
          path: "/pricing",
          element: <ProtectedRoute element={<ProductDisplay />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/payment-success",
          element: <ProtectedRoute element={<SuccessPaymentPage />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/admin-analytics",
          element: <SuperAdminProtectedRoute element={<Analytics />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/admin-analytics/:surveyId",
          element: <SuperAdminProtectedRoute element={<AdminSurveyData />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/user-analytics",
          element: <ProtectedRoute element={<UserAnalytics />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/user-survey-analytics/:surveyId",
          element: <ProtectedRoute element={<Usersurveyanalytics />} />, // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/contact-us",
          element: <ContactUs /> // Wrap Dashboard inside ProtectedRoute
        },
        {
          path: "/market",
          element:  <ProtectedRoute element={<UserMarket />} />,
          // Wrap Dashboard inside non-protected Route
        },
        {
          path: "/about",
          element:  <About /> // Wrap Dashboard inside non-protected Route
        },
        {
          path: "/features",
          element:  <FeaturesHome /> // Wrap Dashboard inside non-protected Route
        },
        {
          path: "/404",
          element: <Error404 /> // Wrap Dashboard inside ProtectedRoute
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
