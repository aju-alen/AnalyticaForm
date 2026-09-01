import multer from 'multer';
import mutlerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import { prisma } from '../utils/prisma.js'
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
        let baseUrl = `https://dubai-analytica.s3.ap-south-1.amazonaws.com/`
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
        let baseUrl = `https://dubai-analytica.s3.ap-south-1.amazonaws.com/`
        let urlArr = []
        const filteredData = (data.Contents || []).filter((file) => file.Key.includes(`pdfForm/${awsId}/`))
        filteredData.map((file) => {
            const encodedKey = String(file.Key || '').split('/').map(encodeURIComponent).join('/')
            urlArr.push(baseUrl + encodedKey)
        })

        res.status(200).json({ message: 'Files fetched successfully', files: urlArr })
    }
    catch (err) {
        res.status(500).json({ message: 'An error occoured', error: err })
    }
}
