QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("Driver-Drivee Feability Test", function(assert) {
  var people = [];

  var willie = new Person();
  willie.id = 0;
  willie.name = "Willie Lo";
  willie.isVisitor = false;
  willie.isDriver = true;
  willie.location = "south";
  willie.hc = "saigon";
  willie.goTime = 1;
  willie.backTime = 1;

  people.push(willie);

  var tony = new Person();
  tony.id = 1;
  tony.name = "Tony Zhao";
  tony.isVisitor = false;
  tony.isDriver = true;
  tony.location = "south";
  tony.hc = "palu";
  tony.goTime = 1;
  tony.backTime = 1;

  people.push(tony);

  assert.ok(willie!=tony);
  assert.ok(people.length==2);

  var nam = new Person();
  nam.id = 2;
  nam.name = "Nam Hee Gordon Kim";
  nam.isVisitor = false;
  nam.isDriver = false;
  nam.location = "south";
  nam.hc = "saigon";
  nam.goTime = 1;
  nam.backTime = 1;

  people.push(nam);

  var driverForNam = pickBestDriver(nam,[willie,tony],1);
  console.log(driverForNam);

  assert.ok(driverForNam==willie, driverForNam.name + " drives " + nam.name);

  var sun = new Person();
  sun.id = 3;
  sun.name = "Sun Ji";
  sun.isVisitor = false;
  sun.isDriver = false;
  sun.location = "south";
  sun.hc = "saigon";
  sun.goTime = 2;
  sun.backTime = 2;

  people.push(sun);

  var david = new Person();
  david.id = 4;
  david.name = "David Yun";
  david.isVisitor = false;
  david.isDriver = true;
  david.location = "oc";
  david.hc = "saigon";
  david.goTime = 1;
  david.backTime = 2;

  people.push(david);

  var eric = new Person();
  eric.id = 5;
  eric.name = "Eric Lee";
  eric.isVisitor = false;
  eric.isDriver = false;
  eric.location = "north";
  eric.hc = "haishang";
  eric.goTime = 2;
  eric.backTime = 2;

  people.push(eric);

  var jp = new Person();
  jp.id = 6;
  jp.name = "John Paul Peng";
  jp.isVisitor = false;
  jp.isDriver = false;
  jp.location = "oc";
  jp.hc = "saigon";
  jp.goTime = 1;
  jp.backTime = 1;

  people.push(jp);

  var sean = new Person();
  sean.id = 7;
  sean.name = "Sean Lee";
  sean.isVisitor = false;
  sean.isDriver = true;
  sean.location = "north";
  sean.hc = "oman";
  sean.goTime = 2;
  sean.backTime = 2;

  people.push(sean);

  var michellew = new Person();
  michellew.id = 8;
  michellew.name = "Michelle Won";
  michellew.isVisitor = false;
  michellew.isDriver = false;
  michellew.location = "south";
  michellew.hc = "oman";
  michellew.goTime = 2;
  michellew.backTime = 2;

  people.push(michellew);

  var rosalina = new Person();
  rosalina.id = 9;
  rosalina.name = "Rosalina";
  rosalina.isVisitor = true;
  rosalina.isDriver = false;
  rosalina.location = "oc";
  rosalina.hc = "";
  rosalina.goTime = 1;
  rosalina.backTime = 2;

  people.push(rosalina);

  $.each(people, function(index,person){
    if (person.goTime>person.backTime) {
      throw "Input Error: goTime should always be less than or equal to backTime.";

    }

  });

  var drivers = [];
  $.each(people, function(index,person){
    if (person.isDriver) {
      drivers.push(person);
    }
  });

  var driverForRosalina = pickBestDriver(rosalina,drivers,2);
  var driverForJP = pickBestDriver(jp,drivers,1);
  assert.ok(driverForJP==willie, driverForJP.name + " goes with " + jp.name);
  assert.ok(driverForRosalina==david, driverForRosalina.name + " comes back with " + rosalina.name);

  var group = putPeople(people);

  console.log(group);

  assertString = "";
  $.each(group, function(index, g) {
    $.each(g, function(jndex, driver){
      assertString += driver.name + " drives the following: [";
      $.each(driver.theirDrivees, function(gndex, drivee){
        assertString += "\n" + drivee.name +", ";
      });
      assertString += "]";
    })
  });

  assert.ok(group.length==4, assertString);


  // this.id = -1;
  // this.name = "John Doe";
  // this.date = "09/26/2015";
  // this.isVisitor = false;
  // this.isDriver = false;
  // this.theirDriver = {};
  // this.theirDrivees = [this];
  // this.spotsLeft = 4;
  // this.service = "3";
  // this.hc = "saigon";
  // this.location = "south";
  // this.etc = "asdfghjkqweryuio";

});
