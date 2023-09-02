import {env} from '@/env';
import AWS from 'aws-sdk';

const BUCKET_NAME = 'images-find-a-pet' as const;

type UploadInputS3 = {
  Bucket: typeof BUCKET_NAME;
  Key: string;
  Body: Buffer;
};

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.S3_REGION,
});
const s3 = new AWS.S3();

export function uploadImage(key: string, stream: Buffer) {
  const input: UploadInputS3 = {
    Body: stream,
    Bucket: BUCKET_NAME,
    Key: key,
  };

  s3.upload(input, (error: Error) => {
    if (error) {
      console.log(error.message);
      throw error;
    }
  });

  return getImageByKey(key);
}

export function getImageByKey(key: string) {
  const input = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const preSignedUrl = s3.getSignedUrl('getObject', {
    ...input,
  });

  return preSignedUrl;
}

export function deleteImageByKey(key: string) {
  const input = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  s3.deleteObject(input, (error) => {
    if (error) throw error;
  });
}

export function updateImage(key: string, stream: Buffer) {
  deleteImageByKey(key);
  return uploadImage(key, stream);
}
