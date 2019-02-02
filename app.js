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
    allCarTable: '.all__cars__table'
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
      // html = '<tr id="car-%slot%"> <td>%regNo%</td> <td>%color%</td> <td>%slotNo% <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button></td> </tr>'
      //
      // //Replace place-holder with actual dataStructure
      // newHtml = html.replace('%slot%', obj.allCars[0].carSlot);
      // newHtml = newHtml.replace('%regNo%',obj.allCars[0].carRegNo);
      // newHtml = newHtml.replace('%color%',obj.allCars[0].carColor);
      // newHtml = newHtml.replace('%slotNo%',obj.allCars[0].carSlot);
      //
      // //Insert the HTML into the DOM
      // document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    parkingController.autoFill(parseInt(input.totalParkingSlots), parseInt(input.totalAutofillSlots));

    // 3. add the cars list to the UI
    UICtrl.displayAllCar(parkingController.dataStructure());

  };

  return {
    init: function() {
      console.log('Application has started.');
      setEventListeners();
    }
  }
})(parkingController, UIController);

controller.init();
