// ================ LANGUAGE =================================================================
function toggleLanguage() {
    let languageDropdown = document.getElementById("top-language-dropdown");

    if (languageDropdown.style.display === "block") {
        languageDropdown.style.display = "none";
    } else {
        languageDropdown.style.display = "block";
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

    $scope.changeLanguage = function (lang) {
        localStorage.setItem("lang", lang);
        $scope.setLanguage();
    }

    $scope.setLanguage = function () {
        var lang = localStorage.getItem("lang");

        let flagIcon = document.querySelector(".top-language-flag-icon");
        let languageDropdown = document.getElementById("top-language-dropdown");
        languageDropdown.style.display = "none";

        let flagImage = "";
        if (lang) {
            if (lang == "en") {
                flagImage = "https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/store/english.svg"
            } else if (lang == "vi") {
                flagImage = "https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/default.svg";
            }
        } else {
            flagImage = "https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/default.svg";
        }
        flagIcon.style.backgroundImage = `url(${flagImage})`;
    }
    $scope.setLanguage();

    $(document).ready(function () {
        $('.selectpicker').selectpicker();
});

//Menu Sách
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


    $(document).ready(function () {
        $("a[href*=lang]").on("click", function () {
            var param = $(this).attr("href");
            $.ajax({
                url: "/index" + param,
                success: function () {
                    location.reload();
                }
            });
            return false;
        });
    });

