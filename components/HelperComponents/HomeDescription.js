import React from "react";
import styled from "styled-components";
import {Subheading} from "./Headings"
function HomeDescription() {
  return (
    <>
    <Subheading fontSize={"1.48rem"}>
    Share your experiences
    <br></br>
    Meet new people
    <br></br>
    Enjoy
    </Subheading>
    <div>
      <Image
        src="https://res.cloudinary.com/dwsdrdv3w/image/upload/v1652381703/Happy_friends_drinking_wine_or_beer_together-removebg_hzqe8x.png"
      />
    </div>
    <Subheading fontSize={"1.48rem"}>
      This app was established by O.M.G
      <br></br>
      Copyright &copy; 2022
    </Subheading>
    </>
  );
}

export default HomeDescription;

const Image = styled.img`
  object-fit: cover;
  height: auto;
  width: 100%;
  max-width:100%;
`;
