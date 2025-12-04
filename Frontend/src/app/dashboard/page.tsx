import { ProtectedRoute } from "../../components/ProtectedRoute";
import { getDashboardData } from "@/services/api";
import DashboardScreen from "../../components/DashboardScreen";

export interface pageProps {
  // ...
}

async function getData() {
  return await getDashboardData();
}

const page: React.FC<pageProps> = async () => {
  const { participants, leaders, stats } = await getData();

  return <DashboardScreen participants={participants} leaders={leaders} stats={stats} />;
};

export default page;
