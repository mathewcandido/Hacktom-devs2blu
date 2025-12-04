package com.talenthub.TalentHub.controllers;

import com.talenthub.TalentHub.dto.DashboardFullResponse;
import com.talenthub.TalentHub.dto.DashboardResponse;
import com.talenthub.TalentHub.dto.DashboardStatsDto;
import com.talenthub.TalentHub.services.DashboardServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final DashboardServices dashboardService;

    public DashboardController(DashboardServices dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardFullResponse> getDashboard(){
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDto> getStats(){
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}
