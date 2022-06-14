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
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

@EnableWebSecurity
@RestController
@SuppressWarnings("deprecation")
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String LOGIN_PAGE_URL = "/index.html";

    @Autowired
    private CustomOAuth2UserService oAuth2UserService;

    @Autowired
    private UserService userService;

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
                        "/error**",
                        "/api/user/auth",
                        LOGIN_PAGE_URL,
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/oauth2/**",
                        "/api/report/getFile/**").permitAll()
                .anyRequest().authenticated()
                .and().logout().permitAll()
                .and()
                .csrf().disable()
                .httpBasic()
                .and()
                .oauth2Login()
                .loginPage(LOGIN_PAGE_URL)
                .userInfoEndpoint()
                .userService(oAuth2UserService)
                .and()
                .successHandler((request, response, authentication) -> {
                    userService.processOAuthPostLogin((CustomOAuth2User) authentication.getPrincipal());
                    response.sendRedirect(LOGIN_PAGE_URL);
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
