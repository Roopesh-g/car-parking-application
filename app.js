//Parking Controller
var data = {
  allCars: [],
  checkSlot: []
};
var parkingController = (function() {

  var CarDetails = function(carId, carRegNo, carColor, carSlot) {
      this.carId = carId,
      this.carRegNo = carRegNo,
      this.carColor = carColor,
      this.carSlot = carSlot
  };

  // var data = {
  //   allCars: [],
  //   checkSlot: []
  // };

  function random(len, chars){
    var str = '';
  	for(let i=1; i <= len; i++){
  		str += chars[Math.floor(Math.random() * chars.length)];
  	}
	   return str;
  };

  var generateCarDetails = function(totalCar,totalAutofillCar) {
    console.log('inside generateCarDetails' + totalCar + totalAutofillCar);
    /*
    check slot array will be used to check the availability of Slots
    -1: unoccupied
    1: occupied
    */

    data.checkSlot = Array(totalCar + 1).fill(-1);
    data.checkSlot[0] = 'X';

    for(let i = 1; i <= totalAutofillCar; i++){

      var regNo = '', color = '', slot = -1, result ='';
    	result = random(2,'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  		regNo += result + '-';
  		result = random(2,'0123456789')
  		regNo += result + '-';
  		result = random(2,'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  		regNo += result + '-';
  		result = random(4,'0123456789');
  		regNo += result;
		  console.log(regNo);

      color = random(1,['Black', 'White', 'Blue', 'Red']);
		  console.log(color);

      let flag = true;
      while(flag) {
        slot = Math.floor(Math.random() * totalCar) + 1;
        if(data.checkSlot[slot] === -1){
          flag = false;
          data.checkSlot[slot] = 1;
        }
      }
      console.log(slot);

      data.allCars.push(new CarDetails(1, regNo, color, slot));

    }
  };


  return {
    autoFill: function(n,m) {
      //console.log('inside generateCarDetails' + n + m);
      generateCarDetails(n,m);
    },

    addSingleCarDetails: function(car_reg_no, car_color) {

      var newItem, slot = -1;
      for(var i = 1; i <= data.checkSlot.length; i++){
        if(data.checkSlot[i] === -1){
          slot = i;
          data.checkSlot[i] = 1;
          newItem = new CarDetails(1, car_reg_no, car_color, slot);
          data.allCars.push(newItem);
          break;
        }
        // else if (i === data.checkSlot.length){
        //   alert('We regret, parking is not available at moment');
        // }
      }

      return newItem;
    },

    deleteCar: function(carSlotToDelete) {
      console.log(carSlotToDelete);
      var index;
      for(index = 0; index < data.allCars.length; index++) {
        if(data.allCars[index].carSlot === carSlotToDelete){
          //console.log(index);
          console.log(data.allCars.splice(index,1));
          data.checkSlot[carSlotToDelete] = -1;
          break;
        }
      }
    },

    dataStructure: function() {
      return data;
    }

  }
})();


//UI controller
var UIController = (function() {

  var DOMStrings = {
    inputSlots: '.total__slot',
    inputAutofillSlots: '.total__autofill',
    buttonFreeze: '.freeze__btn',
    allCarTable: '.all__cars__table',
    addCarBtn: '.add__btn',
    carRegNoTA: '.car__registration',
    carColorTA: '.car__color',
    container: '.container',

  };

  return {
    getInitialInput: function() {

      return {
        totalParkingSlots: document.querySelector(DOMStrings.inputSlots).value,
        totalAutofillSlots: document.querySelector(DOMStrings.inputAutofillSlots).value

      }
    },

    getSingleCarInput: function() {

      return {
        carRegisNo_TA: document.querySelector(DOMStrings.carRegNoTA).value,
        carColor_TA: document.querySelector(DOMStrings.carColorTA).value

      }
    },

    getDOMStrings: function() {
      return DOMStrings;
    },

    displayAllCar: function(obj) {

      //console.log(obj);
      var html, newHtml, element;
      //HTML string with place-holder
      element = DOMStrings.allCarTable;
      for(var i = 0; i < obj.allCars.length; i++){
        html = '<tr id="car-%slot%"> <td>%regNo%</td> <td>%color%</td> <td>%slotNo% <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></td> </tr>'

        //Replace place-holder with actual dataStructure
        newHtml = html.replace('%slot%', obj.allCars[i].carSlot);
        newHtml = newHtml.replace('%regNo%',obj.allCars[i].carRegNo);
        newHtml = newHtml.replace('%color%',obj.allCars[i].carColor);
        newHtml = newHtml.replace('%slotNo%',obj.allCars[i].carSlot);

        //Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      }
    },

    displaySingleCar: function(obj) {
      var html, newHtml, element;
      //HTML string with place-holder
      element = DOMStrings.allCarTable;
      html = '<tr id="car-%slot%"> <td>%regNo%</td> <td>%color%</td> <td>%slotNo% <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></td> </tr>'

      //Replace place-holder with actual dataStructure
      newHtml = html.replace('%slot%', obj.carSlot);
      newHtml = newHtml.replace('%regNo%',obj.carRegNo);
      newHtml = newHtml.replace('%color%',obj.carColor);
      newHtml = newHtml.replace('%slotNo%',obj.carSlot);

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteCarUI: function(selectorID) {
      document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
    },

    initialState: function() {

      /*
      shift focus to 1st <input> area
      disable all the unnecessary <input> and <button>
      */
      document.querySelector(DOMStrings.inputSlots).focus();
      document.querySelector(DOMStrings.addCarBtn).disabled = true;
      document.querySelector(DOMStrings.carRegNoTA).disabled = true;
      document.querySelector(DOMStrings.carColorTA).disabled = true;

    },

    freezeNM: function() {

      /*
      after acepting the no. of slots and to be auto-filled slots freeze
      the area so user it couldnt be changed in future.
      */
      document.querySelector(DOMStrings.inputSlots).disabled = true;
      document.querySelector(DOMStrings.inputAutofillSlots).disabled = true;
      //alert('hello');
      document.querySelector(DOMStrings.buttonFreeze).disabled = true;
      //alert('hello');
      /*
      allow user to manually input car details
      */
      document.querySelector(DOMStrings.carRegNoTA).disabled = false;
      document.querySelector(DOMStrings.carRegNoTA).focus();
      document.querySelector(DOMStrings.carColorTA).disabled = false;
      document.querySelector(DOMStrings.addCarBtn).disabled = false;
    }
  }

})();




//Global App Controller
var controller = (function(parkingCtrl, UICtrl) {

  var setEventListeners = function() {

    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.buttonFreeze).addEventListener('click', ctrlAddCarAuto);

    // document.addEventListener('keypress', function(event) {
    //
    //   if(event.keyCode === 13 || event.which === 13 )
    //     ctrlAddCarAuto();
    //
    // });

    document.querySelector(DOM.addCarBtn).addEventListener('click', ctrlAddCarSingle);

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteCar);
  };

  var ctrlAddCarAuto = function() {

    //console.log('pressed');
    // 1. get the field input data
    var input = UICtrl.getInitialInput();
    //console.log(input.totalParkingSlots, input.totalAutofillSlots);

    // 2. add auto-generate m car details to parking controller
    parkingController.autoFill(parseInt(input.totalParkingSlots), parseInt(input.totalAutofillSlots));

    // 3. add the cars list to the UI
    UICtrl.displayAllCar(parkingController.dataStructure());

    // 4. freeze the input and button
    UICtrl.freezeNM();

  };

  var ctrlAddCarSingle = function() {

    //1. get the field input data
    var singleCarInput = UICtrl.getSingleCarInput();
    //console.log('single car ' + singleCarInput.carRegisNo_TA + singleCarInput.carColor_TA);

    //2. add new car details to parking Controller
    var newCar = parkingController.addSingleCarDetails(singleCarInput.carRegisNo_TA, singleCarInput.carColor_TA);
    //console.log(newCar);
    UICtrl.displaySingleCar(newCar);

  };

  var ctrlDeleteCar = function(event) {
    var carID, splitID, slot;
    carID = (event.target.parentNode.parentNode.parentNode.id);
    if(carID) {
      splitID = carID.split('-');
      slot = splitID[1];

      // 1. delete car detail from DS
      parkingController.deleteCar(parseInt(slot));
      // 2. delete from UI
      UICtrl.deleteCarUI(carID);
    }
  };

  return {
    init: function() {
      console.log('Application has started.');
      UICtrl.initialState();
      setEventListeners();
    }
  }
})(parkingController, UIController);

controller.init();
