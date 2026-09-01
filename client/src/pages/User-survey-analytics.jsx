import { Navigate, useParams } from 'react-router-dom';

const Usersurveyanalytics = () => {
  const { surveyId } = useParams();
  return <Navigate to={`/dashboard/analytics/${surveyId}`} replace />;
};

export default Usersurveyanalytics;
