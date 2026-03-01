package com.parcel.userservice;

import com.parcel.userservice.model.Customer;
import com.parcel.userservice.model.Login;
import com.parcel.userservice.repository.CustomerRepository;
import com.parcel.userservice.repository.LoginRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(LoginRepository loginRepository, CustomerRepository customerRepository) {
		return (args) -> {
			// Create Admin User
			if (loginRepository.findByUserId("admin").isEmpty()) {
				Login admin = new Login();
				admin.setUserId("admin");
				admin.setPassword("Password@123");
				admin.setRole("officer");
				admin.setEmail("admin@parcel.com");
				admin.setStatus("Active");
				loginRepository.save(admin);
				System.out.println("Admin user created: admin/Password@123");
			}

			// Create Customer User
			if (loginRepository.findByUserId("user").isEmpty()) {
				Login user = new Login();
				user.setUserId("user");
				user.setPassword("Password@123");
				user.setRole("customer");
				user.setEmail("user@parcel.com");
				user.setStatus("Active");
				user.setConsumerId("USER@123456"); // Dummy ID
				loginRepository.save(user);
				System.out.println("Customer user created: user/Password@123");
				
				// Create corresponding Customer entry
				if (customerRepository.findById("USER@123456").isEmpty()) {
					Customer customer = new Customer();
					customer.setCustomerId("USER@123456");
					customer.setName("Test User");
					customer.setAddress("123 Test Street, Test City");
					customer.setPincode("110001");
					customer.setMobile("9876543210");
					customerRepository.save(customer);
					System.out.println("Customer details created for user");
				}
			}
		};
	}
}
