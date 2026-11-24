import FeaturdProducts from "./_components/FeaturdProducts/FeaturdProducts";
import Slider from "./_components/Slider/Slider";
import StoreFeatures from "./_components/StoreFeatures/StoreFeatures";
import img0 from "../assets/images/image0.jpg";
import img1 from "../assets/images/image1.jpg";
import img2 from "../assets/images/image2.jpg";
// import HomeCategories from './_components/HomeCategories/HomeCategories';
import { lazy, Suspense } from "react";

const LazyHomeComponent = lazy(
  () => import("./_components/HomeCategories/HomeCategories"),
);

const slidesData = [
  {
    image: img0.src,
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
    primaryBtn: "Shop Now",
    secondaryBtn: "View Deals",
  },
  {
    image: img1.src,
    title: "Premium Quality Guaranteed",
    subtitle: "Fresh from farm to your table",
    primaryBtn: "Shop Now",
    secondaryBtn: "Learn More",
  },
  {
    image: img2.src,
    title: "Fast & Free Delivery",
    subtitle: "Same day delivery available",
    primaryBtn: "Order Now",
    secondaryBtn: "Delivery Info",
  },
];

export default function Home() {
  return (
    <>
      <Slider slides={slidesData} />
      <StoreFeatures />

      <Suspense
        fallback={
          <div className="h-75 bg-violet-700 text-white text-4xl font-bold flex justify-center items-center"></div>
        }
      >
        <LazyHomeComponent />
      </Suspense>

      <FeaturdProducts />
    </>
  );
}
