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
$("#sach-menu").mouseenter(function () {
    $("#top-bar-category-container-right-sach").attr("style", "visibility: visible;");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach").attr("style", "visibility: hidden;");
});

$("#top-bar-category-container-right-sach").mouseenter(function () {
    $("#top-bar-category-container-right-sach").attr("style", "visibility: visible;");
    console.log("hello");
}).mouseleave(function () {
    $("#top-bar-category-container-right-sach").attr("style", "visibility: hidden;");
    console.log("hellddo");
});
// Menu DỤNG CỤ HỌC SINH
$("#dungcu-menu").mouseenter(function () {
    $("#top-bar-category-container-right-dungcu").attr("style", "visibility: visible;");
}).mouseleave(function () {
    $("#top-bar-category-container-right-dungcu").attr("style", "visibility: hidden;");
});

$("#top-bar-category-container-right-dungcu").mouseenter(function () {
    $("#top-bar-category-container-right-dungcu").attr("style", "visibility: visible;");
    console.log("hello");
}).mouseleave(function () {
    $("#top-bar-category-container-right-dungcu").attr("style", "visibility: hidden;");
    console.log("hellddo");
});