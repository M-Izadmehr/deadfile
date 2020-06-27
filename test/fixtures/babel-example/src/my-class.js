"use strict";

class MyClass {
  constructor(name) {
    this.name = name;
  }
  hello() {
    return "Hello " + this.name;
  }
}
module.exports = MyClass;
