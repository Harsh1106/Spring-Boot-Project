package com.parcel.historyservice.controller;

import com.parcel.historyservice.model.Booking;
import com.parcel.historyservice.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    // Get Bookings by Customer ID
    @GetMapping("/bookings/customer/{customerId}")
    public ResponseEntity<org.springframework.data.domain.Page<Booking>> getBookingsByCustomer(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(historyService.getBookingsByCustomerId(customerId, page, size));
    }

    // View Booking History by Date
    @GetMapping("/viewBookingHistory")
    public ResponseEntity<List<Booking>> viewBookingHistory(@RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        return ResponseEntity.ok(historyService.getBookingsByDate(date));
    }
}
