package com.parcel.bookingservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "Booking")
@Data
public class Booking {
    @Id
    private String bookingId;
    
    private String customerId;
    private String customerName;
    private String customerAddress;
    private String customerPin;
    private String customerMobile;
    
    private String recName;
    private String recAddress;
    private String recPin;
    private String recMobile;
    
    private Double parWeightGram;
    private String parContentsDescription;
    private String parDeliveryType;
    private String parPackingPreference;
    private String parPickupTime;
    private String parDropoffTime;
    private Double parServiceCost;
    private String parPaymentTime;
    private String parPaymentMode;
    private String parStatus; // Pending Payment, Booked, In Transit, Delivered, Returned
    
    private Date bookingDate;
}
