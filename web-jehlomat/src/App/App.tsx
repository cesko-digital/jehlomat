import React from "react";
import PrimaryButton from "../Components/Buttons/PrimaryButton/PrimaryButton";
import StoryBook from "../Components/StoryBook";
import { Header } from '../Components/Header/Header';
import { Footer } from '../Components/Footer/Footer';

const HelloJehlomat = () => {
  return (
    <>
        <Header/>
        <h3>Hello Jehlomat</h3>
        <StoryBook/>
        <Footer />
    </>
  );
};

export default HelloJehlomat;
