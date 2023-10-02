package com.greenhouse.controller.admin;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import com.greenhouse.service.impl.UserDetailsServiceImpl;
import com.greenhouse.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class AdminController {

    @Autowired
    UserDetailsServiceImpl detailsServiceImpl;

    @Autowired
    JwtUtil jwtUtil;

    @RequestMapping({ "/admin", "/admin/index" })
    public String adminPage(HttpServletRequest request, Model m) {

        // Kiểm tra xem yêu cầu có chứa token không
        String token = request.getParameter("token");
        String username = request.getParameter("username");
        try {
            // Thực hiện xác thực token và kiểm tra quyền
            UserDetails userDetails = detailsServiceImpl.loadUserByUsername(username);
            try {
                if (jwtUtil.validateToken(token, userDetails)) {
                Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
                if (authorities.stream().anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"))) {
                    // Người dùng có quyền "ROLE_ADMIN", cho phép truy cập trang admin
                    return "redirect:/admin/index.html";
                }
            }
            } catch (Exception e) {
                return "redirect:/login";
            }
        } catch (ExpiredJwtException ex) {
            // Xử lý lỗi khi token hết hạn
            System.out.println("token đã hết hạn");
            return "redirect:/login";
        }

        // Người dùng không có token hợp lệ hoặc không có quyền, có thể xử lý theo cách
        // khác hoặc trả về trang lỗi
        return "redirect:/login";
    }

}
