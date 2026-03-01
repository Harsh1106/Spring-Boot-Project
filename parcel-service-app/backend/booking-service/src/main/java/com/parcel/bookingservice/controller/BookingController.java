package com.parcel.bookingservice.controller;

import com.parcel.bookingservice.model.Booking;
import com.parcel.bookingservice.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create Booking
    @PostMapping("/viewbookService")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // View All Bookings (Officer)
    @GetMapping("/viewbookService")
    public ResponseEntity<org.springframework.data.domain.Page<Booking>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(bookingService.getAllBookings(page, size));
    }

    // Generic Update Booking (for Payment etc)
    @PatchMapping("/bookings/{bookingId}")
    public ResponseEntity<?> updateBooking(@PathVariable String bookingId, @RequestBody Map<String, Object> updates) {
        try {
            bookingService.updateBooking(bookingId, updates);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Booking updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }
}
