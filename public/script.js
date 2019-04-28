
function initialize() {
    firebase.initializeApp(config);
    listDonors();
}

function listDonors() {
    // Remove any donors currently being listed
    $("#donor-list").empty();
    // Create a reference to the firestore system
    var db = firebase.firestore();

    // If the option is set to any then we want to show all donors
    if($("#filter option:selected").val() == "any") {
        db.collection("donors").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var donor = doc.data().firstName + " " + doc.data().lastName + ": ";
            for(var i = 0; i < doc.data().types.length; i++) {
                donor += doc.data().types[i] + ", ";
            }
            donor += "<hr>"
            $("#donor-list").append(donor);
          });
        });
    // Otherwise we only want to show the donors who match the filter criteria
    } else {
        db.collection("donors").where("types","array-contains",$("#filter option:selected").val()).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var donor = doc.data().firstName + " " + doc.data().lastName + ": ";
            for(var i = 0; i < doc.data().types.length; i++) {
                donor += doc.data().types[i] + ", ";
            }
            donor += "<hr>"
            $("#donor-list").append(donor);
          });
        });
    }
}

function addDonor() {
    // Create a reference to the firestore system
    var donordb = firebase.firestore();
    
    // Create an array of all the donor types they have checked
    var donor_types = []
    if($("#kidneyField").is(":checked")) {
        donor_types.push("kidney");
    }
    if($("#liverField").is(":checked")) {
        donor_types.push("liver");
    }
    if($("#spleenField").is(":checked")) {
        donor_types.push("spleen");
    }

    // Add the user to the "donors" collection with the proper values
    donordb.collection("donors").add({
        firstName: $("#firstNameField").val(),
        lastName: $("#lastNameField").val(),
        location: new firebase.firestore.GeoPoint(parseFloat($("#latField").val()), parseFloat($("#longField").val())),
        types: donor_types
    });

    // Since there is a new donor in the system, refresh the list
    listDonors();
}
