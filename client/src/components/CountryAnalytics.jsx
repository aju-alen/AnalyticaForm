import React from 'react'
import { Container, Paper, Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'

const CountryAnalytics = ({customerData}) => {
    console.log(customerData,'countryIPData');
    
    return (
        <Container>
            <Typography variant="h4" align="center" color="primary" gutterBottom sx={{
                mt: 3
            }}>
                Chart Analytics
            </Typography>

            <Container component={Paper} >
                <Stack direction='row'>
                    <Stack>
                        <Typography variant="h6" align="center" color="primary" gutterBottom>
                            Survey Responses
                        </Typography>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: customerData.map((data) => data.surveyTitle) }]}
                            series={[{ data: customerData.map((data) => data.surveyResponses) }]}
                            width={300}
                            height={200}
                        />
                    </Stack>
                    <Stack>
                        <Typography variant="h6" align="center" color="primary" gutterBottom>
                            Survey Viewed
                        </Typography>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: customerData.map((data) => data.surveyTitle) }]}
                            series={[{ data: customerData.map((data) => data.surveyViews) }]}
                            width={300}
                            height={200}
                        />
                    </Stack>
                    <Stack>
                        <Typography variant="h6" align="center" color="primary" gutterBottom>
                            Survey Completed
                        </Typography>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: customerData.map((data) => data.surveyTitle) }]}
                            series={[{ data: customerData.map((data) => data.surveyCompleted) }]}
                            width={300}
                            height={200}
                        />
                    </Stack>
                </Stack>

            </Container>
        </Container>
    )
}

export default CountryAnalytics