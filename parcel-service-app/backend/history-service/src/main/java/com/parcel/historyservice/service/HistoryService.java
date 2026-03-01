package com.parcel.historyservice.service;

import com.parcel.historyservice.model.Booking;
import com.parcel.historyservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
public class HistoryService {

    @Autowired
    private BookingRepository bookingRepository;

    public Page<Booking> getBookingsByCustomerId(String customerId, int page, int size) {
        return bookingRepository.findByCustomerIdOrderByBookingDateDesc(customerId, PageRequest.of(page, size));
    }

    public List<Booking> getBookingsByCustomerId(String customerId) {
        return bookingRepository.findByCustomerIdOrderByBookingDateDesc(customerId);
    }
    
    public List<Booking> getBookingsByDate(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date start = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        Date end = cal.getTime();

        return bookingRepository.findByBookingDateBetween(start, end);
    }
}
