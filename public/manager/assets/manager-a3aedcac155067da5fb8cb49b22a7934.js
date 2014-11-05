define("manager/app",["ember","ember/resolver","ember/load-initializers","manager/config/environment","exports"],function(e,t,n,a,i){"use strict";var s=e["default"],r=t["default"],o=n["default"],u=a["default"];s.MODEL_FACTORY_INJECTIONS=!0;var l=s.Application.extend({modulePrefix:u.modulePrefix,podModulePrefix:u.podModulePrefix,Resolver:r});o(l,u.modulePrefix),i["default"]=l}),define("manager/authenticators/un-auth",["simple-auth/authenticators/base","ember","exports"],function(e,t,n){"use strict";var a=e["default"],i=t["default"];n["default"]=a.extend({restore:function(e){var t=e.expiresAt,n=e.token;return new i.RSVP.Promise(function(e,a){n&&t&&moment().isBefore(t)?i.$.ajax({url:"/manager/session",type:"PUT",contentType:"application/json",headers:{Accept:"application/vnd.api+json",Authorization:"Token "+n}}).then(function(t){i.run(function(){e({token:t.session.token,expiresAt:t.session.expires_at})})},function(){i.run(function(){a()})}):a()})},authenticate:function(e){return new i.RSVP.Promise(function(t,n){i.$.ajax({url:"/manager/sessions",type:"POST",contentType:"application/json",headers:{Accept:"application/vnd.api+json"},data:JSON.stringify({session:{email:e.identification,password:e.password}})}).then(function(e){i.run(function(){t({token:e.session.token,expiresAt:e.session.expires_at})})},function(e){var t=JSON.parse(e.responseText);i.run(function(){n(t.error.detail)})})})},invalidate:function(){return new i.RSVP.Promise(function(e){i.$.ajax({url:"/manager/session",type:"DELETE"}).always(function(){e()})})}})}),define("manager/authorizers/un-auth",["simple-auth/authorizers/base","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=n.extend({authorize:function(e){var t=this.get("session.token");this.get("session.isAuthenticated")&&t&&e.setRequestHeader("Authorization","Token "+t)}})}),define("manager/components/lcboapi-logo",[],function(){"use strict"}),define("manager/controllers/login",["ember","simple-auth/mixins/login-controller-mixin","exports"],function(e,t,n){"use strict";var a=e["default"],i=t["default"];n["default"]=a.Controller.extend(i,{authenticator:"authenticator:un-auth",actions:{authenticate:function(){var e=this;this._super().then(null,function(t){console.log(t);var n=JSON.parse(t).error;e.set("errorMessage",n)})}}})}),define("manager/initializers/auth",["manager/authenticators/un-auth","manager/authorizers/un-auth","exports"],function(e,t,n){"use strict";var a=e["default"],i=t["default"];n["default"]={name:"authentication",before:"simple-auth",initialize:function(e){e.register("authenticator:un-auth",a),e.register("authorizer:un-auth",i)}}}),define("manager/initializers/export-application-global",["ember","manager/config/environment","exports"],function(e,t,n){"use strict";function a(e,t){var n=i.String.classify(s.modulePrefix);s.exportApplicationGlobal&&(window[n]=t)}var i=e["default"],s=t["default"];n.initialize=a,n["default"]={name:"export-application-global",initialize:a}}),define("manager/initializers/simple-auth",["simple-auth/configuration","simple-auth/setup","manager/config/environment","exports"],function(e,t,n,a){"use strict";var i=e["default"],s=t["default"],r=n["default"];a["default"]={name:"simple-auth",initialize:function(e,t){i.load(e,r["simple-auth"]||{}),s(e,t)}}}),define("manager/router",["ember","manager/config/environment","exports"],function(e,t,n){"use strict";var a=e["default"],i=t["default"],s=a.Router.extend({location:i.locationType});s.map(function(){this.route("manager"),this.route("login",{path:"/log-in"})}),n["default"]=s}),define("manager/routes/application",["simple-auth/mixins/application-route-mixin","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=Ember.Route.extend(n)}),define("manager/routes/login",["ember","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=n.Route.extend({setupController:function(e){e.set("errorMessage",null)}})}),define("manager/templates/application",["ember","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=n.Handlebars.template(function(e,t,a,i,s){function r(e,t){t.buffer.push("\n      <span>LCBO API</span>\n    ")}function o(e,t){var n="";return t.buffer.push('\n        <li class="log-out">\n          <a '),t.buffer.push(d(a.action.call(e,"invalidateSession",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["STRING"],data:t}))),t.buffer.push(">Log Out</a>\n        </li>\n      "),n}function u(e,t){var n,i,s,r="";return t.buffer.push('\n        <li class="log-in">\n          '),i=a["link-to"]||e&&e["link-to"],s={hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(6,l,t),contexts:[e],types:["STRING"],data:t},n=i?i.call(e,"login",s):g.call(e,"link-to","login",s),(n||0===n)&&t.buffer.push(n),t.buffer.push("\n        </li>\n      "),r}function l(e,t){t.buffer.push("\n            Log In\n          ")}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,n.Handlebars.helpers),s=s||{};var f,p,h,c="",d=this.escapeExpression,m=this,g=a.helperMissing;return s.buffer.push('<header>\n  <h1 class="logo">\n    '),p=a["link-to"]||t&&t["link-to"],h={hash:{},hashTypes:{},hashContexts:{},inverse:m.noop,fn:m.program(1,r,s),contexts:[t],types:["STRING"],data:s},f=p?p.call(t,"index",h):g.call(t,"link-to","index",h),(f||0===f)&&s.buffer.push(f),s.buffer.push("\n  </h1>\n\n  <nav>\n    <ol>\n      "),f=a["if"].call(t,"session.isAuthenticated",{hash:{},hashTypes:{},hashContexts:{},inverse:m.program(5,u,s),fn:m.program(3,o,s),contexts:[t],types:["ID"],data:s}),(f||0===f)&&s.buffer.push(f),s.buffer.push("\n    </ol>\n  </nav>\n</header>\n\n<main>\n  "),f=a._triageMustache.call(t,"outlet",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:s}),(f||0===f)&&s.buffer.push(f),s.buffer.push("\n</main>\n\n<footer>\n  LCBO API &copy; 2009&ndash;2014 Carsten Nielsen\n</footer>\n"),c})}),define("manager/templates/login",["ember","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=n.Handlebars.template(function(e,t,a,i,s){function r(e,t){var n,i="";return t.buffer.push('\n  <div class="alert alert-danger">\n    <strong>Login failed:</strong> '),n=a._triageMustache.call(e,"errorMessage",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(n||0===n)&&t.buffer.push(n),t.buffer.push("\n  </div>\n"),i}this.compilerInfo=[4,">= 1.0.0"],a=this.merge(a,n.Handlebars.helpers),s=s||{};var o,u,l,f="",p=this.escapeExpression,h=a.helperMissing,c=this;return s.buffer.push("<form "),s.buffer.push(p(a.action.call(t,"authenticate",{hash:{on:"submit"},hashTypes:{on:"STRING"},hashContexts:{on:t},contexts:[t],types:["STRING"],data:s}))),s.buffer.push('>\n  <label for="identification">Email</label>\n  '),s.buffer.push(p((u=a.input||t&&t.input,l={hash:{id:"identification",placeholder:"Email",value:"identification"},hashTypes:{id:"STRING",placeholder:"STRING",value:"ID"},hashContexts:{id:t,placeholder:t,value:t},contexts:[],types:[],data:s},u?u.call(t,l):h.call(t,"input",l)))),s.buffer.push('\n  <label for="password">Password</label>\n  '),s.buffer.push(p((u=a.input||t&&t.input,l={hash:{id:"password",placeholder:"Password",type:"password",value:"password"},hashTypes:{id:"STRING",placeholder:"STRING",type:"STRING",value:"ID"},hashContexts:{id:t,placeholder:t,type:t,value:t},contexts:[],types:[],data:s},u?u.call(t,l):h.call(t,"input",l)))),s.buffer.push('\n  <button type="submit">Login</button>\n</form>\n\n'),o=a["if"].call(t,"errorMessage",{hash:{},hashTypes:{},hashContexts:{},inverse:c.noop,fn:c.program(1,r,s),contexts:[t],types:["ID"],data:s}),(o||0===o)&&s.buffer.push(o),s.buffer.push("\n"),f})}),define("manager/config/environment",["ember"],function(e){var t="manager";try{var n=t+"/config/environment",a=e["default"].$('meta[name="'+n+'"]').attr("content"),i=JSON.parse(unescape(a));return{"default":i}}catch(s){throw new Error('Could not read config from meta tag with name "'+n+'".')}}),runningTests?require("manager/tests/test-helper"):require("manager/app")["default"].create({});