import { useParams } from 'react-router-dom';

const CreateNewSurvey = () => {
  const { surveyId } = useParams();
   return (
    <div>Create New Survey</div>
  )
}

export default CreateNewSurvey