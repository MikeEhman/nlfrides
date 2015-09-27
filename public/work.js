

function run () {}

function loadAllPeople () {}


function pickBestDriver (person, drivers) {
  // apply feasibility criteria for the specific person


  var sameLocDriver = [];
  var bestDriver = {};
  var maxpoint = 0;
  var point = 0;
  $.each(drivers,function(curDriver){
    point = 0;

    if (curDriver.location == person.location) {
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

  });

  return bestDriver;
}

function putPeople (people) {
  // people is a list of people
  var drivers = [];
  var drivees = [];

  // divide people into drivers and drivees
  $.each(people, function(person){
    if (person.isDriver) drivers.add(person)
    else drivees.add(person);
  });

  // pur drivees into drivers
  $.each(drivees, function(drivee) {
    var bestDriver = pickBestDriver(drivee, drivers);
    drivee.theirDriver = bestDriver;
    bestDriver.theirDrivees.add(drivee);

    // adjust spots left
    bestDriver.spotsLeft -= 1;
    if (bestDriver.spotsLeft<=0) {
      drivers.remove(bestDriver);
    }


  });




}

var person = function(){
  // default personality
  this.id = -1;
  this.name = "John Doe";
  this.date = "09/26/2015";
  this.isVisitor = false;
  this.isDriver = false;
  this.theirDriver = {};
  this.theirDrivees = [this];
  this.spotsLeft = 4;
  this.service = "3";
  this.hc = "saigon";
  this.location = "south";
  this.etc = "asdfghjkqweryuio";
};

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
      person.hc = "haisheng";
    }

    if (0.1<r<=0.2) {
      person.hc = "palu";
    }
    people.add(person);
  }
  return people;


}
