AFRAME.registerComponent("create-markers", {
    init: async function(){
        var mainScene = document.querySelector("#main-scene");

        var toys = await this.getToys();

        toys.map(toy => {
            //creating the marker element and adding it to the scene
            var marker = document.createElement("a-marker");
            marker.setAttribute("id", toy.id);
            marker.setAttribute("type", "pattern");
            marker.setAttribute("url", toy.marker_pattern_url);
            marker.setAttribute("cursor", {
                rayOrigin: "mouse"
            }); 
            marker.setAttribute("markerhandler", {});
            mainScene.appendChild(marker);

            if(!toys.is_out_of_stock){
                //adding the 3D toy model to the scene
                var model = document.createElement("a-entity");
                model.setAttribute("id", `model-${toy.id}`);
                model.setAttribute("position", toy.model_geometry.position);
                model.setAttribute("rotation", toy.model_geometry.rotation);
                model.setAttribute("scale", toy.model_geometry.scale);
                model.setAttribute("gltf-model", `url(${toy.model_url})`);
                model.setAttribute("gesture-handler", {});
                model.setAttribute("visible", false);
                marker.appendChild(model); //appending this into the marker because we only want to display when the marker is found!!

                //toy descripttion container
                var mainPlane = document.createElement("a-plane");
                mainPlane.setAttribute("id", `main-plane-${toy.id}`);
                mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
                mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
                mainPlane.setAttribute("width", 1.7);
                mainPlane.setAttribute("height", 1.5);
                mainPlane.setAttribute("visible", false);
                marker.appendChild(mainPlane);

                //toy name background plane
                var titlePlane = document.createElement("a-plane");
                titlePlane.setAttribute("id", `title-plane-${toy.id}`);
                titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
                titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                titlePlane.setAttribute("width", 1.69);
                titlePlane.setAttribute("height", 0.3);
                titlePlane.setAttribute("material", { color: "yellow" });
                mainPlane.appendChild(titlePlane);

                //toy name
                var toyName = document.createElement("a-entity");
                toyName.setAttribute("id", `toy-name-${toy.id}`);
                toyName.setAttribute("position", { x: 0, y: 0, z: 0.1 });
                toyName.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                toyName.setAttribute("text", {
                    font: "monoid",
                    color: "black",
                    width: 1.8,
                    height: 1,
                    align: "center",
                    value: toy.toy_name.toUpperCase()
                });
                titlePlane.appendChild(toyName);

                //toy description
                var toyDescription = document.createElement("a-entity");
                toyDescription.setAttribute("id", `toy-description-${toy.id}`);
                toyDescription.setAttribute("position", { x: 0, y: 0, z: 0.1 });
                toyDescription.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                toyDescription.setAttribute("text", {
                    font: "monoid",
                    color: "black",
                    width: 3,
                    align: "center",
                    value: `${toy.description.join("\n")}`
                });
                mainPlane.appendChild(toyDescription);

                //circle image to display price of the toy
                var pricePlane = document.createElement("a-image");
                pricePlane.setAttribute("id", `price-plane-${toy.id}`);
                pricePlane.setAttribute("src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png");
                pricePlane.setAttribute("width", 0.8);
                pricePlane.setAttribute("height", 0.8);
                pricePlane.setAttribute("position", { x: -1, y: 0.5, z: 0 });
                pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
                pricePlane.setAttribute("visible", false);
                
                //text for the price of the toy
                var priceText = document.createElement("a-entity");
                priceText.setAttribute("id", `price-${toy.id}`);
                priceText.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
                priceText.setAttribute("text", {
                    font: "mozillavr",
                    color: "white",
                    width: 3,
                    align: "center",
                    value: `${toy.price}`
                });

                pricePlane.appendChild(priceText);
                marker.appendChild(pricePlane);

                //toy rating plane
                var ratingPlane = document.createElement("a-entity");
                ratingPlane.setAttribute("id", `rating-plane-${toy.id}`);
                ratingPlane.setAttribute("position", { x: 2, y: 0, z: 0.5 });
                ratingPlane.setAttribute("geometry", {
                    primitive: "plane",
                    width: 1.5,
                    height: 0.3
                });
                ratingPlane.setAttribute("material", { color: "#f0c30f" });
                ratingPlane.setAttribute("visible", false);

                //ratings (shows the value from the last_rating in our db)
                var rating = document.createElement("a-entity");
                rating.setAttribute("id", `rating-${toy.id}`);
                rating.setAttribute("position", { x: 0, y: 0.05, z: 0.1 });
                rating.setAttribute("text", {
                    font: "mozillavr",
                    color: "black",
                    width: 2.4,
                    align: "center",
                    value: `Customer Rating: ${toy.last_rating}`
                });

                ratingPlane.appendChild(rating);
                marker.appendChild(ratingPlane);

                //toy review or feedback plane
                var reviewPlane = document.createElement("a-entity");
                reviewPlane.setAttribute("id", `review-plane-${toy.id}`);
                reviewPlane.setAttribute("position", { x: 2, y: 0, z: 0 });
                reviewPlane.setAttribute("geometry", {
                    primitive: "plane",
                    width: 1.5,
                    height: 0.5
                });
                reviewPlane.setAttribute("material", { color: "#f0c30f" });
                reviewPlane.setAttribute("visible", false);

                //toy review or feedback (displays the value from the last_review in db)
                var review = document.createElement("a-entity");
                review.setAttribute("id", `rating-${toy.id}`);
                review.setAttribute("position", { x: 0, y: 0.05, z: 0.1 });
                review.setAttribute("text", {
                    font: "mozillavr",
                    color: "black",
                    width: 2.4,
                    align: "center",
                    value: `Customer Review: \n ${toy.last_review}`
                });

                reviewPlane.appendChild(review);
                marker.appendChild(reviewPlane);
            }
        });
    },
    getToys: async function(){
        return await firebase
        .firestore()
        .collection("toys")
         .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data());
        });
    }
});