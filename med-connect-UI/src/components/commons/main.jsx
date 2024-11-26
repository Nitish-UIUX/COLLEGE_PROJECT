import React from "react";

import Hero from "./main-pages/Hero";
import MedOption from "./main-pages/MedOption";
import About from "./main-pages/About";
import InTouch from "./main-pages/InTouch";
import FAQPage from "./main-pages/FAQ";
// import Footer from "../global/Footer";
import TheListed from "./main-pages/TheListed";
// import VerticalCardSlider from "./main-pages/VerticalCardSlider";



function Main() {
    return (
        <div>
        <Hero  />
        <MedOption /> 
        <About /> 
        <InTouch />
        <TheListed />
        <FAQPage />
       {/* <VerticalCardSlider /> */}
        {/* <Footer /> */}


        </div>
    );
    }

export default Main;