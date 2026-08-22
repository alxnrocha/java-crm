package com.alxnrocha.crm.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ContractPulse CRM Enterprise & RevenueOps REST API")
                        .version("1.0.0")
                        .description("API REST corporativa para gestión del ciclo de vida de contratos B2B, Revenue Operations y análisis financiero en tiempo real.")
                        .contact(new Contact()
                                .name("Marcos Alexandr Nogueira Rocha")
                                .url("https://github.com/alxnrocha/java-crm")
                                .email("alxnrocha@users.noreply.github.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server"),
                        new Server().url("https://api.contractpulse.io").description("Production Gateway")
                ));
    }
}
