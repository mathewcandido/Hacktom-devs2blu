package com.talenthub.TalentHub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Configuração CORS movida para SecurityConfig para evitar conflitos
}