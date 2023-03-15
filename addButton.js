AFRAME.registerComponent("create-button", {
    init: function(){
        //creating the order summary button
        var button1 = document.createElement("button");
        button1.innerHTML = "ORDER SUMMARY";
        button1.setAttribute("id", "summary-button");
        button1.setAttribute("class", "btn btn-danger");

        //creating the rate button
        var button2 = document.createElement("button");
        button2.innerHTML = "RATE US";
        button2.setAttribute("id", "rate-button");
        button2.setAttribute("class", "btn btn-danger");

        //creating the order button
        var button3 = document.createElement("button");
        button3.innerHTML = "ORDER NOW";
        button3.setAttribute("id", "order-button");
        button3.setAttribute("class", "btn btn-danger");

        //appending both buttons to the buttonDiv
        button_div = document.getElementById("button-div");
        button_div.appendChild(button1);
        button_div.appendChild(button2);
        button_div.appendChild(button3)
    }
});