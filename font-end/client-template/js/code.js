function toggleLanguage() {
    let language = document.getElementById("top-language-dropdown");
    if (language.style.display === "block") {
        language.setAttribute("style", "display: none;");
    } else {
        language.setAttribute("style", "display: block;");
    }
}



var checkToggleLanguage = function (event) {
    let find = false;
    let element = event.target;
    for (let i = 0; i < element.classList.length; i++) {
        if (element.classList[i].includes("top-language")) {
            find = true;
            break;
        }
    }


    if (find) {
       
    } else {
        let language = document.getElementById("top-language-dropdown");
        language.setAttribute("style", "display: none;");
    }

}

var allElement = document.getElementsByTagName("*");
for (let i = 0; i < allElement.length; i++) {
    allElement[i].addEventListener("click", checkToggleLanguage);
}
//Menu Sách
// $("#sach-menu").mouseenter(function () {
//     $("#top-bar-category-container-right-sach").attr("style", "visibility: visible;");
// }).mouseleave(function () {
//     $("#top-bar-category-container-right-sach").attr("style", "visibility: hidden;");
// });

// $("#top-bar-category-container-right-sach").mouseenter(function () {
//     $("#top-bar-category-container-right-sach").attr("style", "visibility: visible;");
//     console.log("hello");
// }).mouseleave(function () {
//     $("#top-bar-category-container-right-sach").attr("style", "visibility: hidden;");
//     console.log("hellddo");
// });
// // Menu DỤNG CỤ HỌC SINH
// $("#dungcu-menu").mouseenter(function () {
//     $("#top-bar-category-container-right-dungcu").attr("style", "visibility: visible;");
// }).mouseleave(function () {
//     $("#top-bar-category-container-right-dungcu").attr("style", "visibility: hidden;");
// });


// Xử lý sự kiện cho menu sách
$("#sach-menu").mouseenter(function () {
    // Thay đổi nội dung của menu sách tại đây
    $("#top-bar-category-container-right").html(`
        <!-- Thay đổi nội dung của menu sách -->
      <div class="top-bar-category-container-right-title">
        <i class="ico_lamdepsuckhoe"></i>
        <span>Sách Truyện</span>
      </div>
      <div class="top-bar-category-container-right-menu">

        <div class="row">
          <div class="col-lg-4">
            <ul>
              <h3 class="title">Truyện</h3>

              <li><a href="#">Tiểu Thuyết</a></li>
              <li><a href="#">Ngôn Tình</a></li>
              <li><a href="#">Khoa Học Viễn Tưởng</a></li>
              <li><a href="#">Kinh Dị</a></li>
              <li><a href="#">Đam Mỹ</a></li>
              <li><a href="#" class="title-last">Xem tất cả</a></li>

            </ul>
          </div>
          <div class="col-lg-4">
            <ul>
              <h3 class="title">Sách Ngoại Ngữ</h3>

              <li><a href="#">Tiếng Anh</a></li>
              <li><a href="#">Tiếng Nhật</a></li>
              <li><a href="#">Tiếng Hoa</a></li>
              <li><a href="#">Tiếng Hàn</a></li>
              <li><a href="#" class="title-last">Xem tất cả</a></li>

            </ul>
          </div>
          <div class="col-lg-4">
            <ul>
              <h3 class="title">Sách Giáo Khoa - Tham Khảo</h3>
              <li><a href="#">Sách Giáo Khoa</a></li>
              <li><a href="#">Sách Tham Khảo</a></li>
              <li><a href="#">Luyện Thi THPT Quốc Gia</a></li>
              <li><a href="#">Mẫu Giáo</a></li>
              <li><a href="#" class="title-last">Xem tất cả</a></li>
            </ul>
          </div>

        </div>

      </div> 
    `);
    $("#top-bar-category-container-right").attr("style", "visibility: visible;");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach").attr("style", "visibility: hidden;");
});
  // Hover mặc định vào tab có id sach-menu
  $("#sach-menu").trigger("mouseenter");


// Xử lý sự kiện cho menu dụng cụ học sinh
$("#dungcu-menu").mouseenter(function () {
    // Thay đổi nội dung của menu dụng cụ học sinh tại đây
    $("#top-bar-category-container-right").html(`
        <!-- Thay đổi nội dung của menu dụng cụ học sinh -->
      <div class="top-bar-category-container-right-title">
        <i class="ico_lamdepsuckhoe"></i>
        <span>Dụng Cụ Học Sinh</span>
      </div>
      <div class="top-bar-category-container-right-menu">

        <div class="row">
          <div class="col-lg-4">
            <ul>
              <h3 class="title">Truyện</h3>

              <li><a href="#">Tiểu Thuyết</a></li>
              <li><a href="#">Ngôn Tình</a></li>
              <li><a href="#">Khoa Học Viễn Tưởng</a></li>
              <li><a href="#">Kinh Dị</a></li>
              <li><a href="#">Đam Mỹ</a></li>
              <li><a href="#" class="title-last">Xem tất cả</a></li>

            </ul>
          </div>
          <div class="col-lg-4">
            <ul>
              <h3 class="title">Sách Ngoại Ngữ</h3>

              <li><a href="#">Tiếng Anh</a></li>
              <li><a href="#">Tiếng Nhật</a></li>
              <li><a href="#">Tiếng Hoa</a></li>
              <li><a href="#">Tiếng Hàn</a></li>
              <li><a href="#" class="title-last">Xem tất cả</a></li>

            </ul>
          </div>
          <div class="col-lg-4">
            <ul>
              <h3 class="title">Sách Giáo Khoa - Tham Khảo</h3>
              <li><a href="#">Sách Giáo Khoa</a></li>
              <li><a href="#">Sách Tham Khảo</a></li>
              <li><a href="#">Luyện Thi THPT Quốc Gia</a></li>
              <li><a href="#">Mẫu Giáo</a></li>
              <li><a href="#" class="title-last">Xem tất cả</a></li>
            </ul>
          </div>
        </div>

      </div> 
    `);
    $("#top-bar-category-container-right").attr("style", "visibility: visible;");
}).mouseleave(function () {
    $("#top-bar-category-container-right").attr("style", "visibility: hidden;");
});
//   Hover bên phải
$("#top-bar-category-container-right").mouseenter(function () {
    $("#top-bar-category-container-right").attr("style", "visibility: visible;");
    console.log("hello");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach").attr("style", "visibility: hidden;");
    console.log("hellddo");
});
// // Menu DỤNG CỤ HỌC SINH
// $("#dungcu-menu").mouseenter(function () {
//     $("#top-bar-category-container-right-dungcu").attr("style", "visibility: visible;");
// }).mouseleave(function () {
//     $("#top-bar-category-container-right-dungcu").attr("style", "visibility: hidden;");
// });

// $("#top-bar-category-container-right-dungcu").mouseenter(function () {
//     $("#top-bar-category-container-right-dungcu").attr("style", "visibility: visible;");
//     console.log("hello");
// }).mouseleave(function () {
//     $("#top-bar-category-container-right-dungcu").attr("style", "visibility: hidden;");
//     console.log("hellddo");
// });