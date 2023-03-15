var userNumber = null;

AFRAME.registerComponent("markerhandler", {
    init: async function(){
        if(userNumber === null){
            this.askUserId();
        }

        //getting data from the toys collection
        var toys = await this.getToys();

        //markerFound event
        this.el.addEventListener("markerFound", () => {
            if(userNumber !== null){
                var markerId = this.el.id;
                this.handleMarkerFound(toys, markerId);
            }
        });

        //markerLost event
        this.el.addEventListener("markerLost", () => {
            this.handleMarkerLost();
        });
    },
    askUserId: function(){
        var iconUrl = "https://cdn-icons-png.flaticon.com/512/5015/5015126.png";
        swal({
            title: "Welcome to Toy Store!",
            icon: iconUrl,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your user id",
                    type: "number",
                    min: 1
                }
            },
            closeOnClickOutside: false,
        }).then(inputValue => {
            userNumber = inputValue;
        });
    },
    handleMarkerFound: function(toys, markerId){
        //getting the toy based on id
        var toy = toys.filter(toy => toy.id === markerId)[0]; //***

        //checking if the toy is out of stock or not
        if(toy.is_out_of_stock){
            swal({
                icon: "warning",
                title: toy.toy_name.toUpperCase(),
                text: "Sorry, this toy is out of stock",
                time: 2500,
                buttons: false
            });
        }

        else{
            //making the model visible
            var model = document.querySelector(`#model-${toy.id}`);
            model.setAttribute("visible", true);

            //making the toy description plane visible
            var toyMainPlane = document.querySelector(`#main-plane-${toy.id}`);
            toyMainPlane.setAttribute("visible", true);

            //making the price plane visible
            var pricePlane = document.querySelector(`#price-plane-${toy.id}`);
            pricePlane.setAttribute("visible", true);

            //making the rating plane visible
            var ratingPlane = document.querySelector(`#rating-plane-${toy.id}`);
            ratingPlane.setAttribute("visible", true);

            //making the review plane visible
            var reviewPlane = document.querySelector(`#review-plane-${toy.id}`);
            reviewPlane.setAttribute("visible", true);

            //button div displaying style
            var button_div = document.getElementById("button-div");
            button_div.style.display = "flex";
            
            var summary_button = document.getElementById("summary-button");
            var pay_button = document.getElementById("pay-button");
            var rate_button = document.getElementById("rate-button");
            var order_button = document.getElementById("order-button");
            
            //handling click events
            order_button.addEventListener("click", () => {
                //getting user number
                var uid;
                userNumber <= 9 ? (uid = `U0${userNumber}`) : `U${userNumber}}`
                
                this.handleOrder(uid, toy);

                swal({
                    icon: "https://i.imgur.com/4NZ6uLY.jpg",
                    title: "Thanks For Ordering!",
                    text: "Your to will be shipped to you soon!",
                    timer: 2000,
                    buttons: false
                });
            });

            summary_button.addEventListener("click", () => this.handleOrderSummary());
            rate_button.addEventListener("click", () => this.handleRatings(toy));
            pay_button.addEventListener("click", () => this.handlePayment());
        }
    },
    handleOrder: function(uid, toy){
        //reading current user order details
        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => {
            var details = doc.data();

            if(details["current_orders"][toy.id]){
                //increasing value of current quantity
                details["current_orders"][toy.id]["quantity"] += 1;

                //calculating the subtotal of the item
                var currentQuantity = details["current_orders"][toy.id]["quantity"];

                details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price;
            }

            else{
                details["current_orders"][toy.id] = {
                    item: toy.toy_name,
                    price: toy.price,
                    quantity: 1,
                    subtotal: toy.price * 1
                };
            }

            details.total_bill += toy.price;

            //updating the database
            firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update(details);
        });
    },
    //function to get the toys collection from the firestore database
    getToys: async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data());
        });
    },
    getOrderSummary: async function(uid){
        return await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => doc.data()); //<-- all the data present in the userNumber doc
    },
    handleOrderSummary: async function(){
        //getting user number
        var uid;
        userNumber <= 9 ? (uid = `U0${userNumber}`) : `U${userNumber}}`

        //getting order summary from the database
        var orderSummary = await this.getOrderSummary(uid);

        //changing the display of the modal
        var modalDiv = document.getElementById("modal-div");
        modalDiv.style.display = "flex";

        //getting the table element
        var tableBodyTag = document.getElementById("bill-table-body");
        
        //removing the old table row to prevent the overwriting/duplication of the same text
        tableBodyTag.innerHTML = "";

        //getting the current_orders key
        var currentOrders = Object.keys(orderSummary.current_orders);

        currentOrders.map(i => {
            //creating a table row
            var tr = document.createElement("tr");

            //creating table cells/columns for item name, price, quantity, and subtotal
            var item = document.createElement("td");
            var price = document.createElement("td");
            var quantity = document.createElement("td");
            var subtotal = document.createElement("td");

            //adding HTML content
            item.innerHTML = orderSummary.currentOrders[i].item;

            price.innerHTML = "$" + orderSummary.current_orders[i].price;
            price.setAttribute("class", "text-center");

            quantity.innerHTML = orderSummary.current_orders[i].quantity;
            quantity.setAttribute("class", "text-center");

            subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
            subtotal.setAttribute("class", "text-center");

            //appending the cells to the row
            tr.appendChild(item);
            tr.appendChild(price);
            tr.appendChild(quantiry);
            tr.appendChild(subtotal);

            //appending the row to the table
            tableBodyTag.appendChild(tr);
        });

        //creating a table row for the total bill
        var totalTr = document.createElement("tr");

        //creating a empty cell (not for data)
        var td1 = document.createElement("td");
        td1.setAttribute("class", "no-line");

        //creating a empty cell (not for data)
        var td2 = document.createElement("td");
        td2.setAttribute("class", "no-line");

        //creating a cell for the TOTAL BILL (it makes the total bill appear on the far right)
        var td3 = document.createElement("td");
        td3.setAttribute("class", "no-line text-center");

        //creating a strong tag/element to emphasize the text
        var strongTag = document.createElement("strong");
        strongTag.innerHTML = "Total";

        td3.appendChild(strongTag);

        //creating a cell to show the total bill amount
        var td4 = document.createElement("td");
        td4.setAttribute("class", "no-line text-right");
        td4.innerHTML = "$" + orderSummary.total_bill;

        //appending the cells to the row
        totalTr.appendChild(td1);
        totalTr.appendChild(td2);
        totalTr.appendChild(td3);
        totalTr.appendChild(td4);

        //appending the row to the table
        tableBodyTag.appendChild(totalTr);
    },
    handlePayment: function(){
        //closing the modal
        document.getElementById("modal-div").style.display = "none";

        //getting user number
        var uid;
        userNumber <= 9 ? (uid = `U0${userNumber}`) : `U${userNumber}}`

        //resetting the current orders and total bill
        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
            current_orders: {},
            total_bill: 0
        })
        .then(() => {
            swal({
                icon: "success",
                title: "Thank You For Paying!",
                text: "We Hope You Enjoy Your Toy!",
                timer: 2500,
                buttons: false
            });
        });
    },
    handleRatings: async function(toy){
        //closing the modal
        document.getElementById("rating-modal-div").style.display = "flex";
        document.getElementById("rating-input").value = "0";
        document.getElementById("feedback-input").value = "";
        
        //submit button click event
        var saveRatingButton = document.getElementById("save-rating-button");
        saveRatingButton.addEventListener("click", () => {
            document.getElementById("rating-modal-div").style.display = "none";
            
            //getting the input value from the db (review and rating)
            var rating = document.getElementById("rating-input").value;
            var feedback = document.getElementById("feedback-input").value;

            //updating the db
            firebase
            .firestore()
            .collection("toys")
            .doc(toy.id)
            .update({
                last_rating: rating,
                last_review: feedback
            })
            .then(() => {
                swal({
                    icon: "success",
                    title: "Thanks For Rating!",
                    text: "We Hope You Enjoyed Your Toy!",
                    timer: 2500,
                    buttons: false
                });
            });
        });
    },
    handleMarkerLost: function(){
        //changing the button div visibility
        button_div = document.getElementById("button-div");
        button_div.style.display = "none";
    }
});