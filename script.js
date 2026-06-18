// =============================================
// Fashion Store - JavaScript File
// =============================================

// all clothes data
var allItems = [
    { id: 1, name: "Classic T-Shirt", price: 29.99, cat: "men", star: true,
      pic: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },
    { id: 2, name: "Premium Hoodie", price: 59.99, cat: "men", star: true,
      pic: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600" },
    { id: 3, name: "Slim Fit Jeans", price: 49.99, cat: "men", star: false,
      pic: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600" },
    { id: 4, name: "Leather Jacket", price: 129.99, cat: "men", star: true,
      pic: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600" },
    { id: 5, name: "Floral Dress", price: 79.99, cat: "women", star: true,
      pic: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600" },
    { id: 6, name: "Running Sneakers", price: 89.99, cat: "both", star: false,
      pic: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600" }
];

// cart empty at start
var myCart = [];


// ---- make html card for one product ----
function buildCard(item) {

    var box = document.createElement("div");
    box.className = "col-md-4 col-sm-6";
    box.setAttribute("data-name", item.name.toLowerCase());

    var html = "";
    html += "<div class='item-card'>";
    html += "<img src='" + item.pic + "' alt='" + item.name + "'>";
    html += "<div class='info'>";
    html += "<h5>" + item.name + "</h5>";
    html += "<p class='item-price'>$" + item.price.toFixed(2) + "</p>";
    html += "<button onclick='addItem(" + item.id + ")'>Add to Cart</button>";
    html += "</div></div>";

    box.innerHTML = html;
    return box;
}


// ---- put products inside a row ----
function fillRow(rowId, arr) {
    var row = document.getElementById(rowId);
    row.innerHTML = "";

    for (var x = 0; x < arr.length; x++) {
        row.appendChild(buildCard(arr[x]));
    }
}


// ---- when page loads show products ----
function startPage() {

    var featured = [];
    var menList = [];
    var womenList = [];

    for (var i = 0; i < allItems.length; i++) {

        if (allItems[i].star == true) {
            featured.push(allItems[i]);
        }

        if (allItems[i].cat == "men" || allItems[i].cat == "both") {
            menList.push(allItems[i]);
        }

        if (allItems[i].cat == "women" || allItems[i].cat == "both") {
            womenList.push(allItems[i]);
        }
    }

    fillRow("featuredBox", featured);
    fillRow("productBox", allItems);
    fillRow("menBox", menList);
    fillRow("womenBox", womenList);

    refreshCart();
}


// ---- search function ----
document.getElementById("searchInput").onkeyup = function () {

    var text = this.value.toLowerCase();
    var allCards = document.querySelectorAll("#productBox [data-name]");
    var count = 0;

    for (var i = 0; i < allCards.length; i++) {
        var pname = allCards[i].getAttribute("data-name");

        if (pname.indexOf(text) >= 0) {
            allCards[i].style.display = "block";
            count++;
        } else {
            allCards[i].style.display = "none";
        }
    }

    if (count == 0) {
        document.getElementById("searchEmpty").hidden = false;
    } else {
        document.getElementById("searchEmpty").hidden = true;
    }
};


// ---- add to cart ----
function addItem(id) {

    // find product first
    var prod = null;
    for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].id == id) {
            prod = allItems[i];
        }
    }

    if (prod == null) return;

    // check if already in cart
    var found = false;
    for (var j = 0; j < myCart.length; j++) {
        if (myCart[j].id == id) {
            myCart[j].qty = myCart[j].qty + 1;
            found = true;
        }
    }

    // if not found add new
    if (found == false) {
        myCart.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            pic: prod.pic,
            qty: 1
        });
    }

    refreshCart();
}


// ---- remove from cart ----
function deleteItem(id) {
    var temp = [];

    for (var i = 0; i < myCart.length; i++) {
        if (myCart[i].id != id) {
            temp.push(myCart[i]);
        }
    }

    myCart = temp;
    refreshCart();
}


// ---- update cart table ----
function refreshCart() {

    var tbody = document.getElementById("cartTable");
    var emptyRow = document.getElementById("cartEmptyRow");

    var totalQty = 0;
    var totalMoney = 0;

    for (var i = 0; i < myCart.length; i++) {
        totalQty = totalQty + myCart[i].qty;
        totalMoney = totalMoney + (myCart[i].price * myCart[i].qty);
    }

    // update numbers on screen
    document.getElementById("cartCount").innerHTML = totalQty;
    document.getElementById("itemCount").innerHTML = totalQty;
    document.getElementById("grandTotal").innerHTML = "$" + totalMoney.toFixed(2);

    // if cart empty
    if (myCart.length == 0) {
        document.getElementById("btnClear").disabled = true;
        document.getElementById("btnOrder").disabled = true;
        tbody.innerHTML = "";
        tbody.appendChild(emptyRow);
        emptyRow.hidden = false;
        return;
    }

    document.getElementById("btnClear").disabled = false;
    document.getElementById("btnOrder").disabled = false;

    // build table rows
    tbody.innerHTML = "";

    for (var k = 0; k < myCart.length; k++) {
        var c = myCart[k];
        var sub = c.price * c.qty;

        var tr = document.createElement("tr");
        tr.innerHTML =
            "<td><img src='" + c.pic + "'></td>" +
            "<td>" + c.name + "</td>" +
            "<td>$" + c.price.toFixed(2) + "</td>" +
            "<td>" + c.qty + "</td>" +
            "<td>$" + sub.toFixed(2) + "</td>" +
            "<td><button class='btn-del' onclick='deleteItem(" + c.id + ")'><i class='bi bi-trash'></i></button></td>";

        tbody.appendChild(tr);
    }
}


// ---- clear cart button ----
document.getElementById("btnClear").onclick = function () {
    myCart = [];
    document.getElementById("orderDone").hidden = true;
    refreshCart();
};


// ---- submit order button ----
document.getElementById("btnOrder").onclick = function () {

    if (myCart.length == 0) {
        alert("Cart is empty!");
        return;
    }

    document.getElementById("orderDone").hidden = false;
    myCart = [];
    refreshCart();

    // hide message after 5 sec
    setTimeout(function () {
        document.getElementById("orderDone").hidden = true;
    }, 5000);
};


// ---- contact form check ----
document.getElementById("myForm").onsubmit = function (e) {
    e.preventDefault();

    var n = document.getElementById("txtName").value;
    var em = document.getElementById("txtEmail").value;
    var m = document.getElementById("txtMsg").value;

    n = n.trim();
    em = em.trim();
    m = m.trim();

    var good = true;

    if (n == "") {
        document.getElementById("errName").hidden = false;
        good = false;
    } else {
        document.getElementById("errName").hidden = true;
    }

    if (em == "" || em.indexOf("@") < 0) {
        document.getElementById("errEmail").hidden = false;
        good = false;
    } else {
        document.getElementById("errEmail").hidden = true;
    }

    if (m == "") {
        document.getElementById("errMsg").hidden = false;
        good = false;
    } else {
        document.getElementById("errMsg").hidden = true;
    }

    if (good == true) {
        document.getElementById("formOk").hidden = false;
        document.getElementById("myForm").reset();

        setTimeout(function () {
            document.getElementById("formOk").hidden = true;
        }, 4000);
    }
};


// run when page ready
window.onload = startPage;
