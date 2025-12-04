import LeadersScreen from "../../components/LeadersScreen";
import { getLeadersData } from "@/services/api";

async function getData() {
  return await getLeadersData();
}

const LeadersPage = async () => {
  const { leaders } = await getData();
  return <LeadersScreen leaders={leaders} />;
};

export default LeadersPage;
