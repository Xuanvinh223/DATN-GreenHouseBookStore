<!-- Viết hướng dẫn -->
#Viết hướng dẫn
1. com.greenhouse: Đây là package gốc của dự án của bạn. Nó có thể chứa các file cấu hình chung hoặc các file khởi đầu dự án.

2. com.greenhouse.config: Package này chứa các class cấu hình tùy chỉnh cho ứng dụng. Đây có thể là cấu hình cho Spring Boot, Spring Security, cơ sở dữ liệu, và các cấu hình khác.

3. com.greenhouse.controller: Trong package này, bạn định nghĩa các class Controller, nơi xử lý yêu cầu từ người dùng và gọi các phương thức từ Service để xử lý logic kinh doanh.

4. com.greenhouse.dto: Package này có thể chứa các class Data Transfer Objects (DTOs) để chuyển dữ liệu giữa Controller và Service, giúp tránh truyền quá nhiều thông tin không cần thiết.

5. com.greenhouse.model: Đây là nơi bạn định nghĩa các class đại diện cho các thực thể (Entities) trong cơ sở dữ liệu, thường được ánh xạ từ các bảng trong cơ sở dữ liệu.

6. com.greenhouse.repository: Trong package này, bạn định nghĩa các interface hoặc class để tương tác với cơ sở dữ liệu, thường sử dụng Spring Data JPA.

7. com.greenhouse.security: Nếu bạn sử dụng Spring Security, đây là nơi bạn định nghĩa các class liên quan đến bảo mật như UserDetails, UserDetailsService, và các class liên quan đến xác thực và ủy quyền.

8. com.greenhouse.service: Package này chứa các class Service, nơi bạn định nghĩa logic kinh doanh của ứng dụng và tương tác với Repository.

9. com.greenhouse.service.impl: Trong trường hợp bạn định nghĩa các implementation cụ thể của các interface Service, bạn có thể đặt chúng trong package này.

#Người đóng góp
| Họ Tên  | Role |
|---------------|--------------|
| [Lâm Diễm Thúy](https://github.com/ThuyLam1210)  | Project Manager,Fullstack Developer   |
| [Phạm Xuân Vinh](https://github.com/Xuanvinh223) | Project Manager,BackEnd Developer   |
| [Mai Văn Đạt ]() | Tester,  BackEnd Developer |
| [Hồ Thị Vân Anh]()|Tester,Fontend Developer|
| [Nguyễn Minh Thức]()|  Fullstack Developer|
| [Thái Hoàng An]()| Tester, Fontend Developer|

