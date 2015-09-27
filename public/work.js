

function run () {


}

function transpose(array) {

  // make dimensions consistent
  for (var i=0; i<array.length; i++) {
    while (array[i].length<5) {
      array[i].push("");
    }
  }

  var newArray = array[0].map(function(col, i) {
  return array.map(function(row) {
    return row[i]
    })
  });
  return newArray;
}

function loadAllPeople () {}

function score (person, curDriver, period) {
  var point = 0;
  if (curDriver.goTime==person.goTime && curDriver.backTime==person.backTime) {
    // synergy boost
    point += 15;
  }

  if (person.location=="oc" && curDriver.hc == person.hc) {
    if (curDriver.hasOC()) point += 5;
    else point += 10;
  }

  if (period == 2) { //coming back from church
    if ($.inArray(person,curDriver.theirGoDrivees)!=-1) // same driver from first round
      point += 10;
  }

  if ((curDriver.location != "oc" && person.location != "oc") && curDriver.location == person.location) {
    point += 5;
  }

  if (curDriver.hc == person.hc) {
    point += 5;
  }

  point += (curDriver.spotsLeft)*7;
  return point;
}

function pickBestDriver (person, drivers, period) {
  // apply feasibility criteria for the specific person
  var sameLocDriver = [];
  var bestDriver = new Person();
  var maxpoint = -1;
  var point = 0;

  var available = drivers.filter(function(driver){return driver.spotsLeft > 0});

  console.log(available.length);
  console.log(drivers);
  console.log(person);

  $.each(available,function(index,curDriver){
    point = 0;

    if ((period==1 && curDriver.goTime==person.goTime) || (period==2 && curDriver.backTime==person.backTime)) {

      point += score(person, curDriver, period);

      if (point > maxpoint) {
        maxpoint = point;
        bestDriver = curDriver;
      }
    }
  });

  if (maxpoint == -1) {
    return new Person();
  } else
  return bestDriver;
}

function flex(person, fdrivers, period) {

  console.log("flexing");

  var point = 0;
  var maxpoint = 0;
  var bestDriver = new Person();
  $.each(fdrivers, function(index, fdriver){
    point += score(person,fdriver,period)
    if (point > maxpoint){
      maxpoint = point;
      bestDriver = fdriver;
    }
  });

  if (period==1){
    bestDriver.goTime = person.goTime;
    bestDriver.theirGoDrivees.push(person);
  }
  else {
    bestDriver.backTime = person.backTime;
    bestDriver.theirBackDrivees.push(person);
  }

  return bestDriver;

  ;

}

function formCar (driver) {
  var newCar = new Car();
  newCar.driver = driver;
  newCar.drivee

}

function mergeCars (driver1, driver2) {
  var score = 0;
  var threshold = 5;
  console.log(driver1);
  console.log(driver2);
  if (driver1.goTime==driver2.goTime && driver1.backTime==driver2.backTime) {
    if (driver1.theirGoDrivees.length + 1 + driver2.theirGoDrivees.length <= 5) {
      if (driver1.theirBackDrivees.length + 1 + driver2.theirBackDrivees.length <= 5) {
        driver2.theirGoDrivees = driver1.theirGoDrivees.concat(driver2.theirGoDrivees);
        driver2.theirGoDrivees.push(driver1);
        driver2.theirBackDrivees = driver1.theirBackDrivees.concat(driver2.theirBackDrivees);
        driver2.theirBackDrivees.push(driver1);
        driver1.isDriver = false;
        return driver2;
      }
    }
  }
  return driver1;
}

function trimGroup (group, period) {

  if (group.length==0) return group;

  group.sort(function(a,b){
    if (period==1) {
      akey = a.theirGoDrivees.length + 1;
      bkey = b.theirGoDrivees.length + 1;
    } else {
      akey = a.theirBackDrivees.length + 1;
      bkey = b.theirBackDrivees.length + 1;
    }
    if (akey<bkey) return -1;
    else if (akey==bkey) return 0;
    else return 1;
  });

  console.log(group);

  group.reduce(function(a,b){
    return mergeCars(a,b);
  });

  return group;

}


function putPeople (people) {
  // people is a list of people
  // this returns four groups of drivers with their respective passengers
  var drivers = [];
  var drivees = [];

  var fdrivees = [];
  var fdrivers = [];

  var marginal = [];

  var output = [];

  // divide people into drivers and drivees
  $.each(people, function(index, person){

    if (person.flexible){
      if (person.isDriver) fdrivers.push(person)
      else fdrivees.push(person);

    } else {
      if (person.isDriver) drivers.push(person)
      else drivees.push(person);
    }

  });

  console.log(drivers);

  // initialize drivers' spots
  $.each(drivers, function(index, driver){
    driver.theirGoDrivees = [];
    driver.theirBackDrivees = [];
  });

  // REMEMBER: 1 is "person goes to church" 2 is "person comes back from church"
  for (var i=1; i<=2; i++) {
    // put drivees into drivers
    $.each(drivers, function(index, driver){
      driver.spotsLeft = 4;
    });

    $.each(drivees, function(index, drivee) {
      var bestDriver = pickBestDriver(drivee, drivers, i);
      console.log(bestDriver);
      if (bestDriver.id==-1) {
         marginal.push(drivee);
      } else {
      if (i==1)
        bestDriver.theirGoDrivees.push(drivee);
      else
        bestDriver.theirBackDrivees.push(drivee);
        bestDriver.spotsLeft -= 1;
      }
    });

    $.each(fdrivees, function(index, drivee) {
      var bestDriver = pickBestDriver(drivee, drivers, i);
      console.log(bestDriver);
      if (bestDriver.id==-1) {
         marginal.push(drivee);
      } else {
      if (i==1)
        bestDriver.theirGoDrivees.push(drivee);
      else
        bestDriver.theirBackDrivees.push(drivee);
        bestDriver.spotsLeft -= 1;
      }
    });

  };


  var group1 = [];
  var group2 = [];
  var group3 = [];
  var group4 = [];

  $.each(drivers, function(index, driver){
    if (driver.goTime==1) {
    group1.push(driver)
    }
    if (driver.backTime==1) {
    group2.push(driver)
    }
    if (driver.goTime==2) {
    group3.push(driver)
    }
    if (driver.backTime==2) {
    group4.push(driver)
    }
  });

  console.log(group1);

  // left with go1 go2 back1 back2
  return {groups:[group1, group2, group3, group4], marginal:marginal};

}

var Person = function(){
  // default personality
  this.id = -1;
  this.name = "John Doe";
  this.date = "09/26/2015";
  this.isVisitor = false;
  this.isDriver = false;
  this.theirDriver = {};
  this.theirGoDrivees = [];
  this.theirBackDrivees = [];
  this.spotsLeft = 4;
  this.goTime = "1";
  this.backTime = "1";
  this.hc = "saigon";
  this.location = "south";
  this.etc = "";
  this.flexible = false;
  this.guest = {};
  this.host = {};

};

Person.prototype.theirDrivees = function() {
  return this.theirGoDrivees.concat(this.theirBackDrivees);
}

Person.prototype.hasOC = function() {
  $.each(this.theirDrivees(), function(index, drivee) {
    if (drivee.location=="oc") {
      return true;
    }
    return false;
  });
}

var Driver = function () {
  this.id = "";
  this.name = "";
  this.goTime = "";
  this.backTime = "";
  this.theirDrivees = [];
}



// person.prototype.setName(name) {
//   this.name = name;
// }
//
// person.prototype.getName(name) {
//   return this.name;
// }
//
// person.prototype.setDate(date) {
//   this.date = date;
// }
//
// person.prototype.getDate(date) {
//   return this.date;
// }
//
// person.prototype.visits(bool) {
//   this.isVisitor = bool;
// }
//
// person.prototype.isVisitor() {
//   return this.isVisitor;
// }
//
// person.prototype.drives(bool) {
//   this.isDriver = bool;
// }
//
// person.prototype.isDriver() {
//   return this.isDriver;
// }



function generatePeople (n) {

  var people = [];
  // n: number of randos
  for (var i=0; i<n; i++) {

    var person = new Person();
    person.id = i;

    var r = Math.random();
    if (r<=0.1) {
      person.isDriver = true;
    }

    r = Math.random();
    if (r<=0.1) {
      person.hc = "haishang";
    }

    if (0.1<r<=0.2) {
      person.hc = "palu";
    }
    people.push(person);
  }
  return people;

}

function excelize (data) {
  //accepts raw data, converts to excep-friendly form
  console.log("excelizing");
  var eArr = [];
  $.each(data.groups, function(index,g){
    $.each(g,function(d,driver){
      var dArr = [];
      if (index==0 || index==2){
        dArr = [driver.name + "(service: " + driver.goTime + ", going)"];
        $.each(driver.theirGoDrivees, function(p,passenger){
          dArr.push(passenger.name);
        });
      }

      if (index==1 || index==3) {
        dArr = [driver.name + "(service: " + driver.backTime + ", coming back)"];
        $.each(driver.theirBackDrivees, function(p,passenger){
          dArr.push(passenger.name);
        });
      }

      eArr.push(dArr);
    });
  });
  var mArr = ["No Driver"];
  $.each(data.marginal, function(index,person){
    mArr.push(person.name);
  });
  eArr.push(mArr);
  eArr = transpose(eArr);
  var eData = {arrs:eArr}

  console.log(eData);
  $.post("/excelize", eData, function(error,response){
    window.location.replace("/download");
  });
}
