import {
  ArrowSmRightIcon, CameraIcon, XIcon
} from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import toast, { Toaster } from "react-hot-toast";
import Loader from "react-loader-spinner";
import { CustomInput } from "./HelperComponents/Inputs";
import { ImageContainerDiv, ImagePreviewDiv, ImagePreview} from "./HelperComponents/Image";
import { submitNewEvent } from "../utils/postActions";
import uploadPic from "../utils/uploadPic";
function CreateEventFormDropdown({ setCreateEventFormDropdown, setPosts, setError }) {
  const [newPost, setNewPost] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: ""
  })
  const ref = useRef(null);
  const filePickerRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const addImageFromDevice = (e) => {
  const { files } = e.target;
    setImage(files[0]);
    setImagePreview(URL.createObjectURL(files[0]));
  };
  const createEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    let picUrl;
    let isEvent = true;
    if (image !== null) {
      picUrl = await uploadPic(image);
      console.log(picUrl);
      if (!picUrl) {
        setLoading(false);
        return setError("Error uploading image");
      }
    }

    await submitNewEvent(
      newPost.eventName,
      newPost.eventDescription,
      picUrl,
      newPost.eventDate,
      isEvent,
      setPosts,
      setNewPost,
      setError
    );
    setImage(null);
    setImagePreview(null);
    setLoading(false);
    setCreateEventFormDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };


  useClickAway(ref, () => {
    setCreateEventFormDropdown(false);
  });
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        minHeight: "6rem",
        maxHeight: "90vh",
        backgroundColor: "white",
        zIndex: "100",
        overflow: "auto",
        padding: "1rem",
        borderRadius: "0.7rem",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        fontFamily: "Inter",
      }}
    >
        <div className="flex justify-between ml-1 mr-0.5 mb-1">
          <span></span>
          <Toaster />
          {loading ? (
            <Loader
              type="Puff"
              color="black"
              height={20}
              width={20}
              timeout={5000}
            />
          ) : (
            <ArrowSmRightIcon
              onClick={createEvent}
              className="h-7 w-7 cursor-pointer mb-5"
            />
          )}
        </div>
      <Container>
        <Label>
          Event Name
        </Label>
        <CustomInput
          name="eventName"
          onChange={handleChange}
        />
        <Label
        >
          Add Description
        </Label>
        <TextArea
          name="eventDescription"
          onChange={handleChange}
        />
        {imagePreview && (
          <>
            <ImageContainerDiv
              style={{ marginTop: "1.15rem", marginBottom: "-1.2rem" }}
            >
              <ImagePreviewDiv
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                <XIcon className="h-6 text-gray-700" />
              </ImagePreviewDiv>
              <ImagePreview
                src={imagePreview}
                alt="imagePreview"
              ></ImagePreview>
            </ImageContainerDiv>
          </>
        )}
        <div
          style={{
            margin: "1.6rem 2.2rem 0 2.2rem",
            minWidth: "21rem"
          }}
          onClick={() => filePickerRef.current.click()}
        >
          <CameraIcon className="h-11 pt-2 pb-2 pl-2.5 pr-2.5 rounded-full cursor-pointer hover:bg-gray-100"/>
          <input
              ref={filePickerRef}
              onChange={addImageFromDevice}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
            />
        </div>
        <Label
        >
          Date
        </Label>
        <CustomInput
            name="eventDate"
            onChange={handleChange}
            type="date"
        >
        </CustomInput>

      </Container>
    </div>
  );
}

export default CreateEventFormDropdown;

const ArrowDiv = styled.div`
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  padding: 0.75rem;
  :hover {
    background-color: #eee;
  }
`;

const Container = styled.div``;

const Label = styled.p`
  margin: 1.6rem 2.2rem 0;
  font-weight: 400;
  color: #8f85de;
  min-width: 21rem;
  line-height: 0.1;
`;

const TextArea = styled.textarea`
  font-size: 1.18rem;
  font-weight: 400;
  outline: none;
  padding: 18px;
  margin: 1.6rem 2.2rem 0 2.2rem;
  border: 1.5px solid #f0e6ff;
  color:black;
  border-radius: 10px;
  min-width: 21rem;
  :focus {
    border: 2px solid #a097ea;
  }
`
