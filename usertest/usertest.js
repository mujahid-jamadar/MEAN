var wd = require('wd'),
    chai = require('chai'),
    expect = chai.expect,
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('uuid-js');

var VARS = {};

// This assumes that selenium is running at http://127.0.0.1:4444/wd/hub/
var noop = function() {},
    b = wd.remote();

describe('Selenium Test Case', function() {

  this.timeout(60000);

  it('should execute test case without errors', function(done) {

    b.chain(function(err) {
      done(err);
    })
    .init({
      browserName: 'firefox'
    })
    .get("https://sportspartner.herokuapp.com/")
    .elementByLinkText("Login", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByName("username", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "admin@admin.com", noop);
      });
    })
    .elementByName("password", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "admin1", noop);
      });
    })
    .elementByXPath("//div[@id='home']/div/form/fieldset/input[3]", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByLinkText("Find Partners", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementById("address", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "ca", noop);
      });
    })
    .elementByXPath("//div[@class='twt-wrapper']/div/div[2]/form/input[4]", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByXPath("//select[@id='sport']//option[3]", function(err, el) {
      b.next('isSelected', el, function(err, isSelected) {
        if (!isSelected) {
          b.next('clickElement', el, noop);
        }
      });
    })
    .elementByXPath("//div[@class='twt-wrapper']/div/div[2]/form/input[4]", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByXPath("//div[@class='twt-wrapper']/div/div[2]/form/input[5]", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByXPath("//map[@id='gmimap3']/area", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByLinkText("Leave a message", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByName("comments", function(err, el) {
      b.next('clear', el, function(err) {
        b.next('type', el, "cesi", noop);
      });
    })
    .elementByXPath("//div[@class='panel-body']/form/input[2]", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .elementByLinkText("Logout", function(err, el) {
      b.next('clickElement', el, noop);
    })
    .close(function(err) {
      done(err);
    });

  });
});

afterEach(function() {
  b.quit();
});
