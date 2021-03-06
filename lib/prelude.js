// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles

(function(modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require == "function" && require;

    function findProxyquireifyName() {
      var deps = Object.keys(modules)
        .map(function (k) { return modules[k][1]; });

      for (var i = 0; i < deps.length; i++) {
        var pq = deps[i]['proxyquireify'];
        if (pq) return pq;
      }
    }

    var proxyquireifyName = findProxyquireifyName();

    function newRequire(name, jumped){
        var m = cache[name];
        var dontcache = name !== proxyquireifyName;

        if(!m || dontcache) {
            if(!modules[name]) {
                // if we cannot find the the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof require == "function" && require;
                if (!jumped && currentRequire) return currentRequire(name, true);

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) return previousRequire(name, true);
                throw new Error('Cannot find module \'' + name + '\'');
            }
            m = cache[name] = {exports:{}};
            modules[name][0](function(x){
                var id = modules[name][1][x];
                return newRequire(id ? id : x);
            },m,m.exports);
        }
        return cache[name].exports;
    }
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);

    // Override the current require with this new one
    return newRequire;
})
