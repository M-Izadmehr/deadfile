"use strict";

class OtherClass {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return "Ciao " + this.name;
  }
}

module.exports = OtherClass;
