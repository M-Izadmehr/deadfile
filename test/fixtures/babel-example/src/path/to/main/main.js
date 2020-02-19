'use strict';

import MyClass from 'my-class';
import OtherClass from 'includes/other-class'

const c = new MyClass('leonardo');
const ret = c.hello();
console.log(ret);

const o = new OtherClass('barre')
console.log(o.sayHello())