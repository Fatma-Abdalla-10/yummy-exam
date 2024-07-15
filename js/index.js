let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;
$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(700);
        $("body").css("overflow", "visible");
    });
});

window.openSideNav = function () {
    $(".side-nav-menu").animate({
        left: 0
    }, 500);

    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100);
    }
};

window.closeSideNav = function () {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500);

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");

    $(".links li").animate({
        top: 300
    }, 500);
};

closeSideNav();

$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});

window.displayAreaMeals = function (meals) {
    let cartoona = "";
    for (let i = 0; i < meals.length; i++) {
        cartoona += `
        <div class="col-md-3">
            <div id="meal-${meals[i].idMeal}" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meals[i].strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meals[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = cartoona;

    for (let i = 0; i < meals.length; i++) {
        document.getElementById(`meal-${meals[i].idMeal}`).addEventListener("click", function (event) {
            getMealDetails(event, meals[i].idMeal);
        });
    }
};


window.getAreaMeals = async function(area) {
    try {
        closeSideNav();
        rowData.innerHTML = ""; 
        $(".loading-screen").fadeIn(300);

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let data = await response.json();

        data.meals ? displayAreaMeals(data.meals) : displayAreaMeals([]);
        $(".loading-screen").fadeOut(300);
    } catch (error) {
        console.error('Error fetching meals by area:', error);
    }
};

window.displayArea = function(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${arr[i].strArea}</h3>
            </div>
        </div>
        `;
    }

    rowData.innerHTML = cartoona; 
};

window.displayIngredients = async function (ingredients) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".loading-screen").fadeIn(300);

    let cartoona = "";

    for (let i = 0; i < ingredients.length; i++) {
        cartoona += `
        <div class="col-md-3">
            <div class="rounded-2 text-center cursor-pointer ingredient-item" data-ingredient="${ingredients[i].strIngredient}">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredients[i].strIngredient}</h3>
                <div id="meals_${i}" class="meals-list"></div>
            </div>
        </div>
        `;
    }

    rowData.innerHTML = cartoona;

    rowData.querySelectorAll('.ingredient-item').forEach(item => {
        item.addEventListener('click', function () {
            let ingredient = this.getAttribute('data-ingredient');
            getIngredientsMeals(ingredient);
        });
    });

    $(".loading-screen").fadeOut(300);
};

window.getIngredientsList = async function () {
    try {
        let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        let data = await response.json();
        let ingredientsList = data.meals;

        displayIngredients(ingredientsList);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
};

window.getIngredientsMeals = async function (ingredient) {
    try {
        closeSideNav();
        rowData.innerHTML = "";
        $(".loading-screen").fadeIn(300);

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        let data = await response.json();

        data.meals ? displayMeals(data.meals) : displayMeals([]);
        $(".loading-screen").fadeOut(300);
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
};


window.getCategoryMeals = async function (category) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".loading-screen").fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    $(".loading-screen").fadeOut(300);
};

window.displayMeals = function (arr) {
    let cartoona = "";
    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
            <div id="meal-${arr[i].idMeal}" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${arr[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = cartoona;

    for (let i = 0; i < arr.length; i++) {
        document.getElementById(`meal-${arr[i].idMeal}`).addEventListener("click", function (event) {
            getMealDetails(event, arr[i].idMeal);
        });
    }
};

window.displayCategories = function (arr) {
    let cartoona = "";
    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer" >
                <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${arr[i].strCategory}</h3>
                    <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = cartoona;
};
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

window.showContacts = function () {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
    submitBtn = document.getElementById("submitBtn");

    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true;
    });

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true;
    });

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true;
    });

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true;
    });

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true;
    });

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true;
    });
};

window.inputsValidation = function () {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block");
        }
    }
    if (emailInputTouched) {
        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block");
        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        }
    }

    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
        }
    }

    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
};

window.nameValidation = function () {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value));
};

window.emailValidation = function () {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value));
};

window.phoneValidation = function () {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value));
};

window.ageValidation = function () {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value));
};

window.passwordValidation = function () {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value));
};

window.repasswordValidation = function () {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value;
};

window.getMealDetails = async function (event, mealID) {
    event.stopPropagation();
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();

    displayMealDetails(response.meals[0]);
    $(".inner-loading-screen").fadeOut(300);
}

window.displayMealDetails = async function (meal) {
    searchContainer.innerHTML = "";

    let ingredients = ``;

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }

    let tags = meal.strTags?.split(",");
    if (!tags) tags = [];

    let tagsStr = '';
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }

    let cartoona = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients}
        </ul>

        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsStr}
        </ul>

        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;

    rowData.innerHTML = cartoona;
}

window.showSearchInputs = function () {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-white text-black" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-white text-black" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;

    rowData.innerHTML = "";
};

window.searchByName= async function (term) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    response = await response.json();

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    $(".inner-loading-screen").fadeOut(300);
}

window.searchByFLetter= async function (term) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    term === "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);


    response = await response.json();

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    $(".inner-loading-screen").fadeOut(300);
};

document.getElementById("searchLink").addEventListener("click", () => {
    showSearchInputs();
});

document.getElementById("categoriesLink").addEventListener("click", async () => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();
    displayCategories(response.categories);
});

document.getElementById("areaLink").addEventListener("click", async () => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();
    displayArea(response.meals);
});

document.getElementById("ingredientsLink").addEventListener("click", async () => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
    displayIngredients(response.meals);
});

document.getElementById("contactLink").addEventListener("click", () => {
    showContacts();
});
