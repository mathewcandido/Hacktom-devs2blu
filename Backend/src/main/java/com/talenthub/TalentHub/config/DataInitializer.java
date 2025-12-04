package com.talenthub.TalentHub.config;

import com.talenthub.TalentHub.models.Leader;
import com.talenthub.TalentHub.models.Participant;
import com.talenthub.TalentHub.models.enums.Status;
import com.talenthub.TalentHub.repositories.LeaderRepository;
import com.talenthub.TalentHub.repositories.ParticipantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ParticipantRepository participantRepository;
    private final LeaderRepository leaderRepository;
    private final Random random = new Random();

    public DataInitializer(ParticipantRepository participantRepository, LeaderRepository leaderRepository) {
        this.participantRepository = participantRepository;
        this.leaderRepository = leaderRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Verificar se já existem dados
        if (participantRepository.count() > 0 || leaderRepository.count() > 0) {
            System.out.println("Database already has data, skipping initialization...");
            return;
        }

        System.out.println("Initializing database with test data...");
        createParticipants();
        createLeaders();
        System.out.println("Database initialization completed!");
    }

    private void createParticipants() {
        List<String> names = Arrays.asList(
            "Ana Silva", "João Santos", "Maria Oliveira", "Pedro Costa", "Lucia Ferreira",
            "Carlos Rodrigues", "Beatriz Lima", "Roberto Alves", "Fernanda Souza", "Antonio Pereira",
            "Juliana Martins", "Ricardo Barbosa", "Camila Ribeiro", "Diego Carvalho", "Isabela Gomes",
            "Bruno Mendes", "Larissa Araújo", "Felipe Nascimento", "Gabriela Castro", "Thiago Rocha",
            "Natália Dias", "Leonardo Pinto", "Mariana Cordeiro", "Gustavo Teixeira", "Amanda Silveira"
        );

        List<String> areas = Arrays.asList(
            "Desenvolvimento", "UX/UI Design", "Quality Assurance", "Data Science", 
            "Product Management", "Marketing Digital"
        );

        List<Status> statuses = Arrays.asList(
            Status.EM_FORMACAO, Status.DISPONIVEL, Status.RESERVADO, Status.CONTRATADO
        );

        List<String> batches = Arrays.asList(
            "Turma 2024-1", "Turma 2024-2", "Turma 2023-2", "Turma 2023-1"
        );

        for (int i = 0; i < 100; i++) {
            String name = names.get(random.nextInt(names.size()));
            String area = areas.get(random.nextInt(areas.size()));
            Status status = statuses.get(random.nextInt(statuses.size()));
            String batch = batches.get(random.nextInt(batches.size()));
            
            Participant participant = new Participant();
            participant.setName(name + " " + (i + 1));
            participant.setEmail(generateEmail(name, i + 1));
            participant.setPhone(generatePhone());
            participant.setPhotoUrl("/avatars/" + generateAvatarName(name) + ".jpg");
            participant.setArea(area);
            participant.setBatch(batch);
            participant.setStatus(status);
            participant.setEvolution(random.nextInt(101)); // 0-100
            participant.setStartDate(generateRandomDate());
            participant.setBio("Participante da trilha " + area);
            participant.setCreatedAt(LocalDateTime.now());
            participant.setUpdatedAt(LocalDateTime.now());

            participantRepository.save(participant);
        }
    }

    private void createLeaders() {
        List<String> leaderNames = Arrays.asList(
            "Dr. Alexandre Silva", "Dra. Marina Costa", "Prof. Roberto Santos", 
            "Eng. Carla Oliveira", "Dr. Fernando Lima", "Dra. Patricia Rocha"
        );

        List<String> departments = Arrays.asList(
            "Tecnologia", "Design", "Qualidade", "Dados", "Produto", "Marketing"
        );

        List<String> areas = Arrays.asList(
            "Desenvolvimento", "UX/UI Design", "Quality Assurance", 
            "Data Science", "Product Management", "Marketing Digital"
        );

        for (int i = 0; i < leaderNames.size(); i++) {
            Leader leader = new Leader();
            leader.setName(leaderNames.get(i));
            leader.setEmail(generateLeaderEmail(leaderNames.get(i), i + 1));
            leader.setPhoto_url("/avatars/" + generateAvatarName(leaderNames.get(i)) + ".jpg");
            leader.setArea(areas.get(i));
            leader.setDepartment(departments.get(i));
            leader.setJoinDate(generateRandomDate());
            leader.setCreatedAt(LocalDateTime.now());
            leader.setUpdatedAt(LocalDateTime.now());

            leaderRepository.save(leader);
        }
    }

    private String generateEmail(String name, int index) {
        String cleanName = name.toLowerCase()
            .replace("ã", "a")
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u")
            .replace(" ", ".");
        return cleanName + index + "@email.com";
    }

    private String generateLeaderEmail(String name, int index) {
        String cleanName = name.toLowerCase()
            .replace("dr. ", "")
            .replace("dra. ", "")
            .replace("prof. ", "")
            .replace("eng. ", "")
            .replace(" ", ".");
        return cleanName + "@company.com";
    }

    private String generatePhone() {
        return String.format("(%02d) 9%04d-%04d", 
            random.nextInt(99) + 11, 
            random.nextInt(9999), 
            random.nextInt(9999));
    }

    private String generateAvatarName(String name) {
        return name.toLowerCase()
            .replace("dr. ", "")
            .replace("dra. ", "")
            .replace("prof. ", "")
            .replace("eng. ", "")
            .replace(" ", "-");
    }

    private LocalDateTime generateRandomDate() {
        LocalDateTime now = LocalDateTime.now();
        return now.minusDays(random.nextInt(365));
    }
}