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

  // Empty form values:
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");

  // Mathmatical calculations:

  //Push to Firebase:
  database.ref().push({

    Train: trainName,
    Destination: destination,
    FirstTrain: firstTrainTime,
    Frequency: frequency,
    NextArrival: nextArr,
    MinutesAway: minAway
  });
});

// Firebase listener:
database.ref().on("child_added", function (childSnapshot) {

  // Log snapshots:
  console.log(childSnapshot.val());
  console.log(childSnapshot.val().Train);
  console.log(childSnapshot.val().Destination);
  console.log(childSnapshot.val().FirstTrain);
  console.log(childSnapshot.val().Frequency);

  // Post data to DOM:
  $('#train-name-target').append(childSnapshot.val().Train);
  $('#destination-target').append(childSnapshot.val().Destination);
  $('#first-train-target').append(childSnapshot.val().FirstTrain);
  $('#frequency-target').append(childSnapshot.val().Frequency);
  $('#next-arrival-target').append(childSnapshot.val().NextArrival);
  $('#minutes-arrival-target').append(childSnapshot.val().MinutesAway);

  //If errors occur:
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});