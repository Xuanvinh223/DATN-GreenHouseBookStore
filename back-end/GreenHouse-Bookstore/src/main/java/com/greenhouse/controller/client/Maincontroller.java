package com.greenhouse.controller.client;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Maincontroller {
	@GetMapping(value = "/index")
	public String index() {
		return "client/layouts/home";
	}

	@GetMapping(value = "/contact")
	public String contact() {
		return "client/layouts/contact";
	}

	@GetMapping(value = "/voucher")
	public String voucher() {
		return "client/layouts/voucher";
	}

	@GetMapping(value = "/flash-sale")
	public String flashSale() {
		return "client/layouts/flash-sale";
	}

	@GetMapping(value = "/product")
	public String product() {
		return "client/layouts/product";
	}

	@GetMapping(value = "/product-details")
	public String productDetails() {
		return "client/layouts/product-details";
	}

	@GetMapping(value = "/account")
	public String account() {
		return "client/layouts/account";
	}

	@GetMapping(value = "/cart")
	public String cart() {
		return "client/layouts/cart";
	}

	@GetMapping(value = "/checkout")
	public String checkout() {
		return "client/layouts/checkout";
	}

	@GetMapping(value = "/checkout-complete")
	public String checkoutComplete() {
		return "client/layouts/checkout-complete";
	}
	
	@GetMapping(value = "/login")
	public String login() {
		return "client/layouts/login";
	}
	
	@GetMapping(value = "/resgister")
	public String signin() {
		return "client/layouts/signin";
	}
	
	@GetMapping(value = "/forgot-password")
	public String forgotPasswrod() {
		return "client/layouts/forgot-password";
	}

	@GetMapping("/403")
	public String accessDenied() {
		System.out.println("Access Denied Controller Called");
		return "client/layouts/home"; // Chuyển hướng đến trang 403
	}
}
