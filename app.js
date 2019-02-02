//Parking Controller
var parkingController = (function() {

  var CarDetails = function(carId, carRegNo, carColor, carSlot) {
      this.carId = carId,
      this.carRegNo = carRegNo,
      this.carColor = carColor,
      this.carSlot = carSlot
  };

  var data = {
    allCars: []
  };



  return {
    autoGenerateCarDetails: function() {

    }
  }
})();


//UI controller
var UIController = (function() {

  var DOMStrings = {
    inputSlots: '.total__slot',
    inputAutofillSlots: '.total__autofill',
    buttonFreeze: '.freeze__btn'
  };

  return {
    getInput: function() {

      return {
        totalParkingSlots: document.querySelector(DOMStrings.inputSlots).value,
        totalAutofillSlots: document.querySelector(DOMStrings.inputAutofillSlots).value

      }
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  }

})();




//Global App Controller
var controller = (function(parkingCtrl, UICtrl) {

  var setEventListeners = function() {

    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.buttonFreeze).addEventListener('click', ctrlAddCar);

    // document.addEventListener('keypress', function(event) {
    //
    //   if(event.keyCode === 13 || event.which === 13 )
    //     ctrlAddCar();
    //
    // });

  };

  var ctrlAddCar = function() {

    //console.log('pressed');
    // 1. get the field input data
    var input = UICtrl.getInput();
    console.log(input.totalParkingSlots, input.totalAutofillSlots);

    // 2. add auto-generate m car details to parking controller

    // 3. add the cars list to the UI

  };

  return {
    init: function() {
      console.log('Application has started.');
      setEventListeners();
    }
  }
})(parkingController, UIController);

controller.init();
