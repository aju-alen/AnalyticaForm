import multer from 'multer';
import mutlerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import { prisma } from '../utils/prisma.js'
import { requireSurveyAccess, requesterIsSuperAdmin } from '../utils/surveyAccess.js';
import { userHasActiveProSubscription } from '../utils/planLimits.js';
import dotenv from 'dotenv';
dotenv.config();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_KEY;


const s3 = new S3({
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY
    },

    region: REGION
});

const uploadWithMulterImage = (awsId) => multer({
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileName = `imageForm/${awsId}/${file.originalname}`;
            cb(null, fileName);
        }
    })
}).array('s3', 5);

const isPdfUpload = (file) => {
    const name = String(file?.originalname || '').toLowerCase();
    return file?.mimetype === 'application/pdf' || name.endsWith('.pdf');
};

const S3_PUBLIC_BASE = 'https://dubai-analytica.s3.ap-south-1.amazonaws.com/';
const BRAND_LOGO_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']);
const BRAND_LOGO_EXT = /\.(png|jpe?g|gif|webp|svg)$/i;

function isBrandLogoUpload(file) {
    const name = String(file?.originalname || '').toLowerCase();
    return BRAND_LOGO_TYPES.has(file?.mimetype) || BRAND_LOGO_EXT.test(name);
}

function safeFileName(name) {
    const cleaned = String(name || 'logo').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    return cleaned || 'logo';
}

function publicUrlForKey(key) {
    const encodedKey = String(key || '').split('/').map(encodeURIComponent).join('/');
    return S3_PUBLIC_BASE + encodedKey;
}

const uploadWithMulterBrandLogo = (userId, surveyId) => multer({
    fileFilter: function (req, file, cb) {
        if (isBrandLogoUpload(file)) {
            cb(null, true);
        } else {
            cb(new Error('Only PNG, JPG, GIF, WEBP, or SVG images are allowed'));
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        contentType: function (req, file, cb) {
            cb(null, file.mimetype || 'application/octet-stream');
        },
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileName = `brandLogo/${userId}/${surveyId}/${Date.now()}-${safeFileName(file.originalname)}`;
            cb(null, fileName);
        }
    })
}).array('s3', 1);

const uploadWithMulterPdf = (awsId) => multer({
    fileFilter: function (req, file, cb) {
        if (isPdfUpload(file)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    storage: mutlerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        contentType: function (req, file, cb) {
            cb(null, 'application/pdf');
        },
        contentDisposition: 'inline',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const fileName = `pdfForm/${awsId}/${file.originalname}`;
            cb(null, fileName);
        }
    })
}).array('s3', 1);

export const uploadToAWSImage = async (req, res) => {
    const awsId = req.params.awsId;
    const ids = req.body; // Accessing the non-file fields sent with the request

    try {
        // Upload new files
        const upload = uploadWithMulterImage(awsId);
        upload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: 'An error occurred', error: err });
            } else {
                res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
};

// Get all uploaded FULL ISSUE files URL to store in db
export const fetchImageDetails = async (req, res) => {
    const { awsId } = req.params;
    try {
        const data = await s3.listObjects({
            Bucket: BUCKET_NAME
        });
        let baseUrl = S3_PUBLIC_BASE
        let urlArr = []
        console.log(data,'data from s3');
        const filteredData = data.Contents.filter((file) =>  file.Key.includes(`imageForm/${awsId}/`) )
        console.log(baseUrl, 'baseUrl', filteredData, 'filteredData');
        filteredData.map((file) => {
           
            urlArr.push(baseUrl + file.Key)
        })
     
        res.status(200).json({ message: 'Files fetched successfully', files: urlArr })
    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}

export const uploadToAWSPdf = async (req, res) => {
    const awsId = req.params.awsId;

    try {
        const upload = uploadWithMulterPdf(awsId);
        upload(req, res, (err) => {
            if (err) {
                res.status(500).json({ message: 'An error occurred', error: err.message || err });
            } else {
                res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
};

export const fetchPdfDetails = async (req, res) => {
    const { awsId } = req.params;
    try {
        const data = await s3.listObjects({
            Bucket: BUCKET_NAME
        });
        let baseUrl = S3_PUBLIC_BASE
        let urlArr = []
        const filteredData = (data.Contents || []).filter((file) => file.Key.includes(`pdfForm/${awsId}/`))
        filteredData.map((file) => {
            urlArr.push(publicUrlForKey(file.Key))
        })

        res.status(200).json({ message: 'Files fetched successfully', files: urlArr })
    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}

function pdfKeyFromStoredUrl(urlString) {
    if (!urlString || typeof urlString !== 'string') return null;
    try {
        const parsed = new URL(urlString);
        const allowedHosts = new Set([
            `${BUCKET_NAME}.s3.${REGION}.amazonaws.com`,
            `${BUCKET_NAME}.s3.amazonaws.com`,
            'dubai-analytica.s3.ap-south-1.amazonaws.com',
        ].filter(Boolean));
        if (!allowedHosts.has(parsed.hostname)) return null;
        const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
        if (!key.startsWith('pdfForm/') || key.includes('..')) return null;
        return key;
    } catch {
        return null;
    }
}

export const viewPdf = async (req, res) => {
    const key = pdfKeyFromStoredUrl(req.query.url);
    if (!key) {
        return res.status(400).json({ message: 'Invalid PDF' });
    }
    try {
        const data = await s3.getObject({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Cache-Control', 'private, max-age=300');
        res.removeHeader('X-Frame-Options');

        if (data.Body && typeof data.Body.pipe === 'function') {
            return data.Body.pipe(res);
        }
        const bytes = await data.Body.transformToByteArray();
        return res.send(Buffer.from(bytes));
    } catch (err) {
        console.error('[viewPdf]', err?.message || err);
        return res.status(404).json({ message: 'PDF not found' });
    }
};

export const uploadBrandLogo = async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const access = await requireSurveyAccess(req, res, surveyId);
        if (!access) return;

        const requesterPro = await userHasActiveProSubscription(prisma, req.tokenId);
        if (!requesterPro && !(await requesterIsSuperAdmin(req))) {
            return res.status(403).json({ message: 'Custom branding is available on the Premium plan.' });
        }

        const upload = uploadWithMulterBrandLogo(access.userId, surveyId);
        upload(req, res, (err) => {
            if (err) {
                const message = err.code === 'LIMIT_FILE_SIZE'
                    ? 'Logo must be 2 MB or smaller.'
                    : (err.message || 'An error occurred');
                const status = err.code === 'LIMIT_FILE_SIZE' ? 400 : 500;
                return res.status(status).json({ message, error: err.message || err });
            }
            const file = req.files?.[0];
            if (!file?.key) {
                return res.status(400).json({ message: 'No logo file was uploaded.' });
            }
            return res.status(200).json({
                message: 'Logo uploaded successfully',
                url: publicUrlForKey(file.key),
                key: file.key,
            });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}
