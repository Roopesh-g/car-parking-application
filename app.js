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
    searchBtn: '.search__btn',
    searchType: '.search__type',
    searchValue: '.search__value',
    carTable: '.all__cars__table',
    allCarButton: '.search__all__car'

  };

  var valid = function(x, y) {
    if(x >= y)
      return true;
    else
      return false;
  };

  var regEx = function(str, patt) {
    //let patt = /(^[A-Z]{2}[\-][0-9]{2}[\-][A-Z]{2}[\-][0-9]{4}$)/g;
    patt.compile(patt);
    let res = patt.test(str);
    if(patt.toString().includes("Black") && res === false){
      alert("Invalid car color; Accepted are: Black, White, Red, Blue");
      return res;
    }
    else if(res === false){
      alert('Car Registration No. is invalid. Accepted format is: XX-00-XX-0000');
      return res;
    }
    else {
      return res;
    }

  };

  return {
    getInitialInput: function() {
      let x, y, status;
      x = document.querySelector(DOMStrings.inputSlots).value;
      y = document.querySelector(DOMStrings.inputAutofillSlots).value;

      //verify the inputs N >= M
      status = valid(x, y);
      if(status){
        return {
          totalParkingSlots: x,
          totalAutofillSlots: y,
          verified: true
        }
      }
      else {
        alert('No worries I\'ve got your back, \nauto-fill parking cannot be greater than total parking slots' );
        return {
          verified: false
        }
      }

    },

    getSingleCarInput: function() {
      var x, y, statusOfRegNo, statusOfColor;
      x = document.querySelector(DOMStrings.carRegNoTA).value;
      y = document.querySelector(DOMStrings.carColorTA).value;
      statusOfRegNo = regEx(x, /(^[A-Z]{2}[\-][0-9]{2}[\-][A-Z]{2}[\-][0-9]{4}$)/g);
      statusOfColor = regEx(y, /^(Black)$|^(White)$|^(Blue)$|^(Red)$/g)
      if(statusOfRegNo && statusOfColor) {
        return {
          carRegisNo_TA: x,
          carColor_TA: y,
          verified: true

        }
      }
      else {
        return {
          verified: false
        }
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

    clearTableUI: function() {
      var tableHeaderRowCount = 1;
      var table = document.querySelector(DOMStrings.carTable);
      var rowCount = table.rows.length;
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
      }
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
    },

    getCarData: function() {
      return {
        searchType: document.querySelector(DOMStrings.searchType).value,
        searchValue: document.querySelector(DOMStrings.searchValue).value
      }
    },

    searchResultDisplay: function(dataObj, searchObj) {
      var html, newHtml, element;
      element = DOMStrings.allCarTable;

      if(searchObj.searchType === 'carColor'){
        //var html, newHtml, element;
        //HTML string with place-holder
        for(var i = 0; i < dataObj.allCars.length; i++){

          if(dataObj.allCars[i].carColor === searchObj.searchValue){
            html = '<tr id="car-%slot%"> <td>%regNo%</td> <td>%color%</td> <td>%slotNo%</td> </tr>'

            //Replace place-holder with actual dataStructure
            newHtml = html.replace('%slot%', dataObj.allCars[i].carSlot);
            newHtml = newHtml.replace('%regNo%',dataObj.allCars[i].carRegNo);
            newHtml = newHtml.replace('%color%',dataObj.allCars[i].carColor);
            newHtml = newHtml.replace('%slotNo%',dataObj.allCars[i].carSlot);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          }

        }
      }
      else if(searchObj.searchType === 'carRegNo') {
        for(var i = 0; i < dataObj.allCars.length; i++){

          if(dataObj.allCars[i].carRegNo === searchObj.searchValue){
            html = '<tr id="car-%slot%"> <td>%regNo%</td> <td>%color%</td> <td>%slotNo%</td> </tr>'

            //Replace place-holder with actual dataStructure
            newHtml = html.replace('%slot%', dataObj.allCars[i].carSlot);
            newHtml = newHtml.replace('%regNo%',dataObj.allCars[i].carRegNo);
            newHtml = newHtml.replace('%color%',dataObj.allCars[i].carColor);
            newHtml = newHtml.replace('%slotNo%',dataObj.allCars[i].carSlot);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          }

        }
      }
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

    document.querySelector(DOM.searchBtn).addEventListener('click', ctrlSearch);

    document.querySelector(DOM.allCarButton).addEventListener('click', ctrlDisplayAllcar);
  };

  var ctrlDisplayAllcar = function() {

    //1. Clear table form UI
    UICtrl.clearTableUI();

    //2. display all parked cars
    UICtrl.displayAllCar(parkingController.dataStructure());

  }

  var ctrlSearch = function() {
    //alert('searched btn');

    //1. get the field input for search opr
    var searchInput = UICtrl.getCarData();
    //console.log(searchInput.searchType, searchInput.searchValue);

    //2. clear table from UI
    UICtrl.clearTableUI();

    //2. display all parked cars

    //3. update the UI based on user inputs
    UICtrl.searchResultDisplay(parkingController.dataStructure(), searchInput);
  }

  var ctrlAddCarAuto = function() {

    //console.log('pressed');
    // 1. get the field input data
    var input = UICtrl.getInitialInput();
    //console.log(input.totalParkingSlots, input.totalAutofillSlots);

    // 2. verify the input
    if(input.verified === true){

      // 3. add auto-generate m car details to parking controller
      parkingController.autoFill(parseInt(input.totalParkingSlots), parseInt(input.totalAutofillSlots));

      // 4. add the cars list to the UI
      UICtrl.displayAllCar(parkingController.dataStructure());

      // 5. freeze the input and button
      UICtrl.freezeNM();
    }

  };

  var ctrlAddCarSingle = function() {

    //1. get the field input data
    var singleCarInput = UICtrl.getSingleCarInput();
    //console.log('single car ' + singleCarInput.carRegisNo_TA + singleCarInput.carColor_TA);

    //Verify the inputs
    if(singleCarInput.verified){

      //2. add new car details to parking Controller
      var newCar = parkingController.addSingleCarDetails(singleCarInput.carRegisNo_TA, singleCarInput.carColor_TA);
      //console.log(newCar);
      UICtrl.displaySingleCar(newCar);
    }

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
