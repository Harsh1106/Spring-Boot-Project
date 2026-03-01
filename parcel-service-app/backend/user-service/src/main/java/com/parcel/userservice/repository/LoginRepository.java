package com.parcel.userservice.repository;

import com.parcel.userservice.model.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LoginRepository extends JpaRepository<Login, Long> {
    Optional<Login> findByUserId(String userId);
    Optional<Login> findByEmail(String email);
    Optional<Login> findByConsumerId(String consumerId);
    Optional<Login> findByUserIdOrConsumerId(String userId, String consumerId);
}
