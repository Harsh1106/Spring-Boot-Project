package com.parcel.userservice.service;

import com.parcel.userservice.dto.LoginRequest;
import com.parcel.userservice.dto.LoginResponse;
import com.parcel.userservice.dto.RegistrationRequest;
import com.parcel.userservice.model.Customer;
import com.parcel.userservice.model.Login;
import com.parcel.userservice.repository.CustomerRepository;
import com.parcel.userservice.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public LoginResponse registerCustomer(RegistrationRequest request) {
        if (loginRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String customerId = generateCustomerId();
        
        Customer customer = new Customer();
        customer.setCustomerId(customerId);
        customer.setName(request.getName());
        customer.setAddress(request.getAddress());
        customer.setPincode(request.getPincode());
        customer.setMobile(request.getMobile());
        customerRepository.save(customer);

        Login login = new Login();
        login.setConsumerId(customerId);
        login.setUserId(customerId); 
        login.setEmail(request.getEmail());
        login.setPassword(request.getPassword()); 
        login.setRole("customer");
        login.setStatus("Active");
        loginRepository.save(login);

        LoginResponse response = new LoginResponse();
        response.setSuccess(true);
        response.setMessage("Customer registered successfully");
        response.setCustomerId(customerId);
        response.setUsername(customerId); 
        return response;
    }

    @Transactional
    public LoginResponse registerAdmin(RegistrationRequest request) {
         if (loginRepository.findByUserId(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        Login login = new Login();
        login.setUserId(request.getUsername());
        login.setEmail(request.getEmail());
        login.setPassword(request.getPassword());
        login.setRole("officer");
        login.setStatus("Active");
        loginRepository.save(login);

        LoginResponse response = new LoginResponse();
        response.setSuccess(true);
        response.setMessage("Admin registered successfully");
        return response;
    }

    public LoginResponse validateLogin(LoginRequest request) {
        Optional<Login> loginOpt = loginRepository.findByUserIdOrConsumerId(request.getUserId(), request.getUserId());
        
        if (loginOpt.isPresent()) {
            Login login = loginOpt.get();
            if (login.getPassword().equals(request.getPassword())) {
                LoginResponse response = new LoginResponse();
                response.setSuccess(true);
                response.setMessage("Customer logged in successfully"); 
                response.setRole(login.getRole());
                response.setUsername(login.getUserId());
                response.setCustomerId(login.getConsumerId());
                response.setEmail(login.getEmail());
                
                if ("customer".equalsIgnoreCase(login.getRole()) && login.getConsumerId() != null) {
                    Optional<Customer> customerOpt = customerRepository.findById(login.getConsumerId());
                    if (customerOpt.isPresent()) {
                        Customer c = customerOpt.get();
                        response.setName(c.getName());
                        response.setAddress(c.getAddress());
                        response.setPincode(c.getPincode());
                        response.setMobile(c.getMobile());
                    }
                } else {
                     response.setName(login.getUserId());
                }
                
                return response;
            }
        }
        throw new RuntimeException("Invalid credentials");
    }

    private String generateCustomerId() {
        Random random = new Random();
        String customerId;
        do {
            int digits = 100000 + random.nextInt(900000);
            customerId = "USER@" + digits;
        } while (customerRepository.existsById(customerId));
        return customerId;
    }
}
