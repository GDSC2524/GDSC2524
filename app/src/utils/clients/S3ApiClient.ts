import { IS3Client } from '../../models/clients/IS3Client';
import { IS3Object } from '../../models/data/IS3Object';

export class S3ApiClient implements IS3Client {
    async getPresignedPost(object: Omit<IS3Object, 'url'>): Promise<{ url: string, fields: any }> {
        const res = await fetch(`/api/attachment/upload-url?file=${encodeURIComponent(object.objectId)}&fileType=${encodeURIComponent(object.fileType)}`);

        if (!res.ok) {
            throw new Error('Failed to get the signed URL.');
        }

        return await res.json();
    }
}
