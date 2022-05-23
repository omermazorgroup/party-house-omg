import styled from "styled-components"

export const ImagePreviewDiv = styled.div`
  cursor: pointer;
  position: absolute;
  top: 4.5%;
  right: 6.5%;
  padding: 0.3rem;
  background-color: white;
  border-radius: 50%;
  z-index: 70;
`;

export const ImagePreview = styled.img`
  object-fit: contain;
  height: 300px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.2rem;
  transition: all 0.22s ease-out;
`;

export const ImageContainerDiv = styled.div`
  position: relative;
  & ${ImagePreviewDiv}:hover + ${ImagePreview} {
    opacity: 0.55;
    filter: brightness(107%) contrast(80%);
  }
`;

export const Image = styled.img`
  object-fit: cover;
  height: 2.95rem;
  width: 2.95rem;
  border-radius: 50%;
`;
