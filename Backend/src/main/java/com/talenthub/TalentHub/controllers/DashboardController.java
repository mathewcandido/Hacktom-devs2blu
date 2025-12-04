package com.talenthub.TalentHub.controllers;

import com.talenthub.TalentHub.dto.DashboardResponse;
import com.talenthub.TalentHub.services.DashboardServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardServices dashboardService;

    public DashboardController(DashboardServices dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardResponse> getStats(){
        return ResponseEntity.ok(dashboardService.getInfoForDashboard());
    }
}
