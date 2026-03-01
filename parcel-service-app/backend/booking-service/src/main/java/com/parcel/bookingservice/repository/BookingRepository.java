package com.parcel.bookingservice.repository;

import com.parcel.bookingservice.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByCustomerIdOrderByBookingDateDesc(String customerId);
    List<Booking> findByBookingDate(Date bookingDate);
}
