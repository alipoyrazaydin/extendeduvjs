//    ExtendedUVJS.
//    A Library to extend the use of any LibUV-based Javascript Interpreter.
//    Made with <3 by KIGIPUX (Ali Poyraz AYDIN)

/**
 * Creates an instance within the current Javascript thread.
 * @param {object} options - Options to initialize the new instance of ExtendedUVJS. For example, you can set `logAll` to `true` to see what is being initialized. 
 */
module.exports = (options = {}) => {
    var InstanceOptions = {
        logAll: options.logAll || false
    };

    var Stringset = {
        "0.0": "Loading ExtendedUVJS...",
        "0.1": "Initializing basic interfaces...",
        "0.2": "Module \"$1\" is loaded."
    }

    // Create mini-functions to help us in this journey.
    const syst = (...args) => {if (InstanceOptions.logAll) console.log(...args);};
    const tsyst = (...args) => {if (InstanceOptions.logAll) console.log("[" + process.hrtime().toString().substring(0,12) + "] ", ...args);};
    const systGSS = (sx,...sr) => {if (InstanceOptions.logAll) console.log((() => {var x0 = Stringset[sx]; sr.forEach((val,idx) => x0 = x0.replace("$"+(idx+1).toString(),val)); return x0;})());}
    const tsystGSS = (sx,...sr) => {if (InstanceOptions.logAll) console.log("[" + process.hrtime().toString().substring(0,12) + "] ", (() => {var x0 = Stringset[sx]; sr.forEach((val,idx) => x0 = x0.replace("$"+(idx+1).toString(),val)); return x0;})());}

    syst(Stringset["0.0"]);
    ((GLB) => {
        GLB.requireAbsolute = (id) => {return require(require.main.path + "/" + id)};
        Object.prototype.with = function(obj) { Object.assign(this,obj); return this; };
        Object.prototype.withClone = function(obj) { let j = this; Object.assign(j,obj); return j; };
        Object.prototype.onto = function(func) { func.call(this,this); return this; };
        Object.prototype.ontoClone = function(func) { let j = this; func.call(j,j); return j; };
        Object.prototype.dispose = function() { delete this; }

        GLB.swallow = function(func) { try { return func.call(this); } catch { return undefined; } };
        GLB.swallowCatch = function(func) { try { return func.call(this); } catch (error) { return error; } };

        GLB.isset = function(e) { return (e !== null || e !== undefined); };
        GLB.unset = function(e) { delete e; }

        GLB.destroyGlobalsForceSafe = function() { delete self; delete window; delete process; delete global; delete globalThis; delete require; delete module; return; }

        GLB.tasking = {
            delay: function(delay){return new Promise((resolve) => {setTimeout(resolve,delay);});},
            desync: function(func) { return new Promise( function(resolv,rej) { setTimeout(function() { try { resolv(func.call(this)); } catch(err) { rej(err); } } ,1) } ); },
            queueMicrotask: GLB.queueMicrotask
        }

        tsyst(Stringset["0.1"]);
        
        // setIntervalACR (Accurate Interval)
        (() => {
            GLB.setIntervalACR = function(workFunc, interval) {
                var that = this;
                var expected, timeout;
                this.interval = interval; 
                this.intervalDisposer = function() {
                    clearTimeout(timeout);
                }
                function intervalStepper() {
                    var drift = Date.now() - expected;
                    workFunc();
                    expected += that.interval;
                    timeout = setTimeout(intervalStepper, Math.max(0, that.interval-drift));
                }
                expected = Date.now() + this.interval;
                timeout = setTimeout(intervalStepper, this.interval);
                return this;
            }
            GLB.clearIntervalPrototype = GLB.clearInterval;
            GLB.clearInterval = (idfx) => {
                if (typeof idfx.intervalDisposer !== 'undefined') idfx.intervalDisposer();
                else clearIntervalPrototype(idfx);
            };
            tsystGSS("0.2","Accurate Interval")
        })();

        // log (Better Log)
        (() => {
            const mark = (vk = 34) => {
                if (process.verbose) return '\x1b[' + (process.color || 34) + 'm[' + (process.logTitle ? process.logTitle : process.title) + " \x1b[33m" + hztime() + '\x1b[' + (process.color || 34) + 'm]';
                else return '\x1b[' + (process.color || 34) + 'm[' + (process.logTitle ? process.logTitle : process.title) + ']';
            }
            const more = function() { const h = this; return {
                // Here are the logging functions
                logNext: function(...args) {return GLB.log.call({ident: h.ident + "│ "}, h.ident+ "│", ...args, '\x1b[0m')},
                logEnd: function(...args) {return GLB.log.call({ident: h.ident + "  "}, h.ident+ "┕", ...args, '\x1b[0m')},
                verboseNext: function(...args) {return GLB.verbose.call({ident: h.ident + "│ "}, h.ident+ "│", ...args, '\x1b[0m')},
                verboseEnd: function(...args) {return GLB.verbose.call({ident: h.ident + "  "}, h.ident+ "┕", ...args, '\x1b[0m')},
                errorNext: function(...args) {return GLB.error.call({ident: h.ident + "│ "}, h.ident+ "│\x1b[31m", ...args, '\x1b[0m')},
                errorEnd: function(...args) {return GLB.error.call({ident: h.ident + "  "}, h.ident+ "┕\x1b[31m", ...args, '\x1b[0m')},
            }}
            GLB.ansiColors = {
                black: (t) => {return "\x1b[30m" + t + "\x1b[0m";},
                red: (t) => {return "\x1b[31m" + t + "\x1b[0m";},
                green: (t) => {return "\x1b[32m" + t + "\x1b[0m";},
                yellow: (t) => {return "\x1b[33m" + t + "\x1b[0m";},
                blue: (t) => {return "\x1b[34m" + t + "\x1b[0m";},
                magenta: (t) => {return "\x1b[35m" + t + "\x1b[0m";},
                cyan: (t) => {return "\x1b[36m" + t + "\x1b[0m";},
                white: (t) => {return "\x1b[37m" + t + "\x1b[0m";},
                reset: (t) => {return "\x1b[0m" + t + "\x1b[0m";}
            }
            GLB.log = function(...args) { console.log(mark() + ' \x1b[37m', ...args, '\x1b[0m');return more.call({ident:(this.ident === undefined ? "" : this.ident)}); };
            GLB.verbose = function(...args) { if (process.verbose) console.log(mark() + ' \x1b[37m', ...args, '\x1b[0m'); return more.call({ident:(this.ident === undefined ? "" : this.ident)}); };
            GLB.error = function(...args) { console.error(mark() + ' \x1b[37m', ...args, '\x1b[0m'); return more.call({ident:(this.ident === undefined ? "" : this.ident)}); };
            GLB.debug = (i) => {var spl = i.split("\n");if (spl.length > 1){var kStart = spl.shift();var kEnd = spl.pop();const vLog = verbose("\x1b[35m" + kStart);spl.forEach(kl => {vLog.verboseMore("\x1b[35m" + kl);});vLog.verboseEnd("\x1b[35m" + kEnd);} else {verbose("\x1b[35m" + i);}}
            GLB.errorCat = (i) => {
                var spl = i.toString().split("\n");; 
                if (spl.length > 1){
                    var kStart = spl.shift();
                    var kEnd = spl.pop();
                    const vLog = verbose("\x1b[31m" + kStart);
                    spl.forEach(kl => {
                        vLog.verboseMore("\x1b[31m" + kl);
                    });
                    vLog.verboseEnd("\x1b[31m" + kEnd);
                } else {verbose("\x1b[31m" + i);}
            }
            GLB.debug = (i) => {
                var spl = i.split("\n");
                if (spl.length > 1){
                    var kStart = spl.shift();
                    var kEnd = spl.pop();
                    const vLog = verbose("\x1b[35m" + kStart);
                    spl.forEach(kl => {
                        vLog.verboseMore("\x1b[35m" + kl);
                    });
                    vLog.verboseEnd("\x1b[35m" + kEnd);
                } else {verbose("\x1b[35m" + i);};
            }
            GLB.catArray = (arr, fn) => {var k = "";arr.forEach(e => {k = k + fn(e);});return k;};
            tsystGSS("0.2","Better Log");
        })();

        // khandle (Process Kill Handler)
        (() => {
            var forceShut = false;
            var hooks = [];
            GLB.addKillHook = (func) => { hooks.push(func); }
            GLB.removeKillHook = (func) => { delete hooks[hooks.indexOf(func)]; }
            function exitHandler(...args) {
                hooks.forEach(hook => hook());
                if (args[1][(process.verbose ? "stack" : "message")] !== undefined) errorCat(args[1][(process.verbose ? "stack" : "message")]);
                else if (args[1] !== undefined) errorCat(args[1]);
                if (forceShut === true) process.exit();
                forceShut = args[0];
            }
            process.on('exit', exitHandler.bind(null, false));
            process.on('SIGINT', exitHandler.bind(null, true));
            process.on('SIGUSR1', exitHandler.bind(null, false));
            process.on('SIGUSR2', exitHandler.bind(null, false));
            process.on('uncaughtException', exitHandler.bind(null, false));
            tsystGSS("0.2","Process Kill Handler");
        })();

    })((typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis)));
}
