import { useParams } from "react-router-dom";
import VideoCallPage from "../../components/reusableComponents/VideoCallPage";

function LawyerVideoCallPage() {
  const { appointmentId } = useParams();
  return <VideoCallPage role="lawyer" roomId={appointmentId!} />;
}

export default LawyerVideoCallPage;
