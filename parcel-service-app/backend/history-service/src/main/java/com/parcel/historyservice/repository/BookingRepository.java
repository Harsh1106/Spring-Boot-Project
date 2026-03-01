package com.parcel.historyservice.repository;

import com.parcel.historyservice.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByCustomerIdOrderByBookingDateDesc(String customerId);
    Page<Booking> findByCustomerIdOrderByBookingDateDesc(String customerId, Pageable pageable);
    List<Booking> findByBookingDateBetween(Date start, Date end);
}
