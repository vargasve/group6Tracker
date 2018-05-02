// Initialize Firebase
var config = {
    apiKey: "AIzaSyAdrPo3BBA1SZFpXeEmasw_Ml2dPKJevHg",
    authDomain: "employeedata-b6f55.firebaseapp.com",
    databaseURL: "https://employeedata-b6f55.firebaseio.com",
    projectId: "employeedata-b6f55",
    storageBucket: "employeedata-b6f55.appspot.com",
    messagingSenderId: "454826337302"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial variables

var employeeName = "";
var employeeRole = "";
var employeeStartDate = 0;
var employeeMonthlyRate = 0;

// -----------------------------

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {

});

// --------------------------------------------------------------

// Form Stuff: Click event

$("#submit").on("click", function (event) {
    event.preventDefault();

    // Text input variables
    var employeeName = $("#employee-name").val().trim();
    var employeeRole = $("#employee-role").val().trim();
    var employeeStartDate = $("#employee-startdate").val().trim();
    var employeeMonthlyRate = $("#employee-monthlyrate").val().trim();

    database.ref("/employeeData").push({
        employeeName: employeeName,
        employeeRole: employeeRole,
        employeeStartDate: employeeStartDate,
        employeeMonthlyRate: employeeMonthlyRate,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Clear form
$("#submit").on("click", function (event) {
    $("#employee-form")[0].reset();
});


database.ref("/employeeData").on("value", function (snapshot) {
    // ------------------------------------
    $("#employee-info").empty();
    snapshot.forEach(function (childSnapshot) {
        //check for valid child
        if (!childSnapshot.child("employeeName").exists()) {
            return;
        }
        var employeeName = childSnapshot.val().employeeName;
        var employeeRole = childSnapshot.val().employeeRole;
        var employeeStartDate = childSnapshot.val().employeeStartDate;
        var employeeMonthlyRate = childSnapshot.val().employeeMonthlyRate;

        console.log(employeeStartDate);

        var startDate = new Date(employeeStartDate);
        var currentDate = new Date();

        console.log(currentDate);
        var employeeMonthsWorked = Math.floor(moment(startDate).diff(moment(currentDate), 'months', true) * -1);
        console.log("employeeMonthsWorked:  " + employeeMonthsWorked);

        var employeeBilled = employeeMonthsWorked * employeeMonthlyRate;
        if (employeeMonthsWorked < 0 || employeeMonthlyRate === "") {
            employeeMonthsWorked = "N/A";
            employeeBilled = "N/A";
            employeeMonthlyRate = "N/A";
        } else if (employeeMonthsWorked > 0) {
            employeeMonthsWorked = employeeMonthsWorked;
            employeeBilled = "$" + employeeBilled;
            employeeMonthlyRate = "$" + employeeMonthlyRate;
        }


        console.log("employeeBilled:  " + employeeBilled);
        // Show form stuff
        var newRow = $("<tr>");
        var employeeNameDisplay = $("<td>").text(employeeName);
        var employeeRoleDisplay = $("<td>").text(employeeRole);
        var employeeStartDateDisplay = $("<td>").text(employeeStartDate);
        var employeeMonthsWorkedDisplay = $("<td>").text(employeeMonthsWorked)
        var employeeMonthlyRateDisplay = $("<td>").text(employeeMonthlyRate);
        var employeeBilledDisplay = $("<td>").text(employeeBilled);
        newRow.append(employeeNameDisplay, employeeRoleDisplay, employeeStartDateDisplay, employeeMonthsWorkedDisplay, employeeMonthlyRateDisplay, employeeBilledDisplay);
        $("#employee-info").append(newRow);
    });
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
