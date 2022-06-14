package com.kirill.retrorestservice.configurations.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {
    private final OAuth2User oauth2User;
    private final String oauth2ClientName;

    public CustomOAuth2User(OAuth2User oauth2User, String oauth2ClientName) {
        this.oauth2User = oauth2User;
        this.oauth2ClientName = oauth2ClientName;
    }

    public CustomOAuth2User(DefaultOidcUser defaultOidcUser, String oauth2ClientName) {
        this.oauth2User = defaultOidcUser;
        this.oauth2ClientName = oauth2ClientName;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return oauth2User.getName();
    }

    public String getEmail() {
        return oauth2User.getAttribute("email");
    }

    public String getProviderName() {
        return this.oauth2ClientName == null ? "UNDEFINED" : this.oauth2ClientName.toUpperCase();
    }
}
