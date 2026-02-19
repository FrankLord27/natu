import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9004'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadminpassword',
});

const bucketName = process.env.MINIO_BUCKET_NAME || 'naturajm-assets';

export async function uploadToMinio(file: Buffer, fileName: string, contentType: string) {
  // Ensure bucket exists
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
    
    // Set public read policy for the bucket
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetBucketLocation', 's3:ListBucket'],
          Resource: [`arn:aws:s3:::${bucketName}`],
        },
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
  }

  const objectName = `${Date.now()}-${fileName}`;
  
  await minioClient.putObject(bucketName, objectName, file, file.length, {
    'Content-Type': contentType,
  });

  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  const port = process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : '';
  
  // URL for the uploaded file
  return `${protocol}://${process.env.MINIO_ENDPOINT}${port}/${bucketName}/${objectName}`;
}

export default minioClient;
