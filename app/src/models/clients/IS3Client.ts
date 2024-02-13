import { IS3Object } from '../data';

export interface IS3Client {
    getPresignedPost(object: Omit<IS3Object, 'url'>): Promise<{ url: string, fields: any }>;
}
