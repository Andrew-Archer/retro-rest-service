package com.kirill.retrorestservice.configurations.security;

import com.kirill.retrorestservice.services.CustomOAuth2UserService;
import com.kirill.retrorestservice.services.UserDetailsServiceImpl;
import com.kirill.retrorestservice.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@EnableWebSecurity
@RestController
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String loginPageUrl = "/index.html";

    @Autowired
    private CustomOAuth2UserService oAuth2UserService;

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authenticationProvider());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                //Enable authorization
                .authorizeRequests()
                //Allow access to static resources as js, images, css
                .antMatchers("/",
                        "/api/user/auth",
                        loginPageUrl,
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/oauth2/**",
                        "/api/report/getFile/**",
                        "/listBoard.html#**").permitAll()
                .anyRequest().authenticated()
                //Access to boards list has only user with role admin
                //.antMatchers().hasAnyAuthority()
                .and()
                .csrf().disable()
                .httpBasic()
                .and()
                .oauth2Login()
                .loginPage(loginPageUrl)
                .userInfoEndpoint()
                .userService(oAuth2UserService)
                .and()
                .successHandler((request, response, authentication) -> {
                    CustomOAuth2User oauthUser = new CustomOAuth2User((DefaultOidcUser)authentication.getPrincipal());

                    userService.processOAuthPostLogin(oauthUser.getEmail());

                    response.sendRedirect(loginPageUrl);
                });
    }

    @Bean
    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsServiceImpl();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        var authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(userDetailsService());
        return authenticationProvider;
    }

}
