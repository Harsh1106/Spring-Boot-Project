package com.parcel.trackingservice.service;

import com.parcel.trackingservice.model.Booking;
import com.parcel.trackingservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TrackingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Optional<Booking> getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId);
    }
}
