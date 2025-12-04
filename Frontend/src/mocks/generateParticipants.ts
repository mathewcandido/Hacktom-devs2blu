import { faker } from "@faker-js/faker";
import {
  Area,
  ParticipantStatus,
  EvaluationCategory,
  TimelineEventType,
  Participant,
  Evaluation,
  TimelineEvent,
} from "@/types";

const areas = [
  Area.DEVELOPMENT,
  Area.UX_DESIGN,
  Area.QA,
  Area.DATA_SCIENCE,
  Area.PRODUCT,
  Area.MARKETING,
];
const statuses = [
  ParticipantStatus.IN_TRAINING,
  ParticipantStatus.AVAILABLE,
  ParticipantStatus.RESERVED,
  ParticipantStatus.HIRED,
];
const evaluationCategories = [
  EvaluationCategory.TECHNICAL,
  EvaluationCategory.SOFT_SKILLS,
  EvaluationCategory.LEADERSHIP,
  EvaluationCategory.COMMUNICATION,
];
const timelineEventTypes = [
  TimelineEventType.ENROLLMENT,
  TimelineEventType.EVALUATION,
  TimelineEventType.INTEREST,
  TimelineEventType.RESERVATION,
  TimelineEventType.GRADUATION,
  TimelineEventType.HIRING,
];

const batches = [
  "Turma 2024-1",
  "Turma 2024-2",
  "Turma 2023-2",
  "Turma 2023-1",
];

const skills = {
  [Area.DEVELOPMENT]: [
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "AWS",
    "Docker",
    "Git",
    "SQL",
  ],
  [Area.UX_DESIGN]: [
    "Figma",
    "Adobe XD",
    "Sketch",
    "Prototyping",
    "User Research",
    "Wireframing",
    "Design Systems",
  ],
  [Area.QA]: [
    "Selenium",
    "Cypress",
    "Jest",
    "Test Planning",
    "API Testing",
    "Performance Testing",
    "Bug Tracking",
  ],
  [Area.DATA_SCIENCE]: [
    "Python",
    "R",
    "SQL",
    "Machine Learning",
    "Pandas",
    "Numpy",
    "Tableau",
    "Power BI",
  ],
  [Area.PRODUCT]: [
    "Product Strategy",
    "Roadmapping",
    "Analytics",
    "User Stories",
    "Scrum",
    "Market Research",
  ],
  [Area.MARKETING]: [
    "Google Analytics",
    "SEO",
    "Social Media",
    "Content Marketing",
    "Email Marketing",
    "CRM",
  ],
};

function generateEvaluations(participantId: string): Evaluation[] {
  const evaluationCount = faker.number.int({ min: 3, max: 8 });
  const evaluations: Evaluation[] = [];

  for (let i = 0; i < evaluationCount; i++) {
    evaluations.push({
      id: faker.string.uuid(),
      participantId,
      evaluatorId: faker.string.uuid(),
      evaluatorName: faker.person.fullName(),
      score: faker.number.int({ min: 6, max: 10 }),
      feedback: faker.lorem.sentences(faker.number.int({ min: 2, max: 4 })),
      date: faker.date.between({ from: "2023-01-01", to: new Date() }),
      category: faker.helpers.arrayElement(evaluationCategories),
    });
  }

  return evaluations.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function generateTimeline(participantId: string): TimelineEvent[] {
  const timeline: TimelineEvent[] = [];
  const startDate = faker.date.between({
    from: "2023-01-01",
    to: "2024-06-01",
  });

  timeline.push({
    id: faker.string.uuid(),
    participantId,
    type: TimelineEventType.ENROLLMENT,
    title: "Inscrição na Incubadora",
    description: "Participante se inscreveu no programa de formação",
    date: startDate,
  });

  const eventCount = faker.number.int({ min: 4, max: 12 });
  for (let i = 0; i < eventCount; i++) {
    const eventDate = faker.date.between({
      from: startDate,
      to: new Date(),
    });

    const eventType = faker.helpers.arrayElement([
      TimelineEventType.EVALUATION,
      TimelineEventType.INTEREST,
      TimelineEventType.GRADUATION,
    ]);

    let title = "";
    let description = "";

    switch (eventType) {
      case TimelineEventType.EVALUATION:
        title = "Avaliação Realizada";
        description = `Avaliação de ${faker.helpers.arrayElement(
          evaluationCategories
        )} realizada`;
        break;
      case TimelineEventType.INTEREST:
        title = "Interesse de Líder";
        description = `${faker.person.fullName()} demonstrou interesse no talento`;
        break;
      case TimelineEventType.GRADUATION:
        title = "Módulo Concluído";
        description = `Concluiu o módulo de ${faker.helpers.arrayElement([
          "Frontend",
          "Backend",
          "Banco de Dados",
          "Metodologias Ágeis",
        ])}`;
        break;
    }

    timeline.push({
      id: faker.string.uuid(),
      participantId,
      type: eventType,
      title,
      description,
      date: eventDate,
      actorName:
        eventType === TimelineEventType.INTEREST
          ? faker.person.fullName()
          : undefined,
    });
  }

  return timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function generateParticipants(count: number = 30): Participant[] {
  const participants: Participant[] = [];

  for (let i = 0; i < count; i++) {
    const id = i + 1;
    const area = faker.helpers.arrayElement(areas);
    const participantSkills = faker.helpers.arrayElements(skills[area] || [], {
      min: 3,
      max: 6,
    });

    const participant: Participant = {
      id: id.toString(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      photo: `https://randomuser.me/api/portraits/${faker.helpers.arrayElement([
        "men",
        "women",
      ])}/${faker.number.int({ min: 1, max: 99 })}.jpg`,
      area,
      batch: faker.helpers.arrayElement(batches),
      status: faker.helpers.arrayElement(statuses),
      evolution: faker.number.int({ min: 45, max: 95 }),
      startDate: faker.date.between({ from: "2023-01-01", to: "2024-06-01" }),
      evaluations: [],
      timeline: [],
      skills: participantSkills,
      bio: faker.lorem.paragraph(faker.number.int({ min: 2, max: 4 })),
    };

    participant.evaluations = generateEvaluations(id.toString());
    participant.timeline = generateTimeline(id.toString());

    participants.push(participant);
  }

  return participants;
}
