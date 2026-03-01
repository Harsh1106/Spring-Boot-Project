package com.parcel.statusservice.controller;

import com.parcel.statusservice.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class StatusController {

    @Autowired
    private StatusService statusService;

    // Update Delivery Status
    @PutMapping("/updateDeliveryStatus/{bookingId}")
    public ResponseEntity<?> updateDeliveryStatus(@PathVariable String bookingId, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            statusService.updateDeliveryStatus(bookingId, status);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Delivery Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }
}
