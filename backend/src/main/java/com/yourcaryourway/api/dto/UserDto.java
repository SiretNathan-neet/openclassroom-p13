package com.yourcaryourway.api.dto;

import com.yourcaryourway.api.model.Role;
import com.yourcaryourway.api.model.User;

public record UserDto(Long id, String email, String firstName, String lastName, Role role) {
    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }
}