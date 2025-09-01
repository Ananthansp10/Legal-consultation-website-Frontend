import { useLocation } from "react-router-dom";
import ProfileView from "../reusableComponents/ProfileView";

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const { profile } = location.state || {};

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return <ProfileView profile={profile} />;
};

export default ProfilePage;
