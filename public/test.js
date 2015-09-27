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

  people.add(willie);

  var tony = new Person();
  tony.id = 1;
  tony.name = "Tony Zhao";
  tony.isVisitor = false;
  tony.isDriver = true;
  tony.location = "south";
  tony.hc = "palu";

  people.add(tony);

  

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
