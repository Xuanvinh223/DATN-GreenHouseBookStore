// package com.greenhouse.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// @Service
// public class CountryService {
//     private final String apiUrl = "https://restcountries.com/v3.1/all?fields=name"; // Đường dẫn API cập nhật

//     @Autowired
//     private RestTemplate restTemplate;

//     public String getAllCountryNames() {
//         return restTemplate.getForObject(apiUrl, String.class);
//     }
// }
