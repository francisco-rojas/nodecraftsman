// Building objects this way requires defining the same methods in every object of the same type
// or perhaps you would build a function (factory) that creates identical objects. In either way
// objects are created out of nothing and are no linked to any other object thus they don't share any behaviour.

// Building objects from nothing
var myCar = {};

myCar.honk = function () {
    console.log('honk honk');
};

myCar.drive = function () {
    console.log('vrooom...');
};

myCar.honk(); // outputs "honk honk"
myCar.drive(); // outputs "vrooom..."

// Building objects using factory function
// One downside of this approach is efficiency: for every myCar object that is created, a new honk
// function is created and attached - creating 1,000 objects means that the JavaScript interpreter has to
// allocate memory for 1,000 functions, although they all implement the same behaviour. This results
// in an unnecessarily high memory footprint of the application.
// Also, his approach deprives us of some interesting opportunities. These myCar objects don’t
// share anything - they were built by the same creator function, but are completely independent from
// each other.
var makeCar = function () {
    var newCar = {};
    newCar.honk = function () {
        console.log('honk honk');
    };

    newCar.drive = function () {
        console.log('vrooom...');
    };

    return newCar;
};

myCar1 = makeCar();
myCar2 = makeCar();
myCar3 = makeCar();

// Using a constructor function to create objects
// In JavaScript, the entities that create objects with shared behaviour are functions which are called
// in a special way. These special functions are called constructors.
// Is common practice to capitalize the first letter of the name to indicate that a function is a constructor.
// constructor functions are often called pseudoclasses in JavaScript.
var Car = function () {
    this.honk = function () {
        console.log('honk honk');
    };
};

// Using this and new makes the explicit creation and return of the new object unnecessary - it is
// created and returned “behind the scenes” (i.e., the new keyword is what creates the new, “invisible”
// object, and secretly passes it to the Car function as its this variable).
var myCar1 = new Car();
var myCar2 = new Car();

// using constructor we don’t have to create every car object
// manually, but we still cannot modify the honk behaviour only once and have this change reflected
// in all created cars.
// By using a constructor, all objects received a special property
// that links them to their constructor
console.log(myCar1.constructor); // outputs [Function: Car]
console.log(myCar2.constructor); // outputs [Function: Car]

// Using prototyping to efficiently share behaviour between objects
// JavaScript functions are objects too, and they therefore have properties
// Whenever we call a function on an object, the
// JavaScript interpreter tries to find that function within the queried object. But if it doesn’t find the
// function within the object itself, it asks the object for the pointer to its prototype, then goes to the
// prototype, and asks for the function there. If it is found, it is then executed.
var Car = function () {
};

Car.prototype.honk = function () {
    console.log('honk honk');
};

var myCar1 = new Car();
var myCar2 = new Car();

myCar1.honk(); // executes Car.prototype.honk() and outputs "honk honk"
myCar2.honk(); // executes Car.prototype.honk() and outputs "honk honk"

// In JavaScript, objects can be changed at runtime. This holds true
// for prototypes, too.
var Car = function () {
};

Car.prototype.honk = function () {
    console.log('honk honk');
};

var myCar1 = new Car();
var myCar2 = new Car();

myCar1.honk(); // executes Car.prototype.honk() and outputs "honk honk"
myCar2.honk(); // executes Car.prototype.honk() and outputs "honk honk"

Car.prototype.honk = function () {
    console.log('meep meep');
};

myCar1.honk(); // executes Car.prototype.honk() and outputs "meep meep"
myCar2.honk(); // executes Car.prototype.honk() and outputs "meep meep"

// we can also add additional functions at runtime
var Car = function () {
};

Car.prototype.honk = function () {
    console.log('honk honk');
};

var myCar1 = new Car();
var myCar2 = new Car();

Car.prototype.drive = function () {
    console.log('vrooom...');
};

myCar1.drive(); // executes Car.prototype.drive() and outputs "vrooom..."
myCar2.drive(); // executes Car.prototype.drive() and outputs "vrooom..."

// Object-orientation, prototyping, and inheritance
var Vehicle = function () {
};

Vehicle.prototype.drive = function () {
    console.log('vrooom...');
};

var Car = function () {
};

Car.prototype = new Vehicle();

Car.prototype.honk = function () {
    console.log('honk honk');
};

var myCar = new Car();

myCar.honk(); // outputs "honk honk"
myCar.drive(); // outputs "vrooom..."

// While being more concise and expressive, this code achieves exactly the same behaviour, without
// the need to write dedicated constructors and attaching functions to their prototype. As you can see,
// Object.create() handles both behind the scenes, on the fly.
Object.create = function (o) {
    var F = function () {
    };
    F.prototype = o;
    return new F();
};

var vehicle = {};

vehicle.drive = function () {
    console.log('vrooom...');
};

var car = Object.create(vehicle);
car.honk = function () {
    console.log('honk honk');
};

var myCar = Object.create(car);

myCar.honk(); // outputs "honk honk"
myCar.drive(); // outputs "vrooom..."
