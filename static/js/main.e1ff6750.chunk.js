(this.webpackJsonpmicrobots=this.webpackJsonpmicrobots||[]).push([[0],{47:function(n,t,e){"use strict";e.r(t);var r={};e.r(r),e.d(r,"newBot",(function(){return y})),e.d(r,"setPos",(function(){return S})),e.d(r,"setWeight",(function(){return z})),e.d(r,"setFixed",(function(){return C}));var o={};e.r(o),e.d(o,"newWorld",(function(){return N})),e.d(o,"setBots",(function(){return D})),e.d(o,"initEdges",(function(){return I})),e.d(o,"stiffness",(function(){return W})),e.d(o,"stiffnessDerivative",(function(){return J})),e.d(o,"stiffnessPair",(function(){return T})),e.d(o,"stiffnessPairDerivative",(function(){return q})),e.d(o,"removeFixedFromVector",(function(){return G})),e.d(o,"removeFixedFromMatrix",(function(){return H})),e.d(o,"stiffnessMatrix",(function(){return R})),e.d(o,"stiffnessMatrixDerivative",(function(){return U})),e.d(o,"forceMatrix",(function(){return X})),e.d(o,"displacement",(function(){return Y})),e.d(o,"compliance",(function(){return K})),e.d(o,"objective",(function(){return L})),e.d(o,"resolveCollisionStep",(function(){return Q})),e.d(o,"resolveCollision",(function(){return Z})),e.d(o,"optimizeStepNumericalBotDim",(function(){return _})),e.d(o,"optimizeStepNumericalBot",(function(){return nn})),e.d(o,"gradient",(function(){return tn})),e.d(o,"optimizeStepNumerical",(function(){return en}));var u=e(4),i=e(0),c=e.n(i),a=e(11),s=e.n(a),f=e(10),l=e(26),d=e(9),p=e(1),m=e(27),b=e(62),v=e(64),x=e(65),j=e(66),h=e(67),w=e(35),g=e(28),O=e(29),y=function(){return{pos:new p.t(0,0,0),weight:1,fixed:!1}},S=function(n){return function(t){return t.pos=n,t}},z=function(n){return function(t){return t.weight=n,t}},C=function(n){return function(t){return t.fixed=n,t}},E=function(n,t){for(var e=0,r=0;r<n.length;++r)e+=n[r]*t[r];return e},M=function(n,t){var e=new p.h;return e.elements=n.elements.map((function(n,e){return n+t.elements[e]})),e},A=function(n,t){var e=new p.h;return e.elements=n.elements.map((function(n,e){return n-t.elements[e]})),e},B=function(n,t){return Object(d.a)(Array(n)).map((function(){return Object(d.a)(Array(t)).map((function(){return 0}))}))},F=function(n){var t=Object(d.a)(Array(3*n.length)).map((function(){return 0}));return n.map((function(n,e){for(var r=0;r<3;++r)t[3*e+r]=n.getComponent(r)})),t},P=function(n){var t,e=B(3*n.length,3*(null===(t=n[0])||void 0===t?void 0:t.length)||0);return n.map((function(t,r){return t.map((function(t,o){for(var u=0;u<3;++u)for(var i=0;i<3;++i)e[3*r+u][3*o+i]=n[r][o].elements[u+3*i]}))})),e},k=e(30),N=function(){return{bots:[],edges:[]}},D=function(n){return function(t){return t.bots=n,t}},I=function(n){var t=Object(d.a)(Array(n.bots.length)).map((function(){return 1})),e=t.map((function(n,e){return t.map((function(n,t){return e===t?0:1}))}));return n.edges=e,n},V=function(n){return 1/(1+Math.exp(4*(n-1.5)))},W=function(n){return(t=n,e=n,(new p.h).set(t.x*e.x,t.x*e.y,t.x*e.z,t.y*e.x,t.y*e.y,t.y*e.z,t.z*e.x,t.z*e.y,t.z*e.z)).multiplyScalar(-1/n.dot(n));var t,e},J=function(n){return function(t){return function(e){var r=1e-5,o=new p.t;o.setComponent(t,r);var u=W(e.clone().add(o)).multiplyScalar(n(e.clone().add(o).length())),i=W(e.clone().sub(o)).multiplyScalar(n(e.clone().sub(o).length()));return A(u,i).multiplyScalar(1/2e-5)}}},T=function(n,t,e){return W(t.pos.clone().sub(n.pos)).multiplyScalar(e)},q=function(n){return function(t){return function(e){return function(r,o,u){if(r!==t&&o!==t)return(new p.h).set(0,0,0,0,0,0,0,0,0);var i=J(n)(e)(o.pos.clone().sub(r.pos));return r===t?i.multiplyScalar(-1):i}}}},G=function(n){return function(t){return t.filter((function(t,e){return!n.bots[e].fixed}))}},H=function(n){return function(t){return t.filter((function(t,e){return!n.bots[e].fixed})).map((function(t){return t.filter((function(t,e){return!n.bots[e].fixed}))}))}},R=function(n){var t=n.edges.map((function(){return n.edges.map((function(){return(new p.h).multiplyScalar(0)}))}));return t.forEach((function(e,r){e.forEach((function(e,o){if(r!==o){var u=T(n.bots[r],n.bots[o],n.edges[r][o]);t[r][r]=A(t[r][r],u),t[r][o]=M(t[r][o],u)}}))})),H(n)(t)},U=function(n){return function(t){return function(e){return function(r){var o=r.edges.map((function(){return r.edges.map((function(){return(new p.h).multiplyScalar(0)}))})),u=r.bots[t];return r.bots.forEach((function(i,c){if(t!==c){var a=q(n)(u)(e)(r.bots[t],r.bots[c],r.edges[t][c]);o[t][t]=A(o[t][t],a),o[c][c]=A(o[c][c],a),o[t][c]=M(o[t][c],a),o[c][t]=M(o[c][t],a)}})),H(r)(o)}}}},X=function(n){return G(n)(n.bots.map((function(n){return new p.t(0,-n.weight,0)})))},Y=function(n){var t,e,r=F(X(n)),o=P(R(n));return t=o,e=r,k.solve(t,e)},K=function(n){var t=F(X(n)),e=Y(n);return E(t,e)},L=function(n){return K(n)},Q=function(n){for(var t=0;t<n.bots.length;++t)for(var e=t+1;e<n.bots.length;++e)if(!n.bots[t].fixed||!n.bots[e].fixed){var r=n.bots[t].fixed||n.bots[e].fixed,o=n.bots[e].pos.clone().sub(n.bots[t].pos),u=o.length();if(!(u>1)){var i=o.multiplyScalar((1-u)/(r?1:2)/u);n.bots[t].fixed||(n.bots[t].pos=n.bots[t].pos.clone().sub(i)),n.bots[e].fixed||(n.bots[e].pos=n.bots[e].pos.clone().add(i))}}return n},Z=function(n){for(var t=n,e=0;e<10;++e)t=Q(t);return t},$=function(n){for(var t=0;t<n.bots.length;++t)for(var e=0;e<n.bots.length;++e)if(t!==e){var r=n.bots[e].pos.clone().sub(n.bots[t].pos).length();n.edges[t][e]=V(r)}},_=function(n){return function(t){return function(e){return function(r){var o=e.pos.getComponent(r);e.pos.setComponent(r,o+.001),$(t);var u=K(t);e.pos.setComponent(r,o-.001),$(t);var i=K(t);e.pos.setComponent(r,o);var c=-(u-i)*n;return Math.abs(c)>.5&&(c=.5*Math.sign(c)),e.pos.setComponent(r,o+c),$(t),t}}}},nn=function(n){return function(t){return function(e){if(e.fixed)return t;var r=_(n)(t)(e);return[0,1,2].map((function(n){return r(n)})),t}}},tn=function(n){return function(t){var e=Y(t);return t.bots.map((function(r,o){return(new p.t).fromArray([0,1,2].map((function(r){var u,i,c=P(U(n)(o)(r)(t));return-E(e,(u=c,i=e,Object(d.a)(Array(u.length)).map((function(n,t){return E(u[t],i)}))))})))}))}},en=function(n){return function(t){$(t);var e=tn(V)(t).map((function(t){return t.multiplyScalar(-n/(1+t.length()))}));return t.bots.map((function(n,t){n.fixed||n.pos.add(e[t])})),Z(t)}},rn=new O.a(123),on=Object(b.a)((function(n){return{gridItem:{padding:n.spacing(2),textAlign:"center"}}})),un=function(){return r.setPos(Object(l.a)(p.t,Object(d.a)([rn.next(),rn.next(),rn.next()].map((function(n){return 10*n})))))(r.newBot())},cn=[r.setFixed(!0)(r.newBot()),r.setFixed(!0)(r.setPos(new p.t(3,0,0))(r.newBot())),r.setFixed(!0)(r.setPos(new p.t(0,0,2))(r.newBot())),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un(),un()],an=Object(g.a)(o.newWorld(),o.setBots(cn),o.initEdges),sn=function(){var n=Object(w.a)(),t=Object(f.a)(n,2),e=t[0],r=t[1],c=.55*e,a=.9*r,s=on(),l=Object(i.useRef)(null),d=Object(i.useState)(),b=Object(f.a)(d,2),g=b[0],O=b[1],y=Object(i.useState)(),S=Object(f.a)(y,2),z=S[0],C=S[1],E=Object(i.useState)(),M=Object(f.a)(E,2),A=M[0],B=M[1],F=Object(i.useState)(),P=Object(f.a)(F,2),k=P[0],N=P[1],D=Object(i.useState)(0),I=Object(f.a)(D,2),V=I[0],W=I[1],J=Object(i.useState)(0),T=Object(f.a)(J,2),q=T[0],G=T[1];return Object(i.useEffect)((function(){var n=l.current;if(n){var t=new p.m(75,c/a,.1,1e3);t.position.set(10,10,10),t.lookAt(0,0,0),B(t);var e=new p.u({antialias:!0});e.setClearColor("#000000"),e.setSize(c,a),n.appendChild(e.domElement),N(e);var r=new m.a(t,e.domElement);r.enableDamping=!0,r.dampingFactor=.5,O(r);var o=window.setInterval((function(){return W((function(n){return n+1}))}),1e3/30);return function(){window.clearInterval(o),n.removeChild(e.domElement)}}}),[l,c,a]),Object(i.useEffect)((function(){g&&g.update(),k&&z&&A&&k.render(z,A)}),[g,k,z,A,V]),Object(i.useEffect)((function(){if(!(q>=50)){var n=setTimeout((function(){G(q+1);var n=an.bots.map((function(n){return t=n.pos,e=n.fixed?new p.c(0,0,1):new p.c(0,1,0),function(n){var r=(new p.i).setPosition(t).scale(new p.t(.5,.5,.5)),o=new p.p(1,16,16).applyMatrix4(r);o.computeVertexNormals(),o.faces.forEach((function(n){return n.vertexColors=new Array(3).fill(!0).map((function(){return e}))}));var u=(new p.b).fromGeometry(o);delete u.attributes.uv;var i=new p.j(u,new p.k({color:e}));return i.geometry=u,i.matrixAutoUpdate=!1,i.matrix=r,i.updateMatrix(),n.add(i),n};var t,e})).reduce((function(n,t){return t(n)}),function(){var n=new p.o;n.add(new p.a(16777215,.4));var t=new p.e(16777215,.4);return t.position.set(0,1,0),n.add(t),n}());an.bots.map((function(t,e){return an.bots.map((function(r,o){e>=o||(n=function(n,t,e,r){return function(o){var u=(new p.t).subVectors(t,n),i=new p.i;i.lookAt(n,t,(new p.l).up),i.multiply((new p.i).set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1));var c=new p.d(e,e,u.length(),8,1),a=new p.j(c,new p.k({color:r}));return a.applyMatrix4(i),a.position.x=(t.x+n.x)/2,a.position.y=(t.y+n.y)/2,a.position.z=(t.z+n.z)/2,o.add(a),o}}(t.pos,r.pos,.3*Math.sqrt(an.edges[e][o]),new p.c(1,0,0))(n))}))})),C(n),an=o.optimizeStepNumerical(.5)(an)}),10);return function(){return clearTimeout(n)}}}),[g,k,z,A,q]),Object(u.jsx)(u.Fragment,{children:Object(u.jsxs)(v.a,{container:!0,item:!0,xs:11,children:[Object(u.jsx)(v.a,{item:!0,xs:4,style:{height:.9*window.innerHeight,overflowX:"hidden",overflowY:"scroll"},children:Object(u.jsx)(v.a,{container:!0,direction:"column",children:Object(u.jsx)(v.a,{item:!0,className:s.gridItem,children:Object(u.jsx)(x.a,{children:Object(u.jsxs)(j.a,{children:[Object(u.jsx)(h.a,{children:Object(u.jsx)("b",{children:"Microbots"})}),Object(u.jsxs)(h.a,{children:[Object(u.jsx)("b",{children:"iterations: "}),q]})]})})})})}),Object(u.jsx)(v.a,{item:!0,xs:5,children:Object(u.jsx)("div",{ref:l})})]})})};s.a.render(Object(u.jsx)(c.a.StrictMode,{children:Object(u.jsx)(sn,{})}),document.getElementById("root"))}},[[47,1,2]]]);
//# sourceMappingURL=main.e1ff6750.chunk.js.map