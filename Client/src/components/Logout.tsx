import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearSignalRConnections } from "../utils/signalRUtils";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await clearSignalRConnections();

      localStorage.removeItem("token");
      sessionStorage.clear();

      dispatch(logout());

      dispatch({ type: "RESET_STORE" });

      toast.success("Logged out successfully");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Error during logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 transition-colors rounded-full hover:bg-gray-100"
      aria-label="Logout"
    >
      <BiLogOut className="cursor-pointer" size={20} />
    </button>
  );
};

export default Logout;
