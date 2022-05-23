module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"]
  },
  env: {
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/dwsdrdv3w/image/upload",
    CLOUDINARY_UPLOAD_FOLDER: "my-uploads"
  }, //url for image upload to cloudinary. First copy "API base url" from Cloudinary. Then paste it here.
};
