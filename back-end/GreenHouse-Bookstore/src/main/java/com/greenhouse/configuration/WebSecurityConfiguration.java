package com.greenhouse.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.greenhouse.filters.JwtRequestFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {

    @Autowired
    private JwtRequestFilter requestFilter;

    private final String[] apiEndpoints = {"/rest/**"}; // Danh sách các API bảo mật
    private final String[] apiEndpointsPermit = {"/authenticate", "/resgister", "/index", "/login", "/404", "/sign-up",
            "/account", "/contact", "/voucher", "/flash-sale", "/product", "/product-details", "/cart", "/checkout",
            "/checkout-complete", "/forgot-password", "/change-password", "/customer/**", "/oauth2/authorization/google", "/logout", "/google-processing", "/google-success", "/client/**",
            "/admin/**"}; // Danh sách các API cho phép truy cập

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers(apiEndpointsPermit)
                .permitAll().and()
                .authorizeHttpRequests()
                .requestMatchers(apiEndpoints)
                .hasRole("ADMIN").and()
                .oauth2Login().loginPage("/login")
                .defaultSuccessUrl("/google-processing", true)
                .and()
                .logout()
                .logoutUrl("/logout") // Định nghĩa URL để thực hiện logout
                .clearAuthentication(true) // Xóa thông tin xác thực
                .invalidateHttpSession(true) // Huỷ phiên làm việc
                .permitAll().and()
                .exceptionHandling()
                .accessDeniedPage("/404")
                .and().addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(this.googleClientRegistration());
    }

    private ClientRegistration googleClientRegistration() {
        return ClientRegistration.withRegistrationId("google")
                .clientId("615362937868-fhjof66imgsvbcc074mprese8dp376bt.apps.googleusercontent.com")
                .clientSecret("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")
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("openid", "profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName(IdTokenClaimNames.SUB)
                .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .clientName("Google")
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
