package com.parcel.bookingservice.service;

import com.parcel.bookingservice.model.Booking;
import com.parcel.bookingservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setBookingId("BK" + System.currentTimeMillis());
        booking.setBookingDate(new Date());
        if (booking.getParStatus() == null) {
            booking.setParStatus("Pending Payment");
        }
        return bookingRepository.save(booking);
    }

    public Page<Booking> getAllBookings(int page, int size) {
        return bookingRepository.findAll(PageRequest.of(page, size, Sort.by("bookingDate").descending()));
    }

    public Booking updateBooking(String bookingId, Map<String, Object> updates) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            updates.forEach((key, value) -> {
                switch (key) {
                    case "parStatus": booking.setParStatus((String) value); break;
                    case "parPaymentTime": booking.setParPaymentTime((String) value); break;
                    case "parPaymentMode": booking.setParPaymentMode((String) value); break;
                    case "parPickupTime": booking.setParPickupTime((String) value); break;
                    case "parDropoffTime": booking.setParDropoffTime((String) value); break;
                    // Add other fields as needed
                }
            });
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found");
    }
}
