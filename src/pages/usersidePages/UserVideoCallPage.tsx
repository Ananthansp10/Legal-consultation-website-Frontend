import { useParams } from "react-router-dom"
import VideoCallPage from "../../components/reusableComponents/VideoCallPage"


function UserVideoCallPage() {
  const {appointmentId} = useParams()
  return <VideoCallPage role="user" roomId={appointmentId!}/>
}

export default UserVideoCallPage
