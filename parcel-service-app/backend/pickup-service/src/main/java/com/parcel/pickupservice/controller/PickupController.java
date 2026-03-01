package com.parcel.pickupservice.controller;

import com.parcel.pickupservice.service.PickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class PickupController {

    @Autowired
    private PickupService pickupService;

    // Update Pickup and Drop
    @PutMapping("/updatepickupanddrop/{bookingId}")
    public ResponseEntity<?> updatePickupAndDrop(@PathVariable String bookingId, @RequestBody Map<String, String> payload) {
        try {
            String pickupTime = payload.get("pickupTime");
            String dropTime = payload.get("dropTime");
            pickupService.updatePickupAndDrop(bookingId, pickupTime, dropTime);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Pick up and drop updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }
}
