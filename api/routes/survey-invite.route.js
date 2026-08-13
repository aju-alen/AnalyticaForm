import express from 'express';
import { apiCallLimiter } from '../middleware/rateLimiter.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import {
    listContacts,
    createContact,
    importContacts,
    deleteContact,
    listCampaigns,
    createCampaign,
    listCampaignRecipients,
    trackInvite,
    unsubscribeInvite,
} from '../controllers/survey-invite-controller.js';

const router = express.Router();

router.get('/contacts', apiCallLimiter, verifyJwt, listContacts);
router.post('/contacts', apiCallLimiter, verifyJwt, createContact);
router.post('/contacts/import', apiCallLimiter, verifyJwt, importContacts);
router.delete('/contacts/:contactId', apiCallLimiter, verifyJwt, deleteContact);
router.get('/campaigns/:surveyId', apiCallLimiter, verifyJwt, listCampaigns);
router.post('/campaigns/:surveyId', apiCallLimiter, verifyJwt, createCampaign);
router.get('/campaigns/:surveyId/:campaignId/recipients', apiCallLimiter, verifyJwt, listCampaignRecipients);
router.get('/track/:token', apiCallLimiter, trackInvite);
router.get('/unsubscribe/:token', apiCallLimiter, unsubscribeInvite);

export default router;
