import { faker } from '@faker-js/faker';
import { Area, Leader } from '@/types';

export function generateLeaders(count: number = 8): Leader[] {
  const leaders: Leader[] = [];
  const areas = [Area.DEVELOPMENT, Area.UX_DESIGN, Area.QA, Area.DATA_SCIENCE, Area.PRODUCT, Area.MARKETING];
  
  const departments = [
    'Tecnologia',
    'Design',
    'Qualidade',
    'Dados e Analytics',
    'Produto',
    'Marketing e Vendas'
  ];

  for (let i = 0; i < count; i++) {
    const area = areas[i % areas.length];
    
    const leader: Leader = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      photo: `https://randomuser.me/api/portraits/${faker.helpers.arrayElement(['men', 'women'])}/${faker.number.int({ min: 1, max: 99 })}.jpg`,
      area,
      department: departments[i % departments.length],
      interestedParticipants: [],
      reservedParticipants: [],
      joinDate: faker.date.between({ from: '2020-01-01', to: '2023-12-31' })
    };

    // Generate some interested and reserved participants (fake IDs for now)
    const interestedCount = faker.number.int({ min: 0, max: 5 });
    const reservedCount = faker.number.int({ min: 0, max: 3 });

    for (let j = 0; j < interestedCount; j++) {
      leader.interestedParticipants.push(faker.string.uuid());
    }

    for (let j = 0; j < reservedCount; j++) {
      leader.reservedParticipants.push(faker.string.uuid());
    }

    leaders.push(leader);
  }

  return leaders;
}