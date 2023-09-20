package com.greenhouse.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.io.Decoders;
import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Khóa bí mật được sử dụng để ký và giải mã JWT
    public static final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    // Trích xuất tên người dùng từ JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Trích xuất thời hạn hết hạn của JWT
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Trích xuất thông tin từ JWT sử dụng một hàm số xử lý đặc biệt
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Trích xuất tất cả thông tin từ JWT
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Kiểm tra xem JWT có hết hạn chưa
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Xác minh tính hợp lệ của JWT so với người dùng
    public Boolean validateToken(String token, UserDetails userDetails) {
    	
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Tạo JWT dựa trên tên người dùng
    public String generateToken(String userName, Collection<? extends GrantedAuthority> collection) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", collection);
        return createToken(claims, userName);
    }

    // Tạo JWT từ các thông tin được cung cấp
    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+20000))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    // Lấy khóa ký và giải mã từ chuỗi bí mật
    private Key getSignKey() {
        byte[] keyBytes= Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
