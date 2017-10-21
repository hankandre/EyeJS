class EyeJS {
  constructor() {
    this.data = {
      tested: 0,
      failed: 0,
      warn: 0,
      result: 0
    };
  }
  checkout() {
    this.data.result = this.data.failed == 0 ? 1 : 0;
    this.data.result = this.data.warn == 0 ? this.data.result : 3;
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      `/post/?result=${this.data.result}&failed=${this.data.failed}`,
      true
    );
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const data = request.responseText;
        if (data == "sucess") {
          window.open("", "_self").close();
        }
      } else {
        console.error(
          "EyeJS error: The ajax request loaded, but returned an error."
        );
      }
    };
    request.onerror = () => {
      // There was a connection error of some sort
      console.error("EyeJS error: The ajax request returned an error.");
    };
    request.send();
  }
  test() {
    const $ = $ => {
      class expect {
        constructor(val) {
          this.val = val;
        }
        Equal(val, not) {
          if (
            (JSON.stringify(val) == JSON.stringify(this.val) && not != false) ||
            (not == false && JSON.stringify(val) != JSON.stringify(this.val))
          ) {
            return true;
          } else {
            return `${this.val} isn't equal to ${val}`;
          }
        }
        hasProperty(name, not) {
          if (
            (this.val.hasOwnProperty(name) && not != false) ||
            (not == false && !this.val.hasOwnProperty(name))
          ) {
            return true;
          } else {
            return `${this.val} doesn't have '${name}' as property`;
          }
        }
        includes(val, not) {
          if (
            (this.val.includes(val) && not != false) ||
            (not == false && !this.val.includes(val))
          ) {
            return true;
          } else {
            return `${this.val} doesn't includes ${val}`;
          }
        }
        is(type, not) {
          if (
            (typeof this.val == type && not != false) ||
            (not == false && typeof this.val != type)
          ) {
            return true;
          } else {
            return `${this.val} isn't a ${type}`;
          }
        }
        isCloseTo(actual, precision = 2, not) {
          if (
            (Math.abs(this.val - actual) < Math.pow(10, -precision) / 2 &&
              not != false) ||
            (not == false &&
              !(Math.abs(this.val - actual) < Math.pow(10, -precision) / 2))
          ) {
            return true;
          } else {
            return `${this
              .val} isn't close to ${actual}, with a precision of ${precision}`;
          }
        }
        isTrueFor(callback, not) {
          if (
            (callback(this.val) && not != false) ||
            (not == false && !callback(this.val))
          ) {
            return true;
          } else {
            return `${this.val} isn't true for ${callback}`;
          }
        }
        length(val, not) {
          if (
            (this.val.length == val && not != false) ||
            (not == false && this.val.length != val)
          ) {
            return true;
          } else {
            return `${this.val} doesn't have for length ${val}`;
          }
        }
        Match(val, not) {
          if (
            (val.test(this.val) && not != false) ||
            (not == false && !val.test(this.val))
          ) {
            return true;
          } else {
            return `${this.val} doesn't match ${val}`;
          }
        }
        toRun() {
          try {
            this.val();
          } catch (e) {
            return false;
          }
          return true;
        }
        visual() {
          this.val instanceof Element ? this.val.scrollIntoView() : null;
          return window.confirm("EyeJS - Is everything alright?");
        }
      }
      return new expect($);
    };
    let result = !0;
    let failed = [];
    for (var i = 0; i < arguments.length; i++) {
      const callback = arguments[i];
      const temp = callback($);
      if (temp == !1) {
        result = result == !0 || result == !1 ? false : result;
        failed.push(i + 1);
      } else if (temp != !1 && temp != !0) {
        result = temp;
      }
    }
    if (result == !1) {
      this.data.failed += failed.length;
      console.log(`\nTest ${failed} failed\n`);
    } else if (result == !0) {
      this.data.tested += 1;
    } else {
      this.data.warn += 1;
    }
  }
}
const eye = new EyeJS();
