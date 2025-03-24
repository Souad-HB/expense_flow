import { Home } from "../components/Home";
import Sidebar from "../components/Sidebar";

export const Dashboard = () => {
  return (
    <>
      <Sidebar pageContent={<Home />} />
      <Home />
    </>
  );
};
