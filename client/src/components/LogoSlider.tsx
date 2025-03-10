import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import { fetchLogos } from "../api/plaidAPI";

export const LogoSlider = () => {
  const [logos, setLogos] = useState<Array<string>>([]);
  const settings = {
    infinite: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
  };

  // get the logos
  useEffect(() => {
    
    const fetchedLogos = async () => {
      try {
        // get the entire response from the api
        const data = await fetchLogos();
        console.log(data);
        // thin it down by going inside the institutions object
        const institutionsArr = data.institutions;
        console.log(institutionsArr);
        // initialize the empty arrays
        const logosArr: string[] = [];
        const formattedLogosArr: string[] = [];
        let filteredFormattedLogosArr: string[];
        // iterate through the institutions array and get each object inside the array
        for (let i = 0; i < institutionsArr.length; i++) {
          const array = institutionsArr[i];
          console.log(array);
          // put all the objects.logo inside an array,
          if (array.logo) {
            logosArr.push(array.logo);
          }
        }
        // for each element, format it to get the logo url
        for (let j = 0; j < institutionsArr.length; j++) {
          const formattedLogo = `data:image/png;base64,${logosArr[j]}`;
          formattedLogosArr.push(formattedLogo);
        }
        // filter the null or undefined logos
        filteredFormattedLogosArr = formattedLogosArr.filter((element) => {
          return (
            element !== "data:image/png;base64,undefined" &&
            element !== "data:image/png;base64,null"
          );
        });
        console.log("logos array is", filteredFormattedLogosArr);
        setLogos(filteredFormattedLogosArr);
      } catch (error) {
        console.log("error fetching logos", error);
      }}
    fetchedLogos();
  }, []);
  return (
    <div className="flex justify-center gap-4 mb-8 text-center">
      {logos?.length ? (
        <div>
        <Slider {...settings}>
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Bank ${index}`}
              className="w-16 h-16 object-scale-down"
            />
          ))}
        </Slider>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
