

function run () {


}

function loadAllPeople () {}


function pickBestDriver (person, drivers, period) {
  // apply feasibility criteria for the specific person
  var sameLocDriver = [];
  var bestDriver = {};
  var maxpoint = 0;
  var point = 0;

  $.each(drivers,function(index,curDriver){
    point = 0;

    if ((period==1 && curDriver.goTime==person.goTime) || (period==2 && curDriver.backTime==person.backTime)) {

      if (person.location=="oc" && curDriver.hc == person.hc) {
        if (curDriver.hasOC()) point += 5;
        else point += 10;
      }



      if ((curDriver.location != "oc" && person.location != "oc") && curDriver.location == person.location) {
        point += 5;
      }

      if (curDriver.hc == person.hc) {
        point += 2;
      }

      point += (curDriver.spotsLeft+4);

      if (point > maxpoint) {
        maxpoint = point;
        bestDriver = curDriver;
      }
    }

  });

  return bestDriver;
}

function putPeople (people) {
  // people is a list of people
  // this returns four groups of drivers with their respective passengers
  var drivers = [];
  var drivees = [];

  var output = [];

  // divide people into drivers and drivees
  $.each(people, function(index, person){
    if (person.isDriver) drivers.push(person)
    else drivees.push(person);
  });

  for (var i=1; i<=2; i++) {
    // pur drivees into drivers
    $.each(drivers, function(index, driver){
      driver.spotsLeft = 4;
      driver.theirDrivees = [];
    });


    $.each(drivees, function(index, drivee) {
      var bestDriver = pickBestDriver(drivee, drivers, i);
      drivee.theirDriver = bestDriver;
      bestDriver.theirDrivees.push(drivee);

      // adjust spots left
      bestDriver.spotsLeft -= 1;
      if (bestDriver.spotsLeft<=0) {
        drivers.remove(bestDriver);
      }
    });
    var group1 = [];
    var group2 = [];
    $.each(drivers, function(index, driver){
      if (driver.goTime==1) {
        group1.push(driver);
      } else {
        group2.push(driver);
      }

    });
    output.push(group1);
    output.push(group2);

  };

  // left with go1 go2 back1 back2
  return output;



}

var Person = function(){
  // default personality
  this.id = -1;
  this.name = "John Doe";
  this.date = "09/26/2015";
  this.isVisitor = false;
  this.isDriver = false;
  this.theirDriver = {};
  this.theirDrivees = [this];
  this.spotsLeft = 4;
  this.goTime = "1";
  this.backTime = "1";
  this.hc = "saigon";
  this.location = "south";
  this.etc = "asdfghjkqweryuio";

  this.guest = {};
  this.host = {};

};

Person.prototype.hasOC = function() {
  $.each(this.theirDrivees, function(index, drivee) {
    if (drivee.location=="oc") {
      return true;
    }
    return false;
  });
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
