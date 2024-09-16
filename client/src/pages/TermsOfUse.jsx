import React from 'react'
import theme from '../utils/theme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';



import { ThemeProvider } from '@mui/material/styles';

const TermsOfUse = () => {
  return (
    <ThemeProvider theme={theme}>
  <Box sx={{ display: { xs: '', md: 'none' } }} className='p-5'>
    <Typography variant='h5' color='#1976d2' gutterBottom  sx={{
        fontSize: 24,
    }} >
      Terms of Use
    </Typography>
    <Typography variant='p' gutterBottom>
      Last updated: September 02, 2024
      </Typography>
      <br />
    <Typography variant='p' gutterBottom>
    Welcome to Dubai Analytica, a division of RISE Ltd. (“Dubai Analytica or DA,” “we,” “us,” “our”) and thank you for using our products and services (“Services”). The following Terms and Conditions of Use (“Terms”) govern all use of the Services, so please read carefully.
    </Typography>
    <Divider variant='fullWidth' sx={{
      // backgroundColor: '#1976d2',
      height: 1.5,
      marginTop: 2,
    }}  />
    </Box>

  <Box sx={{ display: { xs: 'none', md: 'block' } }} className='p-20'>
    <Typography variant='h2' color='#1976d2' gutterBottom sx={{
        fontSize: '3rem',
    }}>
      Terms of Use
    </Typography>
    <Typography variant='p' gutterBottom>
      Last updated: September 02, 2024</Typography>
    <Typography variant='h6' gutterBottom>
    Welcome to Dubai Analytica, a division of RISE Ltd. (“Dubai Analytica or DA,” “we,” “us,” “our”) and thank you for using our products and services (“Services”). The following Terms and Conditions of Use (“Terms”) govern all use of the Services, so please read carefully.
    </Typography>
    
    <Divider variant='middle' sx={{
      // backgroundColor: '#1976d2',
      height: 1.5,
      marginTop: 2,
    }}  />
    </Box>
    <Container maxWidth='md'  >
          <Stack spacing={2} sx={{ mt: 2 }}>

          <Typography variant='h5' color='#1976d2' gutterBottom>
          1. ACCEPTANCE
          </Typography>
          <Typography variant='p'  gutterBottom>
          The Services are offered subject to your acceptance of these Terms, our Privacy Policy, and any additional terms and policies (including operating rules, guidelines and procedures) that may apply depending on your particular use of the Services.
            </Typography>
            <Typography variant='p'  gutterBottom>
By using the Services or by clicking on an acceptance box for these Terms, you are agreeing to be bound by these Terms, our Privacy Policy, and all other applicable terms and policies. If you do not agree with these Terms and policies, do not use or access the Services or click on the acceptance box.
            </Typography>
            <Typography variant='p' gutterBottom>  
If you will be using the Services on behalf of a company or any other entity, you agree to these Terms on behalf of that entity and you represent that you have the authority to do so. In such case, “you” and “your” will refer to that entity. Additionally, since the Services are available only to individuals who are at least 18 years old, you represent and warrant that you are at least 18 years old and take full responsibility for the selection and use of the Services. These Terms are void where prohibited by law, and the right to access the Services is revoked in such jurisdictions.

          </Typography>




          <Typography variant='h5' color='#1976d2' gutterBottom>
          2. REGISTRATION
          </Typography>
          <Typography variant='p'  gutterBottom>
          In order to use certain features of the Services, you may be required to register for a Services account. You warrant that any registration information (such as name, contact information, or other information) you submit to Dubai Analytica is accurate, complete, and not misleading, and you agree to keep such information up to date. Failure to do so constitutes a breach of these Terms and may result in immediate termination of your account. To the extent you are able to select a “user name,” you may not (i) select or use a username that is a name of another person with the intent to impersonate that person; (ii) use a username that is a name subject to any rights of a person other than you without appropriate authorization; or (iii) use a username that is offensive, vulgar, obscene, or unlawful. We reserve the right, in our sole discretion, to cancel or refuse registration of any user name we believe violates these Terms, our policies, or the law. You shall be responsible for maintaining the confidentiality of your password and other account information. Your login must only be used by one person; a single login shared by multiple people is not permitted. Dubai Analytica is not liable for any loss or damage from your failure to comply with this Section 2. We may use your registration information and any technical information about your use of the Services to tailor its presentations to you, facilitate your movement through the Services, communicate separately with you or publish the fact that you are a user of our services.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            3. YOUR CONTENT.
          </Typography>
          <Typography variant='p'  gutterBottom>
          As between you and Dubai Analytica, you retain ownership of the intellectual property rights of the content you submit to us or the Services (“Your Content”), except for the limited rights that enable us to perform the Services. In short, what’s yours is yours, but we do need certain permissions from you so that our processing, maintenance, storage, technical reproduction, back-up, distribution, and related handling of Your Content does not infringe applicable copyright and other laws. Therefore, in order to perform the Services, you grant us a non-exclusive, worldwide, royalty-free, transferable, and irrevocable (for so long as Your Content is stored with us) license to use, reproduce, and display Your Content as reasonably necessary to provide you with the Services. You are responsible for maintaining, protecting, and making backups of Your Content. To the maximum extent permitted by applicable law, we will not be liable for the loss or corruption of Your Content.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            4. OUR CONTENT.
          </Typography>
          <Typography variant='p'  gutterBottom>
          Using the Services does not give you ownership of any intellectual property rights in the Services. You agree that all Dubai Analytica content and materials delivered via the Services or otherwise made available by Dubai Analytica (collectively, “Our Content”) are protected by copyrights, trademarks, service marks, patents, trade secrets, or other proprietary rights and laws. Except as expressly authorized by Dubai Analytica in writing, you agree not to sell, license, rent, modify, distribute, copy, reproduce, transmit, publicly display, publicly perform, publish, adapt, edit, or create derivative works of Our Content. However, you may print or download a reasonable number of copies of Our Content for your own informational purposes; provided, that you retain all copyright and other proprietary notices within the copies. Reproducing, copying, or distributing any of Our Content or Dubai Analytica design elements for any other purpose is strictly prohibited without our express prior written permission. Use of Our Content for any purpose not expressly permitted in these Terms is prohibited. Dubai Analytica reserves any rights not expressly granted in these Terms.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            5. USE OF THE SERVICES.
          </Typography>
          <Typography variant='p'  gutterBottom>
          You represent and warrant that (i) your use of the Services will comply with all laws and regulations; (ii) Your Content will not infringe or violate any third-party intellectual property rights or any laws or regulations (including, without limitation, obscenity, defamation, and privacy laws); (iii) if you use the Services on behalf of any third party, you have all necessary authorizations; and (iv) your use of the Services will not conflict with any obligations you have to any third party. We reserve the right, in our sole discretion, to remove, modify, prevent access to, or refuse to display Your Content that we believe violates these Terms, our policies, or the law.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            6. ACCOUNTS AND FEES.
          </Typography>
          <Typography variant='p'  gutterBottom>
          Dubai Analytica offers a Free Account that you may use to try out our services; at any time, you may upgrade to any of Dubai Analytica’s paid subscriptions. If you are a paying user of the Services, you shall pay Dubai Analytica Service fees in accordance with this Section 6 and our pricing policy located at www.DubaiAnalytica.com/pricing (“Fees”). You will be billed for your first subscription term immediately upon upgrading to a paid subscription. Subscriptions will automatically renew for a period equal in length to the preceding subscription period. All Fees will be invoiced in advance (on an annual basis depending upon the subscription you purchase), and the credit card last used by you for a Dubai Analytica transaction will automatically be charged at the start of each subscription period. All Fees are non-refundable—without limitation, we shall provide no refunds or credits for partial months of Service, for upgrades or downgrades, or for unused months of an annual account. For any subscription upgrade, the credit card last used by you for a Dubai Analytica transaction will automatically be charged the new Fee on your next billing cycle. We reserve the right to change the Fees and to institute new charges and Fees at the end of each subscription period. Unpaid Fees are subject to a finance charge of 1.5% per month or the maximum permitted by law, whichever is lower, plus all expenses of collection. You shall be responsible for all taxes associated with the Services other than taxes based on Dubai Analytica’s net income. All inquiries related to billing and credit card charges should be made in writing to ATTN: Billing/Invoices, Dubai Analytica, Gate Avenue - Zone D - Level 1 Al Mustaqbal St - Za'abeel 2 - Dubai
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            7. DOWNGRADING A LICENSE
          </Typography>
          <Typography variant='p'  gutterBottom>
          Dubai Analytica provides its users with a free version for simple surveys or archiving purposes. However, this only contains basic functions that can be used to collect a limited number of responses.
            </Typography>
          <Typography variant='p'  gutterBottom>
          In the event of a downgrade of a commercial license to a Dubai Analytica Free user account or a lower license level previously used functionalities only available to the higher license level will be removed and limited to the basic functions of the lower License. Full access to the survey data may, in the case of earlier use of functions from the higher license, will not be available. In order to get access again, it is possible to upgrade the license at any time.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            8. CHANGES TO THE TERMS
          </Typography>
          <Typography variant='p'  gutterBottom>
          We may amend these Terms from time to time by posting an amended version in the Services and on our website. If you are a Free Account user, the amended version will become effective immediately as of the amended version’s Notice Date. If you are a new or returning user who registers for services on or after the Notice Date, the amended version will be effective immediately. If you are a current paying user of the Services, these Terms will continue under their original provisions for your original subscriptions, and the amended version will become effective at the start of your next Dubai Analytica subscription period (including any new subscription or any automatically renewed subscription). Your use of the Services after an amended version becomes effective will confirm your acceptance and consent of that amended version. It is your responsibility to check the Services or our website (regularly, if a Free Account user, or prior to the start of your next Dubai Analytica subscription period, if any other user) for amended versions of these Terms and to review any changes. These Terms may not be amended in any other way except through a written agreement executed by both you and an authorized representative of Dubai Analytica. Notwithstanding the foregoing, we may amend our Privacy Policy or all other auxiliary policies at any time by posting amended versions on our website; the amended versions will become effective immediately upon posting.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            9. CHANGES TO SERVICES
          </Typography>
          <Typography variant='p'  gutterBottom>
          Dubai Analytica is constantly innovating and evolving the Services in order to provide the best possible experience for our users. You acknowledge and agree that the form and nature of the Services may change from time to time without notice. Changes to the form and nature of the Services may include, without limitation, the alteration or removal of a functionality or aspect of the Services. You agree that we shall not be liable to you or to any third party for any modification, suspension or discontinuance of any part of the Services. You also agree that we may create limits on certain features and services or restrict your access to parts of the Services without notice or liability. (For example, if you use our Free subscription, you will not enjoy all of the benefits provided to subscribers of the Dubai Analytica Paid subscription.)
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            10. ANTI-SPAM AND EMAIL POLICY.
          </Typography>
          <Typography variant='p'  gutterBottom>
          Dubai Analytica expressly forbids all SPAM (the term "SPAM" meaning the sending of unsolicited email to parties unknown to the sender). If you are found to be using the Services for SPAM, your account will be subject to immediate termination. The Services may only be used in connection with email lists for which recipients have voluntarily registered. Using the Services to send email to an address you obtain without the consent of the addressee is a violation of these Terms. You are prohibited from importing email addresses for persons who have not affirmatively and clearly elected to receive your mailings. For clarity, you will only send email to persons who have willingly signed up to receive your mailings. If we receive complaints about your activities under this Section 9, your account may be subject to immediate termination. You will not send email under any company or organization name other than your own company/organization, and you will not send email with fraudulent or misleading header or source information. All email sent through the Services must be expressly for the purpose of collecting data using Dubai Analytica’s online surveys. Sending email through the Services to solicit any actions other than completing Dubai Analytica surveys is a violation of these Terms. You are fully responsible for the contents of your messages and the consequences of any such messages. We shall have no responsibility or liability for messages or other content that is created by you. You shall not send, post, distribute or disseminate any defamatory, obscene, or otherwise unlawful messages, material or information, including another person's proprietary information (including trademarks, trade secrets, or copyrighted information) without express authorization from the rights holder. Dubai Analytica will cooperate with legal authorities in releasing names and IP addresses of users who are involved in SPAM or illegal activities.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            11. OTHER RESTRICTIONS
          </Typography>
          <Typography variant='p'  gutterBottom>
          •You shall not use any “deep-link,” “page-scrape,” “robot,” “spider,” or other automatic device, program, algorithm, or methodology, or any similar or equivalent manual process (i) to access, acquire, copy, or monitor any portion of the Services or Our Content; (ii) to reproduce in any way or circumvent the navigational structure or presentation of the Services or Our Content; or (iii) to obtain or attempt to obtain any materials, documents, or information through any means not purposely made available through the Services. Additionally, you shall not use any device, software, or routine to interfere or attempt to interfere with the proper working of the Services or any transaction being conducted on the Services. We reserve the right to bar any such activity.
            </Typography>
          <Typography variant='p'  gutterBottom>
          •You shall not attempt to gain unauthorized access (i) to any portion or feature of the Services, (ii) to any systems or networks connected to the Services, (iii) to any Dubai Analytica server, or (iv) to any of the services offered on or through the Services, by hacking, password “mining”, or any other illegitimate means.
            </Typography>
          <Typography variant='p'  gutterBottom>
          •You shall not probe, scan, or test the vulnerability of the Services or any network connected to the Services, nor breach the security or authentication measures on the Services or any network connected to the Services. You shall not reverse look-up, trace, or seek to trace any information on any other user of or visitor to the Services or any other customer of Dubai Analytica, or exploit the Services or any service or information made available or offered by or through the Services.
            </Typography>
          <Typography variant='p'  gutterBottom>
          •You shall not take any action that imposes an unreasonable or disproportionately large load on the infrastructure of the Services or Dubai Analytica’s systems or networks, or any systems or networks connected to the Services. In the event of such actions, we reserve the right to implement measures to ensure the quality and availability of the Services for all other Dubai Analytica users.
            </Typography>
          <Typography variant='p'  gutterBottom>
          •You shall not forge headers or otherwise manipulate identifiers in order to disguise the origin of any message or transmittal you send to Dubai Analytica or send while using the Services. You shall not, in connection with the Services, pretend (e.g. through impersonation) that you are any other individual or entity. For Surveys sent in connection with the Services, you shall not attempt to remove any identifying footer such as "Powered by Dubai Analytica" or other similar message.
            </Typography>
          <Typography variant='p'  gutterBottom>
          •You shall not abuse or threaten to abuse (verbally, physically, or in writing) any Dubai Analytica customer, employee, or agent.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            12. SERVICE LEVELS
          </Typography>
          <Typography variant='p'  gutterBottom>
          The following services levels and this Section 12 apply to you only if you are an Enterprise Client user:
            </Typography>

            <Typography variant='p'  gutterBottom>
          •If you are a paying user, are not in breach of this Agreement, and are not delinquent with respect to any Fees, Dubai Analytica will use commercially reasonable efforts to make the Services available to you with an Uptime Percentage (defined below) of at least 99.5% during the course of the Uptime Calculation Period (defined below). Our calculation of uptime shall be definitive and final. In the event we determine that we did not meet the uptime commitment, as your sole remedy and Dubai Analytica’s exclusive liability, you will be eligible to receive a credit for an additional month of Services.
            </Typography>

            <Typography variant='p'  gutterBottom>
          •"Unavailable" means that your Services have no external connectivity during a 5-minute period.
            </Typography>

            <Typography variant='p'  gutterBottom>
          •"Uptime Percentage" is calculated by subtracting from 100% the percentage of 5-minute periods during the Uptime Calculation Period that the Services were in an Unavailable state, excluding downtime resulting directly or indirectly from Service Level Exclusions.
            </Typography>

            <Typography variant='p'  gutterBottom>
          •"Service Level Exclusions" are downtimes that shall not be deducted when calculating an Uptime Percentage; the Service Level Exclusions are as follows: (i) downtime caused by factors outside of our reasonable control, including any force majeure event or Internet access or related problems beyond the demarcation point of Dubai Analytica servers; (ii) downtime that results from any actions or inactions by you or any third party; (iii) downtime as a result of regular maintenance or patch builds; (iv) downtime as a result of significant upgrades or significant maintenance to Dubai Analytica software for which we have given notice; (v) downtime arising from our suspension and termination of your right to use the Services in accordance with these Terms or our policies.
            </Typography>
            <Typography variant='p'  gutterBottom>
          •"Uptime Calculation Period" is the 365-day period immediately preceding the date you make a confirmed claim via email to your account manager. If you have been using the Services for less than 365 days, the Uptime Calculation Period will still be deemed the preceding 365 days, but any days prior to you becoming a paying user will be deemed to have had 100% availability. Any downtime occurring prior to a successful service credit claim cannot be used for future claims.
            </Typography>

            <Typography variant='p'  gutterBottom>
          •Any claim must be received by your account manager within 30 days after a complaint of Unavailability incident. The claim must include (i) the text "SLA CLAIM" in the subject line, (ii) the dates and times of each Unavailability incident being claimed, and (iii) logs or documentation that corroborate your claimed Unavailability incidents.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            13. THIRD PARTY SITES
          </Typography>
          <Typography variant='p'  gutterBottom>
          The Services may allow you to link to other websites or resources on the Internet, and other websites or resources may contain links to the Dubai Analytica website and our Services. These other websites are not under our control, and you acknowledge that Dubai Analytica is not responsible or liable for the content, functions, accuracy, legality, appropriateness or any other aspect of these websites or resources. The inclusion of any such link does not imply endorsement by Dubai Analytica. You further acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any content, goods, information, or services available on or through any such website or resource.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            14. USE OF AI
          </Typography>
          <Typography variant='p'  gutterBottom>
          This section and the specific levels outlined below are applicable to users utilizing Dubai Analytica AI services:
            </Typography>
            <Typography variant='p'  gutterBottom>
          •AI-Enhanced Survey Design and Analysis: Dubai Analytica utilizes Artificial Intelligence (AI) technologies to assist clients in building sophisticated surveys, dashboards, and performing sentiment analysis. Our AI tools recommend survey structures, question types, and analysis models based on the industry and specific objectives of the client.
            </Typography>
            <Typography variant='p'  gutterBottom>
          •Data Usage and Training: The AI system continuously improves by analyzing aggregated data from surveys and responses. Data is anonymized and used solely to enhance the AI's understanding and prediction capabilities. This process helps in refining our AI models to offer more accurate suggestions and analytics to all users, without directly sharing or applying one client's specific data insights to another's projects.
            </Typography>
            <Typography variant='p'  gutterBottom>
          •Confidentiality and Data Protection: All data used to train our AI models is subject to strict confidentiality and data protection policies, ensuring compliance with relevant privacy laws and regulations. Clients retain ownership of their data, and Dubai Analytica commits to using such data only to deliver and improve the services offered.
            </Typography>
            <Typography variant='p'  gutterBottom>
          •AI Services Disclaimer: While Dubai Analytica's AI services aim to provide valuable insights and efficiencies, decisions based on AI recommendations are the sole responsibility of the client. Dubai Analytica does not guarantee the accuracy of AI-generated content or its applicability to specific client needs.
            </Typography>
            <Typography variant='p'  gutterBottom>
          •AI Service-Specific Restrictions: Use of Dubai Analytica's AI services is subject to certain restrictions, including prohibitions on reverse engineering, unauthorized access, and the use of AI for competitive benchmarking or development of similar services.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            15. INDEMNIFICATION
          </Typography>
          <Typography variant='p'  gutterBottom>
          Client will indemnify and hold Dubai Analytica harmless from and against all claims, demands, actions, settlements, judgments, damages, losses, liabilities, cost and expenses (including attorneys’ fees) arising from or related to any Client Content submitted to, posted to, or transmitted via, the Service by Client or any of its end users (including any Client Content that infringes the rights of any third party or otherwise violates any laws or regulations); provided that, Dubai Analytica provides Client with (i) prompt written notice of all claims and threats thereof, (ii) sole control of all defense and settlement activities and (iii) all reasonably requested assistance with respect thereto. Client will not be responsible for any settlements if they are not pre approved in writing.
            </Typography>

          <Typography variant='p'  gutterBottom>
          Dubai Analytica will defend, indemnify, and hold Client harmless from and against all third-party claims (and all resulting damages awarded to third parties, and costs and expenses, including reasonable attorneys’ fees) arising from infringement by the Service of any third-party U.S. patent, copyright or trademark; provided that, Client provides Dubai Analytica with (iv) prompt written notice of all claims and threats thereof, (v) sole control of all defense and settlement activities and (vi) all reasonably requested assistance with respect thereto. Dubai Analytica will not be responsible for any settlements it does not pre approve in writing.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            16. WARRANTY DISCLAIMER
          </Typography>
          <Typography variant='p'  gutterBottom>
          THE SERVICES ARE PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. Dubai Analytica MAKES NO WARRANTY THAT (I) THE SERVICES ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, (II) THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE, OR (III) THE RESULTS OF USING THE SERVICES WILL MEET YOUR REQUIREMENTS. SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OF IMPLIED WARRANTIES. IN SUCH JURISDICTIONS, THE FOREGOING DISCLAIMERS MAY NOT APPLY TO YOU INSOFAR AS THEY RELATE TO IMPLIED WARRANTIES.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            17. LIMITATION OF LIABILITY
          </Typography>
          <Typography variant='p'  gutterBottom>
          IN NO EVENT SHALL Dubai Analytica, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, VENDORS OR SUPPLIERS BE LIABLE UNDER CONTRACT, TORT, STRICT LIABILITY, NEGLIGENCE OR ANY OTHER LEGAL THEORY WITH RESPECT TO THE SERVICES (OR ANY CONTENT OR INFORMATION AVAILABLE THROUGH THE SERVICES): (I) FOR ANY LOST PROFITS OR SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES OF ANY KIND WHATSOEVER, EVEN IF FORESEEABLE, (II) FOR ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE (REGARDLESS OF THE SOURCE OF ORIGINATION), (III) FOR ANY ERRORS OR OMISSIONS IN ANY CONTENT OR INFORMATION OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF YOUR USE OF ANY CONTENT OR INFORMATION POSTED, E-MAILED, TRANSMITTED OR OTHERWISE MADE AVAILABLE AT OR THROUGH THE SERVICES, OR (IV) FOR ANY DIRECT DAMAGES IN EXCESS OF (IN THE AGGREGATE) US$500.00. THE FOREGOING LIMITATIONS SHALL NOT APPLY TO THE EXTENT PROHIBITED BY APPLICABLE LAW.
          </Typography>

          <Typography variant='h5' color='#1976d2' gutterBottom>
          18. TERMINATION BY YOU
          </Typography>
          <Typography variant='p'  gutterBottom>
          Subject to earlier termination as provided below, this Agreement shall commence on the Effective Date and continue for the initial subscription period specified in the applicable SOW; thereafter this Agreement will automatically renew for consecutive periods each equal in length to the initial subscription period (unless either party provides the other party with written notice of non-renewal at least thirty (30) days prior to the end of the then current period). Any current Statement of Work (or order form) governed by this Agreement will automatically extend for successive twelve month terms of service immediately following the current term if not terminated in writing between the Parties not less than thirty days prior to the end of the service period defined in that Statement of work or order form. Such renewal will be re-priced at an annual increase of thirteen point six percent (13.6%) to reflect a US CPI increase and increased cost of service. Either party may terminate this Agreement in the event the other party materially breaches this Agreement and fails to cure such breach within thirty (30) days (ten (10) days in the case of non-payment) from receipt of written notice thereof. Upon termination of this Agreement, all rights granted herein to Client will terminate and Client will make no further use of the Service.
            </Typography>

          <Typography variant='p'  gutterBottom>
          The above statement is only applicable for our Free, Essentials, Professional, Advanced, Corporate, Team Edition, and Research Edition plans.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            19. TERMINATION BY US
          </Typography>
          <Typography variant='p'  gutterBottom>
          We may restrict, suspend, or terminate the Services to you (i) if you fail to comply with these Terms or our policies (including without limitation, failure to pay any fees owed by you in relation to the Services) (ii) if you use the Services in a way that creates or could create liability for us, (iii) if you interfere with other’s use of the Services, (iv) if a law enforcement, judicial body, or other government agency requests us to do so, or (v) if we need to investigate suspected misconduct by you, (vi) if you exceed the maximum number of responses allowed per minute based on the restrictions on your license level. Any such restriction, suspension, or termination shall be made by us in our sole discretion, and we will not be responsible to you or any third party for any damages that may result or arise out of such restriction, suspension, or termination of your account and/or access to the Services. In the event of an urgent matter, we reserve the right to take immediate action without notice. Additionally, unless you are a paying user, we reserve the right to terminate and delete your account if you have not accessed the Services for a period of 365 days or longer.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            20. EFFECT OF TERMINATION
          </Typography>
          <Typography variant='p'  gutterBottom>
          Upon termination by either you or Dubai Analytica, (i) all of Your Content will be immediately deleted from the Services , (ii) you will no longer access (or attempt to access) the Services, (iii) all outstanding fees owed to Dubai Analytica will become immediately due and payable, and (iv) we shall have no obligation to retain any of Your Content. You are solely responsible for exporting Your Content from the Services prior to termination of the Services you receive.
            </Typography>

          <Typography variant='p'  gutterBottom>
          All provisions of these Terms that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, and limitations of liability.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            21. EXPORT AND TRADE CONTROLS.
          </Typography>
          <Typography variant='p'  gutterBottom>
          You agree not to import, export, re-export, or transfer, directly or indirectly, any part of the Services or any information provided on or through the Services except in full compliance with all United States, foreign and other applicable laws and regulations.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            22. ELECTRONIC COMMUNICATIONS AND NOTICES.
          </Typography>
          <Typography variant='p'  gutterBottom>
          By creating an account, you hereby consent to receive electronic communications from us, including marketing emails, product updates, and other business messages. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing. Electronic communications may be in the form of emails sent by us to the email address associated with your account or communications posted by us on the Dubai Analytica website, your “My Account” page, or the Services you utilize. We save all communication (chats, emails, and calls) between Dubai Analytica representatives and you for record-keeping, training and quality-assurance purposes.
            </Typography>
          <Typography variant='p'  gutterBottom>
          All notices to Dubai Analytica must be addressed in writing to: Dubai Analytica, a division of RISE Ltd., Gate Avenue - Zone D - Level 1 Al Mustaqbal St - Za'abeel 2 - Dubai. Dubai Analytica may provide notices to you via the email address associated with your account or through your Services account.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            23. RESOLVING DISPUTES
          </Typography>
          <Typography variant='p'  gutterBottom>
          We want to ensure that you have an excellent experience with Dubai Analytica. If you have a problem or concern, we encourage you to first contact your account manager or Live Chat support to try to resolve any issues. However, in the event of formal proceedings, you and Dubai Analytica agree that these Terms shall be governed by and construed in accordance with the laws of the state of Washington, as if made within Washington between two Washington residents, and agree to submit to the exclusive jurisdiction and venue of the state and Federal courts located in King County, Washington. Notwithstanding the foregoing sentence, (but without limiting either party’s right to seek injunctive or other equitable relief immediately, at any time, in any court of competent jurisdiction), any disputes arising with respect to these Terms shall be settled by arbitration in accordance with the rules and procedures of the Judicial Arbitration and Mediation Services, Inc. (“JAMS”). The arbitrator shall be selected by joint agreement of the parties. In the event the parties cannot agree on an arbitrator within thirty (30) days of the initiating party providing the other party with written notice that it plans to seek arbitration, an arbitrator shall be appointed by JAMS in accordance with its rules. The written decision of the arbitrator shall be final and binding on the parties and enforceable in any court. The arbitration proceeding shall take place in San Francisco, California, using the English language.
            </Typography>
          <Typography variant='p'  gutterBottom>
          YOU ALSO AGREE TO RESOLVE DISPUTES WITH US ONLY ON AN INDIVIDUAL BASIS, AND AGREE NOT TO BRING A CLAIM AS A PLAINTIFF OR A CLASS MEMBER IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. CLASS ARBITRATIONS, CLASS ACTIONS, PRIVATE ATTORNEY GENERAL ACTIONS, AND CONSOLIDATION WITH OTHER ARBITRATIONS ARE NOT ALLOWED.
            </Typography>
          <Typography variant='p'  gutterBottom>
          If you are a federal, state, or local government entity in the United States using the Services in your official capacity and legally unable to accept the controlling law, jurisdiction or venue provisions above, then those provisions do not apply to you. For such U.S. federal government entities, these Terms and any action related thereto will be governed by the laws of the United States of America (without reference to conflict of laws) and, in the absence of federal law and to the extent permitted under federal law, the laws of the State of California (excluding choice of law).
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            24. CONFIDENTIALITY
          </Typography>
          <Typography variant='p'  gutterBottom>
          During the term of this Agreement, each party (a "Disclosing Party") may provide the other party (a "Receiving Party") with confidential and/or proprietary materials and information ("Confidential Information"). All materials and information provided by Disclosing Party to Receiving Party and identified at the time of disclosure as “Confidential” or bearing a similar legend, and all other information that the Receiving Party reasonably should have known was the Confidential Information of the Disclosing Party, shall be considered Confidential Information; for the avoidance of doubt, the Service and terms of this Agreement are Confidential Information of Dubai Analytica. Receiving Party shall maintain the confidentiality of the Confidential Information and will not disclose such information to any third party without the prior written consent of the Disclosing Party. Receiving Party will only use the Confidential Information internally for the purposes contemplated hereunder. The obligations in this Section 4 shall not apply to any information that: (i) is made generally available to the public without breach of this Agreement, (ii) is developed by the Receiving Party independently from the Disclosing Party’s Confidential Information, (iii) is disclosed to Receiving Party by a third party without restriction, or (iv) was in the Receiving Party’s lawful possession prior to the disclosure to the Receiving Party and was not obtained by the Receiving Party either directly or indirectly from the Disclosing Party. Receiving Party may disclose Confidential Information as required by law or court order; provided that, Receiving Party provides Disclosing Party with prompt written notice thereof and uses its best efforts to limit disclosure. At any time, upon Disclosing Party’s request, Receiving Party shall return to Disclosing Party all Disclosing Party’s Confidential Information in its possession, including, without limitation, all copies and extracts thereof. Notwithstanding the foregoing, Receiving Party may disclose Confidential Information to any third-party to the limited extent necessary to exercise its rights, or perform its obligations, under this Agreement; provided that, all such third parties are bound in writing by obligations of confidentiality and non-use at least as protective of the Disclosing Party’s Confidential Information as this Agreement.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            25. NON-SOLICITATION
          </Typography>
          <Typography variant='p'  gutterBottom>
          Until one (1) year after termination of the Agreement, Client will not encourage or solicit any employee or consultant of Dubai Analytica to leave Dubai Analytica for any reason.
            </Typography>

            <Typography variant='h5' color='#1976d2' gutterBottom>
            26. MISCELLANEOUS
          </Typography>
          <Typography variant='p'  gutterBottom sx={{
            paddingBottom: '20px',
          }}>
          The failure of either party to exercise or enforce any right contained in these Terms, is not a waiver of either parties’ right to do so later. Dubai Analytica shall not be liable for any failure to perform its obligations in these Terms where such failure results from any cause beyond Dubai Analytica’s reasonable control, including, without limitation, mechanical, electronic or communications failure or degradation. If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect and enforceable. These Terms are not assignable, transferable, or sublicensable by you, except with our prior written consent. We may transfer, assign, or delegate these Terms and their rights and obligations without consent. Both parties agree that these Terms are the complete and exclusive statement of the mutual understanding of the parties and supersedes and cancels all previous written and oral agreements, communications, and other understandings relating to the subject matter of these Terms, and that all modifications must be in a writing signed by both parties, except as otherwise provided herein. No agency, partnership, joint venture, or employment is created as a result of these Terms and you do not have any authority of any kind to bind Dubai Analytica in any respect whatsoever.
            </Typography>

          </Stack>
          </Container>
    </ThemeProvider>
  )
}

export default TermsOfUse