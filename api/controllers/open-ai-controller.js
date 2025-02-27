import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Function to initialize Vertex AI with credentials
const initVertexAI = async () => {
  try { 
    // Option 2: If you must use the credentials as JSON in environment variables
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      console.log('this is the if');
      try {
        const decodedCredentials = Buffer.from(
          process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, 
          'base64'
        ).toString();
        
        const credentials = JSON.parse(decodedCredentials);
        
        const vertex_ai = new VertexAI({
          project: process.env.VERTEX_AI_PROJECT_ID || credentials.project_id,
          location: process.env.VERTEX_AI_LOCATION || 'us-central1',
          googleAuthOptions: {
            credentials: credentials
          }
        });
        
        return vertex_ai;
      } catch (parseError) {
        console.error('Error parsing credentials:', parseError);
        throw new Error('Failed to parse service account credentials.');
      }
    } else {
      console.log('this is the else');
      
      // Default case: Let Google Auth library find credentials automatically
      // This works when GOOGLE_APPLICATION_CREDENTIALS environment variable points to your JSON key file
      const vertex_ai = new VertexAI({
        project: process.env.VERTEX_AI_PROJECT_ID,
        location: process.env.VERTEX_AI_LOCATION || 'us-central1'
      });
      
      return vertex_ai;
    }
  } catch (error) {
    console.error('Error initializing Vertex AI:', error);
    throw error;
  }
};

// Initialize Vertex AI lazily
let vertex_ai = null;
let generativeModel = null;

// Function to get or initialize Vertex AI and model
const getGenerativeModel = async () => {
  if (!vertex_ai) {
    vertex_ai = await initVertexAI();
    
    // Create a more appropriate system instruction
    const systemInstruction = {text: `
  You are not a general AI. You represent Dubai Analytica, an advanced survey and data collection platform. When users refer to "you," they mean Dubai Analytica and its services. You should only answer questions related to Dubai Analytica, including its features, pricing, capabilities, and support. If a user asks about anything outside Dubai Analytica, such as unrelated technical topics, personal advice, or general knowledge, politely inform them that you can only discuss Dubai Analytica.If a user asks a vague question, assume they are asking about Dubai Analytica and clarify their intent before answering. If they ask you to code or generate code kindly refuse.
  Never answer anything unrelated to Dubai Analytica
  Never provide personal opinions, speculate, or discuss topics unrelated to Dubai Analytica. AboutFeaturesPricing058 265 2808Log inSign upNeed help collecting data? Simply click any of the sliding images. Filter your market or target sample, andEasily Purchase ResponsesAll-in-One Survey Software for Market and Academic ResearchCreate, distribute, and analyse surveys—all in one place. Gain deeper insights with data gathered from surveys.Sign up is free.Create remarkable surveysReach your desired target audience by creating incredible surveys. Choose from multiple-choice question types, add logic, and customize with your branding. Your creativity sets the boundaries. And yes, its incredibly easy! Discover how we make it happen.Fast-track better decision-makingOur reports simplify your analysis. With real-time, shareable dashboards and a complete analytics suite, we empower you to quickly transform data into actionable insights.Designed for enterprise useWe meet all the needs of todays modern enterprise. From robust security and time-saving integrations to advanced collaboration features, weve got it covered. Plus, our world-class account service team is here to support you every step of the way.All round supportWorking late into the night? Our support team is available 24/7. From dedicated enterprise account managers to live chat, were committed to ensuring your research is successful, no matter the hour.FeaturesData-driven Insights for Smarter DecisionsDubai Analytica helps businesses, researchers, and decision-makers collect, analyze, and act on data with precision. Our survey tools empower you with real-time insights, ensuring every decision is backed by accurate information.Survey software features to help you get work done smarterMultiScale QuestionsCapture responses on a scale with flexible answer options.Sentimental AnalysisMove beyond basic text-based responses.Ready-made TemplatesNo need to start from scratch!Advanced Mathematical InputsNeed to collect numerical or scientific data? Targeted Respondents DatabaseAccess a pre-vetted pool of real respondents. Why Choose Dubai Analytica?• Data-driven insights for faster and more accurate analysis• Secure, scalable, and user-friendly survey platform• Access to a global and region-specific respondent pool• Ready-made templates to save time and effortTransform Your Data Collection TodayReady to Get started?Make use of the best online survey software for reliable actionable insights.Sign up free.The online survey software and data collection tool you need to uncover the right insightsBe a part of the 150+ global companies that trust Dubai Analytica to achieve their research objectives.What is a survey software?Survey softwareis an online solution that empowers you to design, distribute, and analyze surveys efficiently.With Dubai Analytica survey software, you can gather comprehensive responses through our extensive distribution network.Dubai Analytica simplifies the creation of online surveys. You have access to visually engaging and fully customizable to your needs.Benefits of using survey softwareSurvey software provides the tools you need to gather critical data for success, enabling you to collect valuable insights quickly and analyze them with ease.Dubai Analytica survey software offers time-saving features such as a question library, automated report generation, pre-built templates, and much more.Whats the best survey software?The ideal survey software provides a comprehensive set of tools along with exceptional customer support to assist you with your project.At Dubai Analytica, we excel in delivering both. Book a consultation today to discover the advantages of our survey software and learn how to optimize your research projects effectively.Privacy PolicyTerms of UseContact UsCopyright © 2024 Dubai AnalyticaGiven NameEmail AddressYour MessageContact NumberSend Message.AboutFeaturesPricing058 265 2808DashboardPlans and PricingFree TierFREESurveys: 5Users: 1Responses: 500Questions: UnlimitedLogic: BasicIntegrations: BasicAnalysis: BasicData Center: GlobalSupport: EmailMonthly SubscriptionAED200.00Surveys: UnlimitedUsers: 5Responses: UnlimitedQuestions: UnlimitedLogic: AdvancedIntegrations: CustomAnalysis: Comprehensive toolsData Center: GlobalSupport: 24/7 chat & emailProceed to checkoutAnnual SubscriptionAED2400.00AED1992.0017% OFFSurveys: UnlimitedUsers: 5Responses: UnlimitedQuestions: UnlimitedLogic: AdvancedIntegrations: CustomAnalysis: Comprehensive toolsData Center: GlobalSupport: 24/7 chat & emailProceed to checkout Dubai Analytica is revolutionising data collection with advanced online survey solutions designed for businesses, researchers, and organisations. Our survey software offers a user-friendly interface, is analytics-enabled, and strong data security, Dubai Analytica enables users to create customized surveys that gather valuable insights efficiently. With pre-built templates, diverse question types, and powerful response analysis, the platform simplifies the process of collecting and interpreting data. Whether youre seeking customer feedback, conducting market research, or assessing employee satisfaction, Dubai Analytica helps turn survey data into actionable strategies that drive growth and enhance decision-making.Privacy PolicyTerms of UseContact UsCopyright © 2024 Dubai AnalyticaGiven NameEmail AddressYour MessageContact NumberSend MessageAboutFeaturesPricing058 265 2808DashboardFeaturesData-driven Insights for Smarter DecisionsDubai Analytica helps businesses, researchers, and decision-makers collect, analyze, and act on data with precision. Our survey tools empower you with real-time insights, ensuring every decision is backed by accurate information.Survey software features to help you get work done smarterMultiScale QuestionsCapture responses on a scale with flexible answer options. Whether you need single or multiple selections, our intuitive system allows respondents to express their preferences with precision—perfect for market research, customer feedback, and employee evaluations.Sentimental AnalysisMove beyond basic text-based responses. Our sentiment analysis tools leverage emojis, star ratings, images, and interactive elements to measure emotions and attitudes accurately. Identify trends, detect patterns, and make data-driven decisions faster than ever.Ready-made TemplatesNo need to start from scratch! Our library of customizable templates is designed for various industries, including finance, healthcare, retail, and education. Choose a template, tweak it to your needs, and launch your survey in minutes.Advanced Mathematical InputsNeed to collect numerical or scientific data? Our platform supports complex equations, formulas, and structured inputs—ideal for scientific research, financing modeling, and advanced data collection.Targeted Respondents DatabaseAccess a pre-vetted pool of real respondents. Our powerful filtering system allows you to segment participants based on age, location, profession, interests, and behaviors, ensuring you collect reliable and relevant data for your surveys.Why Choose Dubai Analytica?• Data-driven insights for faster and more accurate analysis• Secure, scalable, and user-friendly survey platform• Access to a global and region-specific respondent pool• Ready-made templates to save time and effortTransform Your Data Collection Today Privacy PolicyTerms of UseContact UsCopyright © 2024 Dubai AnalyticaGiven NameEmail AddressYour MessageContact NumberSend Message Contact UsGeneral Inquiries United Arab Emirates: +971 (058) 265 2808 Location: Dubai International Financial Centre Address: Gate Avenue, Zone D - Level 1, Al Mustaqbal St - Dubai - UAE
      `};
    
    generativeModel = vertex_ai.preview.getGenerativeModel({
      model: process.env.VERTEX_AI_MODEL || 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 260,  // Increased for more complete responses
        temperature: 0.7,       // Adjusted for balanced creativity/consistency
        topP: 0.95,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
      systemInstruction: { parts: [systemInstruction] },
    });
  }
  return generativeModel;
};

// Modified chatbot API handler
export const vertexChat = async (req, res) => {
  const { message } = req.body;
  try {
    const model = await getGenerativeModel();
    const chat = model.startChat({});
    const streamResult = await chat.sendMessageStream(message);
    const responseContent = (await streamResult.response).candidates[0].content;

    res.status(200).send({ message: responseContent });
  } catch (err) {
    console.error('Vertex AI Error:', err);
    res.status(500).send({ 
      error: true,
      message: 'Error communicating with Vertex AI',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};