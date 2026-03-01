package com.parcel.userservice.controller;

import com.parcel.userservice.dto.LoginRequest;
import com.parcel.userservice.dto.LoginResponse;
import com.parcel.userservice.dto.RegistrationRequest;
import com.parcel.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/registerCustomer")
    public ResponseEntity<?> registerCustomer(@RequestBody RegistrationRequest request) {
        try {
            LoginResponse response = userService.registerCustomer(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registerAdmin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegistrationRequest request) {
        try {
            LoginResponse response = userService.registerAdmin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/validateLogin")
    public ResponseEntity<?> validateLogin(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.validateLogin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
