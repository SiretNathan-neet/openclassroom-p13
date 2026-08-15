package com.yourcaryourway.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourcaryourway.api.model.User;

public interface UserRepository extends JpaRepository<User, Long> {   
}
