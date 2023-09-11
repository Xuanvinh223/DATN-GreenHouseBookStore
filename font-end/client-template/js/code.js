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
    $("#top-bar-category-container-right-sach").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach").css("display", "none");
});

$("#top-bar-category-container-right-sach").mouseenter(function () {
    $("#top-bar-category-container-right-sach").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach").css("display", "none");
});
  // Hover mặc định vào tab có id sach-menu
  $("#sach-menu").trigger("mouseenter");
//Menu Sách Nước ngoài
$("#sachnuocngoai-menu").mouseenter(function () {
    $("#top-bar-category-container-right-nuocngoai").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-nuocngoai").css("display", "none");
});

$("#top-bar-category-container-right-nuocngoai").mouseenter(function () {
    $("#top-bar-category-container-right-nuocngoai").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-nuocngoai").css("display", "none");
});

// Menu DỤNG CỤ HỌC SINH
$("#dungcu-menu").mouseenter(function () {
    $("#top-bar-category-container-right-dungcu").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-dungcu").css("display", "none");
});

$("#top-bar-category-container-right-dungcu").mouseenter(function () {
    $("#top-bar-category-container-right-dungcu").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-dungcu").css("display", "none");
});

//Menu Hành trang đến trường
$("#hanhtrang-menu").mouseenter(function () {
    $("#top-bar-category-container-right-hanhtrang").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-hanhtrang").css("display", "none");
});

$("#top-bar-category-container-right-hanhtrang").mouseenter(function () {
    $("#top-bar-category-container-right-hanhtrang").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-hanhtrang").css("display", "none");
});




//Menu Sách mobile
$("#sach-menu1").mouseenter(function () {
    $("#top-bar-category-container-right-sach1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach1").css("display", "none");
});

$("#top-bar-category-container-right-sach1").mouseenter(function () {
    $("#top-bar-category-container-right-sach1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach1").css("display", "none");
});


//Menu Sách nước ngoài mobile
$("#sachnuocngoai-menu1").mouseenter(function () {
    $("#top-bar-category-container-right-nuocngoai1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-nuocngoai1").css("display", "none");
});

$("#top-bar-category-container-right-nuocngoai1").mouseenter(function () {
    $("#top-bar-category-container-right-nuocngoai1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-nuocngoai1").css("display", "none");
});

// Menu DỤNG CỤ HỌC SINH mobile
$("#dungcu-menu1").mouseenter(function () {
    $("#top-bar-category-container-right-dungcu1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-dungcu1").css("display", "none");
});

$("#top-bar-category-container-right-dungcu1").mouseenter(function () {
    $("#top-bar-category-container-right-dungcu1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-dungcu1").css("display", "none");
});

// Menu Hành trang đến trường mobile
$("#hanhtrang-menu1").mouseenter(function () {
    $("#top-bar-category-container-right-hanhtrang1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-hanhtrang1").css("display", "none");
});

$("#top-bar-category-container-right-hanhtrang1").mouseenter(function () {
    $("#top-bar-category-container-right-hanhtrang1").css("display", "block");
}).mouseleave(function () {
    $("#top-bar-category-container-right-hanhtrang1").css("display", "none");
});
