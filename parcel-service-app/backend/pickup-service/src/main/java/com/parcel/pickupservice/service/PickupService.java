package com.parcel.pickupservice.service;

import com.parcel.pickupservice.model.Booking;
import com.parcel.pickupservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
public class PickupService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking updatePickupAndDrop(String bookingId, String pickupTime, String dropTime) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            
            // Validation logic
            Date bookingDate = booking.getBookingDate();
            if (bookingDate != null) {
                try {
                    LocalDateTime pickup = LocalDateTime.parse(pickupTime);
                    LocalDateTime drop = LocalDateTime.parse(dropTime);
                    
                    LocalDateTime bookingDateTime = bookingDate.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();
                    
                    if (!pickup.isAfter(bookingDateTime)) {
                         throw new RuntimeException("Pickup time must be after booking date");
                    }
                    
                    if (!drop.isAfter(bookingDateTime)) {
                         throw new RuntimeException("Drop-off time must be after booking date");
                    }
                    
                    if (!drop.isAfter(pickup)) {
                         throw new RuntimeException("Drop-off time must be after pickup time");
                    }
                } catch (Exception e) {
                    // Log error or rethrow if it's our validation error
                    if (e.getMessage().contains("must be after")) {
                        throw e;
                    }
                    // If parsing fails, we might skip validation or handle it. 
                    // For now, let's allow it if parsing fails to avoid blocking valid legacy formats if any.
                    // But for new inputs from frontend (datetime-local), it should parse.
                }
            }

            booking.setParPickupTime(pickupTime);
            booking.setParDropoffTime(dropTime);
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found");
    }
}
