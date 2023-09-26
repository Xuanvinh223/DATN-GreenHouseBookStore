// package com.greenhouse.controller.AdminController;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.greenhouse.service.CountryService;

// @RestController
// @RequestMapping("/countries")
// public class CountryController {
//     @Autowired
//     private CountryService countryService;

//     @GetMapping("/all-names")
//     public ResponseEntity<String> getAllCountryNames() {
//         String countryNames = countryService.getAllCountryNames();
//         return new ResponseEntity<>(countryNames, HttpStatus.OK);
//     }
// }
