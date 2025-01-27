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
      // Clear SignalR connections
      await clearSignalRConnections();

      // Remove tokens and sensitive data
      localStorage.removeItem("token");
      sessionStorage.clear();

      // Dispatch logout action
      dispatch(logout());

      // flush the redux store
      dispatch({ type: "RESET_STORE" });

      // Show success message
      toast.success("Logged out successfully");

      // Navigate to login
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
