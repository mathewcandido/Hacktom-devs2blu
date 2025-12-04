package com.talenthub.TalentHub.dto;

import java.util.List;
import java.util.UUID;

public class LeaderDto {
    private UUID id;
    private String name;
    private String email;
    private String area;
    private String department;
    private String photo;
    private List<UUID> interestedParticipants;
    private List<UUID> reservedParticipants;

    public LeaderDto() {}

    public LeaderDto(UUID id, String name, String email, String area, String department, 
                    String photo, List<UUID> interestedParticipants, List<UUID> reservedParticipants) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.area = area;
        this.department = department;
        this.photo = photo;
        this.interestedParticipants = interestedParticipants;
        this.reservedParticipants = reservedParticipants;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    
    public List<UUID> getInterestedParticipants() { return interestedParticipants; }
    public void setInterestedParticipants(List<UUID> interestedParticipants) { this.interestedParticipants = interestedParticipants; }
    
    public List<UUID> getReservedParticipants() { return reservedParticipants; }
    public void setReservedParticipants(List<UUID> reservedParticipants) { this.reservedParticipants = reservedParticipants; }
}