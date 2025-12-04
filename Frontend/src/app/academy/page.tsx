import React from "react";
import AcademyScreen from "../../components/AcademyScreen";
import { getAcademyData } from "@/services/api";

async function getData() {
  return await getAcademyData();
}
export interface AcademyPageProps {
  //..
}

const AcademyPage: React.FC<AcademyPageProps> = async () => {
  const { courses, upcomingEvents, resources, stats } = await getData();
  return <AcademyScreen courses={courses} upcomingEvents={upcomingEvents} resources={resources} stats={stats} />;
};

export default AcademyPage;
