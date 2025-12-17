import Trends from "@/pages/Trends";
import Growth from "@/pages/Growth";
import Market from "@/pages/Market";
import Production from "@/pages/Production";
import '../styles/home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="home-grid">
        <div className="home-item"><Trends /></div>
        <div className="home-item"><Growth/></div>
        <div className="home-item"><Market/></div>
        <div className="home-item"><Production/></div>
      </div>
    </div>
  );
}
