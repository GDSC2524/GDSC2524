import { NextApiRequest, NextApiResponse } from 'next';
import { S3DbClient } from '../../../utils/clients/S3DbClient';
import { IS3Object } from '../../../models/data/IS3Object';
import { HttpMethod, METHOD_NOT_ALLOWED } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Validate request method
    if (req.method !== HttpMethod.POST) {
        return res.status(405).send({ message: METHOD_NOT_ALLOWED });
    }

    // Validate query parameters, destructuring assignment
    const { file, fileType } = req.query;

    if (typeof file !== 'string' || typeof fileType !== 'string' || !file || !fileType) {
        return res.status(400).json({ error: 'Invalid or missing query parameters' });
    }

    const s3DbClient = new S3DbClient();

    const s3Object: Omit<IS3Object, 'url'> = {
        objectId: file,
        fileType: fileType,
    };

    try {
        const presignedPost = await s3DbClient.getPresignedPost(s3Object);
        return res.status(200).json(presignedPost);
    } catch (error) {
        console.error('Failed to create presigned post:', error);
        return res.status(500).json({ error: 'Failed to create presigned post.' });
    }
}
