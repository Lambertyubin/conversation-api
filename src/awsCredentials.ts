export default {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
  region: process.env.AWS_BUCKET_REGION!,
};
