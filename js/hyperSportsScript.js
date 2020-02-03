//only loading script data once DOM content is fully loaded the ready() will run
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
};

//global variables
var roundedTotal;
var discount = 0;
var cartTotal;
var beforeVATString;
var afterVATString;

//ready() function used for buttons and will only run once page has loaded
function ready() {
    //declare variable for button defined by class name "btn-danger"
    var removeCartItemButtons = document.getElementsByClassName("btn-danger");
    //loop through buttons and add click event to button for removing item as well as adding call back function to button
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener("click", removeCartItem);
    };
    //add call back function once quantity input has been changed while looping through all quantity inputs
    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    };
    //loop through add to cart buttons and add call back function once button has been clicked
    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    };
    //find button to send items and total to cart
    let sendCart = document.getElementsByClassName('btn-sendToCart')[0];
    //check that sendCart is not null first
    if (sendCart) {
        sendCart.addEventListener('click', sendToCartClicked);
    };
    //confirm button to confirm purchase
    let confirmButton = document.getElementsByClassName('btn-confirm')[0];
    if (confirmButton) {
        confirmButton.addEventListener('click', confirmOrder);
    };

};

//remove cart-items but total remains and is sent to cart page to be paid for
function sendToCartClicked() {
    alert("Sent to cart");
    var cartItems = document.getElementsByClassName('cart-items')[0];
    //while will continue as long as condition is true
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    };
};
//function which will remove cart  item when button is pressed and then update the total
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    localStorage.setItem("roundedTotal", roundedTotal);
};
//function which will adjut the input value to 1 if 0 or negative number is selected and will update total
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    };
    updateCartTotal();
    localStorage.setItem("roundedTotal", roundedTotal);
};
//function which will add item to cart while displaying the image, title and price as well as adding the price to the total
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
    localStorage.setItem("roundedTotal", roundedTotal);
    alert(`The total is now ${roundedTotal}`);
};
//create item objects and check if items have been added already
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    cartRow.classList.add('row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert("This item has already been added to cart");
            return;
        };
    };
    //create object instances
    var cartRowContents = `
    <div class="cart-item col-3">
            <img src="${imageSrc}" class="img-thumbnail shop-item-image" width="100" height="100">
            <span class="cart-item-title">${title}</span>
    </div>
        <span class="col-3 cart-price">${price}</span>
    <div class="cart-quantity col-3">
            <input class="cart-quantity-input" type='number' value="1">
            <button class="btn-danger">Remove</button>
    </div>`;
    //add the created objects to the html
    cartRow.innerHTML = cartRowContents;
    cartItems.appendChild(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
};
//update cart total
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    //set total to be zero initially
    var total = 0;
    //loop through cart rows
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        //convert price from string to a number tat can be worked with
        var price = parseFloat(priceElement.innerText.replace('R', ''));
        var quantity = quantityElement.value;
        //add total by adding the price times the quantity to the initial zero value
        total = total + (price * quantity);
    };
    //round number to two decimal places
    roundedTotal = Math.round(total * 100) / 100;
    //add total to cart total price
    document.getElementsByClassName('cart-total-price')[0].innerText = 'R' + roundedTotal;
    //store cart total in session storage
    localStorage.setItem("roundedTotal", roundedTotal);
};

//check for discount
function checkDiscount() {
    var couponDiscount = 0;
    //set promo code to "promo"
    var promo = "promo";
    //.trim() remove white space
    var couponPromo = promo.trim();
    var promoInput = document.getElementById("promoCodeId").value;
    //if input equals promo code then coupon discount will be added else there will be no discount
    if (promoInput.toLowerCase() == couponPromo.toLowerCase()) {
        couponDiscount = couponDiscount + 100;
        discount = couponDiscount;
        localStorage.setItem("discount", discount);
    } else {
        couponDiscount = 0;
        discount = couponDiscount
        localStorage.setItem("discount", discount);
    };
    localStorage.setItem("discount", discount);
    document.getElementsByClassName("cart-discount")[0].innerText = discount;
}
//adding shipping cost fee depending on whether delivery or collection is selected
var shippingCost = 100;

function addDeliveryCost() {
    shippingCost += 100;
    alert(`You've chosen the delivery option which comes with R${shippingCost} delivery fee`);
    localStorage.setItem("shippingCost", shippingCost);
}
//removing delivery fee if collection is selected
function removeDeliveryCost() {
    shippingCost = 100 - shippingCost;
    alert(`You've chosen the collection option which comes with R${shippingCost} transaction fee`)
    localStorage.setItem("shippingCost", shippingCost);
}

//adds function once page is loaded
function onLoad() {
    //adding before VAT total on new page
    beforeVAT = localStorage.getItem("roundedTotal");
    beforeVATString = document.getElementsByClassName('cart-final-price-BV')[0].innerText = beforeVAT;
    var afterVAT = (15 / 100) * beforeVAT;
    afterVATString = document.getElementsByClassName("cart-final-price-AV")[0].innerText = +afterVAT + +beforeVAT;
}

//calculate total by adding coupon discount, afterVAT total, and shipping fee
function calcTotal() {
    document.getElementsByClassName('cart-discount')[0].innerText = discount;
    document.getElementsByClassName('cart-shipping-fee')[0].innerText = 'R' + shippingCost;
    //+ signs use to indicate that nubers are being added instead of strings
    finalCost = +afterVATString + +shippingCost - +discount;
    //rounds number to two decimal places
    finalCost = Math.round(finalCost * 100) / 100;
    document.getElementsByClassName('cart-final-price')[0].innerText = 'R' + finalCost;
    localStorage.setItem("finalCost", finalCost);
}


//confirm order function including random reference number generated
var refNumber = Math.floor(Math.random() * 10000000) + 1;

function confirmOrder() {
    alert('Thank you for ordering from us. Your unique reference number is ' + refNumber);
}

//loads JQuery once page has loaded
$(document).ready(function() {
    //link to cart page using JQuery
    $("#goCartButton").click(function() {
        window.location.href = "cart.html";
        return false;
    });

    //animation on founders paragraph
    $("#founderHeading").mouseenter(function() {
        $("#founderParagraph").animate({
            opacity: '0.4',
            fontSize: '1.5em'
        });
    });
    //chaining effect set upon hovering over reviews heading
    $("#reviewsHeading").mouseenter(function() {
        $("#reviewsSection").css("backgroundColor", "lime");
    })
    $("#reviewsHeading").mouseleave(function() {
        $("#reviewsSection").css("backgroundColor", "mediumspringgreen");
    })
    //jQuery function hiding and showing contact info
    $(".tab-panel").mouseenter(function() {
        $(".panel").addClass("active");
    });
    $(".tab-panel").mouseleave(function() {
        $(".panel").removeClass("active");
    });
    //changing form when delivery option is clicked or collection
    $("#collectionRadio").on("change", function() {
        $(".shippingInfo").css("display", "none");
    });
    $("#deliveryRadio").on("change", function() {
        $(".shippingInfo").css("display", "block");
    });

});