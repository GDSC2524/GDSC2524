import React, {useMemo} from 'react';
import { S3ApiClient } from '../../utils/clients/S3ApiClient';
import { IS3Object } from '../../models/data/IS3Object';

const Attachment = () => {
    const s3ApiClient = useMemo(() => new S3ApiClient(), []);

    const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.error('No file selected.');
            return;
        }

        const s3Object: Omit<IS3Object, 'url'> = {
            objectId: encodeURIComponent(file.name),
            fileType: encodeURIComponent(file.type),
        };

        try {
            const { url, fields } = await s3ApiClient.getPresignedPost(s3Object);

            const formData = new FormData();
            Object.entries({ ...fields, file }).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            const upload = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (upload.ok) {
                console.log('Uploaded successfully!');
            } else {
                console.error('Upload failed.');
            }
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
    };

    return (
        <>
            <p>Upload a .png or .jpg image (max 1MB).</p>
            <input onChange={uploadPhoto} type="file" accept="image/png, image/jpeg" />
        </>
    );
};

export default Attachment;
