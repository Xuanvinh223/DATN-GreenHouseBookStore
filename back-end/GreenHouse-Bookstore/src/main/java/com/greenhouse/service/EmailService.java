package com.greenhouse.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("GreenHouse", "GreenHouse");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendEmailSigup(String to, String subject, String confirmationCode) {
        String html = "<html><body><h1>Mã xác nhận của bạn là : " + confirmationCode + "</h1></body></html>";
        sendEmail(to, subject, html);
    }

    public void sendEmailFogotPassword(String to, String subject, String token) {
        String html = "<!DOCTYPE html>\r\n" + //
                "<html>\r\n" + //
                "<head>\r\n" + //
                "    <meta charset=\"UTF-8\">\r\n" + //
                "    <title>Đổi Mật Khẩu</title>\r\n" + //
                "</head>\r\n" + //
                "<body>\r\n" + //
                "    <div style=\"background-color: white; font-family: Arial, sans-serif; padding: 20px; text-align: center;\">\r\n" + //
                "        <img src=\"https://down-ws-vn.img.susercontent.com/87ec164c0d56e1d4c58487973017ed3f_tn\" alt=\"Logo\" width=\"150\" height=\"150\">\r\n" + //
                "        <h2>Thay đổi Mật Khẩu</h2>\r\n" + //
                "        <p>Vui lòng nhấp vào liên kết bên dưới để đổi mật khẩu tài khoản của bạn:</p>\r\n" + //
                "        <a href=\"http://localhost:8081/change-password?token=" + token + "\" style=\"background-color: green; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 10px;\">Đổi Mật Khẩu</a>\r\n" + //
                "        <p>Nếu bạn không yêu cầu đổi mật khẩu, xin vui lòng bỏ qua email này. Liên kết này sẽ hết hạn sau 24 giờ.</p>\r\n" + //
                "    </div>\r\n" + //
                "</body>\r\n" + //
                "</html>\r\n" + //
                "";
        sendEmail(to, subject, html);
    }

}
