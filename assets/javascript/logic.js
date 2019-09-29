// Config key:
var firebaseConfig = {
  apiKey: "AIzaSyCGpN3WVXZki6csqb5r623irkpchpGjs2w",
  authDomain: "train-time-bf7b5.firebaseapp.com",
  databaseURL: "https://train-time-bf7b5.firebaseio.com",
  projectId: "train-time-bf7b5",
  storageBucket: "",
  messagingSenderId: "1025189797521",
  appId: "1:1025189797521:web:6203b58d192e1742ed6930"
};
// Initialize Firebase:
firebase.initializeApp(firebaseConfig);

// Globally scoped variables:
let database = firebase.database();
let now = moment();
// Initiall values:
let trainName = "";
let destination = "";
let firstTrainTime = "";
let frequency = 0;
let nextArr = "";
let minAway = 0;

// Button click listener:
$("#submit-btn").on("click", function (event) {
  event.preventDefault();

  //Get values from input form: 
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#first-train-time").val().trim();
  frequency = $("#frequency").val().trim();

  // Mathmatical calculations:
  
  
  // compare first train time to now in 24 hour time
  // is new train time > or < now
  // if new train time is > now, next arrival = difference of two
  // if new train time is < now, what is the %(frequency) of the difference?
  // next arrival would = % + frequency


  //Push to Firebase:
  database.ref().push({

    Train: trainName,
    Destination: destination,
    FirstTrain: firstTrainTime,
    Frequency: frequency,
    // NextArrival: nextArr,
    // MinutesAway: minAway
  });

  // Empty form values:
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("cd");
});

// Firebase listener:
database.ref().on("child_added", function (childSnapshot) {

  // Log snapshots:
  console.log(childSnapshot.val());
  console.log(childSnapshot.val().Train);
  console.log(childSnapshot.val().Destination);
  console.log(childSnapshot.val().FirstTrain);
  console.log(childSnapshot.val().Frequency);

  // Calculations using moment.js for "next arrival" and "minutes away"
  let timeArr = childSnapshot.val().FirstTrain.split(":");
  console.log(timeArr);
  let trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  console.log(trainTime);
  let maxMoment = moment.max(moment(),trainTime);
  console.log(maxMoment);
  let tMin;
  let tArrival;

  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMin = trainTime.diff(moment(), "minutes");
  } else {
    let difTime = moment().diff(trainTime, "minutes");
    let tRemain = difTime % childSnapshot.val().Frequency;
    tMin = childSnapshot.val().Frequency - tRemain;
    tArrival = moment().add(tMin, "m").format("hh:mm A");
  }
  console.log(tArrival);
  console.log(tMin);
  
  // Post data to DOM:
  let newRow = $("<tr>").append(
    $("<td>").text(childSnapshot.val().Train),
    $("<td>").text(childSnapshot.val().Destination),
    $("<td>").text(childSnapshot.val().FirstTrain),
    $("<td>").text(childSnapshot.val().Frequency),
    $("<td>").text(tArrival),
    $("<td>").text(tMin)
  // $('#train-name-target').append(childSnapshot.val().Train);
  // $('#destination-target').append(childSnapshot.val().Destination);
  // $('#first-train-target').append(childSnapshot.val().FirstTrain);
  // $('#frequency-target').append(childSnapshot.val().Frequency);
  // $('#next-arrival-target').append(childSnapshot.val().NextArrival);
  // $('#minutes-arrival-target').append(childSnapshot.val().MinutesAway);
  );

  // Append the new row to the table
  $("#my-table > tbody").append(newRow);

  //If errors occur:
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});