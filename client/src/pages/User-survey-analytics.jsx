import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosWithAuth } from '../utils/customAxios'
import axios from 'axios'
import { backendUrl } from '../utils/backendUrl'


const Usersurveyanalytics = () => {
  const {surveyId} = useParams()
  const[singleSurveyIpData,setSingleSurveyIpData] = useState([])
  const getIpData = async () => {
  try{
    const response = await axiosWithAuth.get( `${backendUrl}/api/survey/get-ip-single-survey/${surveyId}`)
    console.log(response.data,'ip resp');
    const ipAddresses = response.data     
  }
  catch(error){
    console.log(error)
  }
  }

  useEffect(() => {
    getIpData()
  }, [])

  return (
    <div>User-survey-analytics</div>
  )
}

export default Usersurveyanalytics