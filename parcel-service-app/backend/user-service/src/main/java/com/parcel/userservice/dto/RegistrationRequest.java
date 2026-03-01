package com.parcel.userservice.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String name;
    private String address;
    private String pincode;
    private String mobile;
    private String email;
    private String password;
    private String username; // For admin
}
