package com.parcel.trackingservice.controller;

import com.parcel.trackingservice.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class TrackingController {

    @Autowired
    private TrackingService trackingService;

    // Track Parcel (Get by ID)
    @GetMapping("/trackParcelStatus/{bookingId}")
    public ResponseEntity<?> trackParcelStatus(@PathVariable String bookingId) {
        return trackingService.getBookingById(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
