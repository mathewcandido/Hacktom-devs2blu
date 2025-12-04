import { getParticipantData } from "@/services/api";
import ParticipantDetailScreen from "@/components/ParticipantDetailScreen/ParticipantDetailScreen";
import ParticipantNotFound from "@/components/ParticipantNotFound/ParticipantNotFound";

interface PageProps {
  params: {
    id: string;
  };
}

async function getData(id: string) {
  return await getParticipantData(id);
}

const ParticipantDetailPage = async ({ params }: PageProps) => {
  const { participant } = await getData(params.id);

  if (!participant) {
    return <ParticipantNotFound />;
  }

  return <ParticipantDetailScreen participant={participant} />;
};

export default ParticipantDetailPage;