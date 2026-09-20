export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  s3Bucket: process.env.AWS_S3_BUCKET || ''
};
