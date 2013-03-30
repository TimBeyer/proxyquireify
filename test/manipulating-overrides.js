'use strict';
/*jshint asi: true, browser: true */

require('./fixtures/foo');

var test       =  require('tape')
  , proxyquire =  require('proxyquireify')(require)
  , stats      =  require('./fixtures/stats')
  , barber     =  { bar: function () { return 'barber'; } }
  ;

var foober =  proxyquire('./fixtures/foo', { './bar': barber });

test('overriding dep with stub and manipulating stub afterwards', function (t) {

  barber.bar = function () { return 'friseur'; }
  barber.rab = function () { return 'rabarber'; }

  t.equal(foober.bigBar(), 'FRISEUR', 'overrides previously stubbed func');
  t.equal(foober.bigRab(), 'RABARBER', 'overrides func not previously stubbed');

  barber.bar = undefined;

  t.throws(foober.bigBar, /Property 'bar' of object #<Object> is not a function/, 'returns undefined when I delete an override later')  
  t.end()
})