package com.parcel.statusservice.service;

import com.parcel.statusservice.model.Booking;
import com.parcel.statusservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class StatusService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking updateDeliveryStatus(String bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            
            int currentPriority = getStatusPriority(booking.getParStatus());
            int newPriority = getStatusPriority(status);

            if (newPriority < currentPriority) {
                throw new RuntimeException("Cannot revert status from " + booking.getParStatus() + " to " + status);
            }
            
            booking.setParStatus(status);
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found");
    }

    private int getStatusPriority(String status) {
        if (status == null) return -1;
        switch (status.trim().toLowerCase()) {
            case "pending payment": return 0;
            case "booked": return 1;
            case "in transit": return 2;
            case "delivered": return 3;
            case "returned": return 4;
            default: return -1;
        }
    }
}
