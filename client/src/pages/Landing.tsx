import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full bg-gray-100 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 lg:w-[90%] lg:h-[90vh]">
        {/* Left Column */}
        <div className="flex items-center justify-center">
          <img
            alt="landing img"
            src="../public/assets/ex8.png"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>
        {/* Right Column */}
        <div className="flex flex-col justify-center gap-5 md:gap-14 p-6 md:p-10">
          <h1 className="text-3xl md:text-8xl md:leading-25 text-zinc-800 font-semibold">
            The money app that works for us💰
          </h1>
          <h2 className="text-xl md:text-3xl text-stone-700 font-semibold">
            Take Control of Your Finances with Ease
          </h2>
          <p className="text-base md:text-xl font-semibold text-gray-500">
            Managing money is hard, but you don’t have to do it alone. The HBs
            empower you to save more, spend less, see everything, and take back
            control of your financial life.
          </p>
          <div className="flex flex-col md:flex-row gap-3 pt-6">
            <Button
              variant="contained"
              sx={{
                borderRadius: 50,
                backgroundColor: "#9a3c38",
                borderColor: "#9a3c38",
                color: "white",
                fontSize: "17px",
              }}
              onClick={() => navigate("/signup")}
            >
              Get started
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: 50,
                borderColor: "#9a3c38",
                color: "#9a3c38",
                fontSize: "17px",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
