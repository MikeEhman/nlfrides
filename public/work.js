

function run () {


}

function loadAllPeople () {}

function score (person, curDriver, period) {
  var point = 0;
  if (curDriver.goTime==person.goTime && curDriver.backTime==person.backTime) {
    // synergy boost
    point += 5;
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
    point += 2;
  }

  point += (curDriver.spotsLeft+4);
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
        bestDriver = flex(drivee, fdrivers, i);
      }
      if (bestDriver.id!=-1){
        if (i==1)
          bestDriver.theirGoDrivees.push(drivee);
        else
          bestDriver.theirBackDrivees.push(drivee);
          bestDriver.spotsLeft -= 1;
      } else marginal.push(drivee);

    });

  };

  // lonely driver solution
  var flag = false;
  $.each(drivers, function(index, driver){
    // if (driver.theirDrivees().length==0)
    //   driver.isDriver = false;
    //   flag = true;
  });

  if (flag) return putPeople(people);

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
