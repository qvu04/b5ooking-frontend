import PlanBanner from "./(main)/home/PlanBanner";
import PopularBlog from "./(main)/home/PopularBlog";
import PopularHotel from "./(main)/home/PopularHotel";
import PopularLocation from "./(main)/home/PopularLocation";
import PopularTravel from "./(main)/home/PopularTravel";
import TravelDealCard from "./(main)/home/TravelDealCard";

export default function Home() {
  return (
    <div className="p-6">
      <PopularLocation />
      <PopularHotel />
      <PopularTravel />
      <TravelDealCard />
      <PopularBlog />
      <PlanBanner />
    </div>
  );
}
