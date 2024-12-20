import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment } from "react";
import Slider from "react-slick";


export default function HomePage(){

// creating an object for (react-slick-setting(s))
const SlickSettings = {
 dots: true,
 infinite: true,
 speed: 500,
 slidesToShow: 1,
 slidesToScroll: 1,
}; 

const divStyle = {
 display : 'block',
 width : '100%',
 maxHeight : 600
};

return(
    <Fragment>

    {/* carousel slider */}
     <Slider {...SlickSettings} >
      <div>
        <img src = "images/hero1.jpg" alt = "Hero image 1" style = {divStyle} />
      </div>

      <div>
        <img src = "images/hero2.jpg" alt = "Hero image 2" style = {divStyle} />
      </div>

      <div>
        <img src = "images/hero3.jpg" alt = "Hero image 3" style = {divStyle}/>
      </div>
     </Slider>

     <Box display = {'flex'} justifyContent = {'center'} alignItems = {'center'} paddingTop = {6} >
      <Typography variant = {'h2'} >
        {'Welcome to MyStore Shop!'}
      </Typography>
     </Box>
    </Fragment>
)
}