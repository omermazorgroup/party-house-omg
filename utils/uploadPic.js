import axios from "axios";
import { Form } from "semantic-ui-react";

const uploadPic = async (media) => {
  try {
    const form = new FormData();
    form.append("file", media);
    form.append("upload_preset", process.env.CLOUDINARY_UPLOAD_FOLDER);
    form.append("cloud_name", "dwsdrdv3w");

    const res = await axios.post(process.env.CLOUDINARY_URL, form);
    return res.data.url;
  } catch (error) {
    return;
  }
};

export default uploadPic;
