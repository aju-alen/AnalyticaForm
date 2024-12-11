import multer from 'multer';
import mutlerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

    console.log(BUCKET_NAME, 'BUCKET_NAME', REGION, 'REGION', ACCESS_KEY, 'ACCESS_KEY', SECRET_KEY, 'SECRET_KEY');

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
            console.log(file, 'file');
        },
        key: function (req, file, cb) {
            const fileName = `imageForm/${awsId}/${file.originalname}`;
            cb(null, fileName);
        }
    })
}).array('s3', 5);

export const uploadToAWSImage = async (req, res) => {
    const awsId = req.params.awsId;
    const ids = req.body; // Accessing the non-file fields sent with the request

    console.log(awsId, 'AWS ID');
    console.log(ids, 'IDs');

    try {
        // Upload new files
        const upload = uploadWithMulterImage(awsId);
        console.log(upload, 'upload');
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