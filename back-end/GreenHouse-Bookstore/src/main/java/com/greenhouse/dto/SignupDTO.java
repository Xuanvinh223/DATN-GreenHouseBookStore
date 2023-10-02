package com.greenhouse.dto;

import lombok.Data;

@Data
public class SignupDTO {

	private String username;
	private String fullname;
	private String password;
	private String repassword;
	private String phone;
	private String email;

}
