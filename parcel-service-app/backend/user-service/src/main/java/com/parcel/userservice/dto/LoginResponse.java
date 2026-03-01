package com.parcel.userservice.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private boolean success;
    private String message;
    private String customerId;
    private String username;
    private String role;
    private String name;
    private String address;
    private String pincode;
    private String mobile;
    private String email;
}
