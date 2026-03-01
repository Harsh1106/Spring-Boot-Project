package com.parcel.userservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Customer")
@Data
public class Customer {
    @Id
    private String customerId; 
    private String name;
    private String address;
    private String pincode;
    private String mobile;
}
