import ParticipantsScreen from "../../components/ParticipantsScreen";
import { getParticipantsData } from "@/services/api";

async function getData() {
  return await getParticipantsData();
}

const ParticipantsPage = async () => {
  const { participants } = await getData();
  return <ParticipantsScreen participants={participants} />;
};

export default ParticipantsPage;
