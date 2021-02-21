(this.webpackJsonpmicrobots=this.webpackJsonpmicrobots||[]).push([[0],{46:function(t,n,r){"use strict";r.r(n);var e={};r.r(e),r.d(e,"newVec3",(function(){return y})),r.d(e,"clone",(function(){return M})),r.d(e,"add",(function(){return A})),r.d(e,"sub",(function(){return S})),r.d(e,"multiplyScalar",(function(){return V})),r.d(e,"divideScalar",(function(){return B})),r.d(e,"dot",(function(){return E})),r.d(e,"length",(function(){return C})),r.d(e,"normalize",(function(){return P}));var o={};r.r(o),r.d(o,"newBot",(function(){return W})),r.d(o,"setPos",(function(){return N})),r.d(o,"setWeight",(function(){return R})),r.d(o,"setFixed",(function(){return z})),r.d(o,"average",(function(){return J}));var u={};r.r(u),r.d(u,"newWorld",(function(){return K})),r.d(u,"setBots",(function(){return Q})),r.d(u,"setPower",(function(){return $})),r.d(u,"edgeStrength",(function(){return tt})),r.d(u,"stiffness",(function(){return nt})),r.d(u,"stiffnessDerivative",(function(){return rt})),r.d(u,"stiffnessPair",(function(){return et})),r.d(u,"stiffnessPairDerivative",(function(){return ot})),r.d(u,"removeFixedFromVector",(function(){return ut})),r.d(u,"removeFixedFromMatrix",(function(){return at})),r.d(u,"stiffnessMatrix",(function(){return ct})),r.d(u,"acceleration",(function(){return it})),r.d(u,"forceMatrix",(function(){return st})),r.d(u,"displacement",(function(){return ft})),r.d(u,"resolveCollisionStep",(function(){return bt})),r.d(u,"resolveCollision",(function(){return pt})),r.d(u,"gradient",(function(){return lt}));var a={};r.r(a),r.d(a,"createAnimation",(function(){return mt}));var c=r(5),i=r(0),s=r.n(i),f=r(11),b=r.n(f),p=r(10),l=r(4),d=r(2),v=r(28),h=r(61),m=r(63),g=r(64),j=r(65),w=r(66),O=r(34),x=r(26),y=function(t,n,r){return[t,n,r]},M=function(t){return[t[0],t[1],t[2]]},A=function(t,n){return[t[0]+n[0],t[1]+n[1],t[2]+n[2]]},S=function(t,n){return[t[0]-n[0],t[1]-n[1],t[2]-n[2]]},V=function(t,n){return[t[0]*n,t[1]*n,t[2]*n]},B=function(t,n){return[t[0]/n,t[1]/n,t[2]/n]},E=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]},C=function(t){return Math.sqrt(E(t,t))},P=function(t){return B(t,C(t))},k=function(t,n,r){return[t,n,r]},F=function(t,n){return[A(t[0],n[0]),A(t[1],n[1]),A(t[2],n[2])]},I=function(t,n){return[S(t[0],n[0]),S(t[1],n[1]),S(t[2],n[2])]},q=function(t,n){return[V(t[0],n),V(t[1],n),V(t[2],n)]},D=function(t,n){return[E(t[0],n),E(t[1],n),E(t[2],n)]},W=function(){return{pos:y(0,0,0),weight:1,fixed:!1}},N=function(t){return function(n){return n.pos=t,n}},R=function(t){return function(n){return n.weight=t,n}},z=function(t){return function(n){return n.fixed=t,n}},J=function(t,n){var r=W();return r.pos=B(A(t.pos,n.pos),2),r.weight=(t.weight+n.weight)/2,r.fixed=t.fixed||n.fixed,r},T=function(t,n){t.length!==n.length&&function(){throw new Error("Vectors need to be the same length")}();for(var r=0,e=0;e<t.length;++e)r+=t[e]*n[e];return r},G=function(t,n){return Object(l.a)(Array(t)).map((function(){return Object(l.a)(Array(n)).map((function(){return 0}))}))},H=function(t){var n=Object(l.a)(Array(3*t.length)).map((function(){return 0}));return t.map((function(t,r){for(var e=0;e<3;++e)n[3*r+e]=t[e]})),n},L=function(t,n){for(var r=0,e=0;e<t.length;++e)r+=t[e]*n[e];return r},U=function(t,n,r){return t.map((function(t,e){return t+n[e]*r}))},X=function(t,n){for(var r=n.map((function(){return 0})),e=0;e<t.length;++e){var o=t[e][0],u=t[e][1],a=t[e][2];r[o]+=a*n[u]}return r},Y=function(t,n){for(var r=function(t){for(var n=[],r=0;r<t.length;++r)for(var e=0;e<t.length;++e)Math.floor(r/3)!==Math.floor(e/3)&&Math.abs(t[r][e])<.001||n.push([r,e,t[r][e]]);return n}(t),e=n.map((function(){return 0})),o=U(n,X(r,e),-1),u=o.map((function(t){return t})),a=L(o,o),c=0;c<10;++c){var i=X(r,u),s=a/L(u,i);e=U(e,u,s),o=U(o,i,-s);var f=L(o,o);u=U(o,u,f/a),a=f}return e},K=function(){return{bots:[]}},Q=function(t){return function(n){return n.bots=t,n}},Z=1,$=function(t){Z=t},_=.1,tt=function(t){return 2/(1+Math.exp(Z*(t-1)))},nt=function(t){return q((r=t,k(y((n=t)[0]*r[0],n[0]*r[1],n[0]*r[2]),y(n[1]*r[0],n[1]*r[1],n[1]*r[2]),y(n[2]*r[0],n[2]*r[1],n[2]*r[2]))),tt(C(t))/E(t,t));var n,r},rt=function(t){return function(n){var r=1e-5,e=n[t],o=M(n);o[t]=e+r;var u=M(n);u[t]=e-r;var a=nt(o),c=nt(u);return q(I(a,c),1/2e-5)}},et=function(t,n){var r=S(n.pos,t.pos);return nt(r)},ot=function(t){return function(n){return function(r,e){if(r!==t&&e!==t)return k(y(0,0,0),y(0,0,0),y(0,0,0));var o=rt(n)(S(e.pos,r.pos));return r===t?o:q(o,-1)}}},ut=function(t){return function(n){return n.map((function(n,r){return t.bots[r].fixed?y(0,0,0):n}))}},at=function(t){return function(n){return n.map((function(n,r){return n.map((function(n,e){return t.bots[r].fixed||t.bots[e].fixed?k(y(0,0,0),y(0,0,0),y(0,0,0)):n}))}))}},ct=function(t){for(var n=t.bots.map((function(){return t.bots.map((function(){return k(y(0,0,0),y(0,0,0),y(0,0,0))}))})),r=0;r<t.bots.length;++r){var e=q(nt(y(t.bots[r].pos[1]+.5,0,0)),_),o=nt(y(0,t.bots[r].pos[1]+.5,0)),u=q(nt(y(0,0,t.bots[r].pos[1]+.5)),_);n[r][r]=F(n[r][r],e),n[r][r]=F(n[r][r],o),n[r][r]=F(n[r][r],u)}for(var a=0;a<t.bots.length;++a)for(var c=0;c<t.bots.length;++c)if(a!==c){var i=et(t.bots[a],t.bots[c]);n[a][a]=F(n[a][a],i),n[a][c]=I(n[a][c],i)}return at(t)(n)},it=function(t,n,r){return function(e){return e.bots.map((function(o,u){var a=B(S(e.bots[u].pos,t.bots[u].pos),r),c=B(S(n.bots[u].pos,e.bots[u].pos),r);return B(S(c,a),r)}))}},st=function(t,n,r){return function(e){var o=it(t,n,r)(e);return ut(e)(e.bots.map((function(t,n){return V(S(y(0,-1,0),o[n]),t.weight)})))}},ft=function(t,n,r){return function(e){var o=H(st(t,n,r)(e));return function(t,n){t=t.map((function(t){return t.map((function(t){return t}))})),n=n.map((function(t){return t}));for(var r=0;r<t.length;r+=3){for(var e=0,o=0;o<3;++o)for(var u=0;u<3;++u)e+=Math.pow(t[r+o][r+u],2);e=Math.sqrt(3/e);for(var a=0;a<3;++a){for(var c=0;c<t.length;++c)t[r+a][c]*=e;n[r+a]*=e}}return Y(t,n)}(function(t){var n,r=G(3*t.length,3*(null===(n=t[0])||void 0===n?void 0:n.length)||0);return t.map((function(n,e){return n.map((function(n,o){for(var u=0;u<3;++u)for(var a=0;a<3;++a)r[3*e+u][3*o+a]=t[e][o][u][a]}))})),r}(ct(e)),o)}},bt=function(t){for(var n=0;n<t.bots.length;++n)t.bots[n].fixed||(t.bots[n].pos[1]=Math.max(t.bots[n].pos[1],.5));for(var r=0;r<t.bots.length;++r)for(var e=r+1;e<t.bots.length;++e)if(!t.bots[r].fixed||!t.bots[e].fixed){var o=t.bots[r].fixed||t.bots[e].fixed,u=S(t.bots[e].pos,t.bots[r].pos),a=C(u);if(!(a>1)){var c=V(u,(1-a)/(o?1:2)/a);t.bots[r].fixed||(t.bots[r].pos=S(t.bots[r].pos,c)),t.bots[e].fixed||(t.bots[e].pos=A(t.bots[e].pos,c))}}return t},pt=function(t){for(var n=t,r=0;r<10;++r)n=bt(n);return n},lt=function(t,n,r){return function(e,o,u,a,c){return function(i){for(var s=Object(l.a)(Array(i.bots.length)).map((function(){return y(0,0,0)})),f=Object(l.a)(Array(i.bots.length)).map((function(){return[0,1,2].map((function(){return Object(l.a)(Array(i.bots.length)).map((function(){return y(0,0,0)}))}))})),b=0;b<i.bots.length;++b)for(var p=0;p<3;++p){var d=q(rt(p)(y(i.bots[b].pos[1]+.5,0,0)),_),v=rt(p)(y(0,i.bots[b].pos[1]+.5,0)),h=q(rt(p)(y(0,0,i.bots[b].pos[1]+.5)),_),m=y(n[3*b],n[3*b+1],n[3*b+2]);f[b][p][b]=A(f[b][p][b],D(F(F(d,v),h),m));for(var g=0;g<i.bots.length;++g)if(!(b>=g)){var j=ot(i.bots[b])(p)(i.bots[b],i.bots[g]),w=D(j,S(y(n[3*g],n[3*g+1],n[3*g+2]),m));f[b][p][b]=A(f[b][p][b],w),f[b][p][g]=S(f[b][p][g],w),f[g][p][g]=A(f[g][p][g],w),f[g][p][b]=S(f[g][p][b],w)}}for(var O=0;O<i.bots.length;++O)for(var x=0;x<3;++x){var M=H(ut(i)(f[O][x]));s[O][x]=-T(n,M)+(-t[3*O+x]+2*n[3*O+x]-r[3*O+x])/Math.pow(c,2)*2}for(var B=0;B<i.bots.length;++B)if(!(i.bots[B].pos[1]>.5)){var E=i.bots[B].pos[1]+.5;s[B][1]+=2*(E-2)*2e3}for(var P=0;P<i.bots.length;++P)for(var k=P+1;k<i.bots.length;++k){var I=S(i.bots[k].pos,i.bots[P].pos),W=C(I);W>1||(I=V(I,2*(W-2)/W*1e3),s[P]=S(s[P],I),s[k]=A(s[k],I))}for(var N=0;N<i.bots.length;++N){var R=V(e.bots[N].pos,2),z=V(o.bots[N].pos,-8),J=V(i.bots[N].pos,12),G=V(u.bots[N].pos,-8),L=V(a.bots[N].pos,2),U=A(A(A(A(R,z),J),G),L);s[N]=A(s[N],V(U,1e5/Math.pow(c,4)))}return s}}},dt=function(t,n){var r=K();return r.bots=t.bots.map((function(t,r){return J(t,n.bots[r])})),r},vt=function(t,n){for(var r=t.map((function(t){return t.bots.map((function(){return y(0,0,0)}))})),e=function(e){var o=(1+e*t.length/200)*t.length/10;$(o/(1+o)*4);var u=function(t,n){for(var r=Object(l.a)(Array(t.length)).map((function(){return Object(l.a)(Array(t[0].bots.length)).map((function(){return y(0,0,0)}))})),e=Object(l.a)(Array(t.length)).map((function(){return Object(l.a)(Array(3*t[0].bots.length)).map((function(){return 0}))})),o=0;o<t.length;++o){var u=t[Math.max(o-1,0)],a=t[Math.min(o+1,t.length-1)];e[o]=ft(u,a,n)(t[o])}for(var c=1;c<t.length-1;++c){var i=t[Math.max(c-2,0)],s=t[c-1],f=t[c+1],b=t[Math.min(c+2,t.length-1)];r[c]=lt(e[c-1],e[c],e[c+1])(i,s,f,b,n)(t[c])}return r}(t,n).map((function(t){return t.map((function(t){return V(t,-.02/(1e-4+C(t)))}))}));t.map((function(t,n){return t.bots.map((function(t,e){t.fixed||(r[n][e]=A(r[n][e],u[n][e]),r[n][e]=V(r[n][e],.9),t.pos=A(t.pos,r[n][e]))}))}))},o=0;o<200/t.length;++o)e(o)},ht=function(t){for(var n=Object(l.a)(Array(2*t.length-1)),r=0;r<t.length;++r)n[2*r]=t[r];for(var e=1;e<n.length-1;e+=2)n[e]=dt(n[e-1],n[e+1]);return n},mt=function(t,n,r){for(var e=[t,n],o=100,u=0;u<r;++u)o/=2,e=ht(e),vt(e,o);return e},gt=r(27),jt=function(t,n,r){return function(e){var o=new d.h;o.lookAt(Object(gt.a)(d.s,Object(l.a)(t)),Object(gt.a)(d.s,Object(l.a)(n)),(new d.k).up),o.multiply((new d.h).set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1)),e.setRotationFromMatrix(o),e.scale.set(r,C(S(n,t)),r);var u=B(A(t,n),2);return e.position.set(u[0],u[1],u[2]),e}},wt=function(t,n,r,e){var o=new d.d(1,1,1,8,1),u=new d.i(o,new d.j({color:e}));return jt(t,n,r)(u)},Ot=new(r(29).a)(123),xt=Object(h.a)((function(t){return{gridItem:{padding:t.spacing(2),textAlign:"center"}}})),yt=Object(x.a)(u.newWorld(),u.setBots([].concat(Object(l.a)(Object(l.a)(Array(10)).map((function(t,n){return[o.setPos(e.newVec3(-4,.5+n,0))(o.newBot()),o.setPos(e.newVec3(4,.5+n,0))(o.newBot())]})).flat()),[o.setPos(e.newVec3(-4,10.5,0))(o.newBot())]))),Mt=Object(x.a)(u.newWorld(),u.setBots([].concat(Object(l.a)(Object(l.a)(Array(10)).map((function(t,n){return[o.setPos(e.newVec3(-4,.5+n,0))(o.newBot()),o.setPos(e.newVec3(4,.5+n,0))(o.newBot())]})).flat()),[o.setPos(e.newVec3(4,10.5,0))(o.newBot())]))),At=function(){return e.multiplyScalar(e.newVec3(Ot.next()-.5,Ot.next()-.5,Ot.next()-.5),1e-4)};yt.bots.map((function(t){return t.pos=e.add(t.pos,At())})),Mt.bots.map((function(t){return t.pos=e.add(t.pos,At())}));var St=a.createAnimation(yt,Mt,8),Vt=St[0].bots.map((function(t){return function(t,n){var r,e=new d.o(1,16,16);e.computeVertexNormals(),e.faces.forEach((function(t){return t.vertexColors=new Array(3).fill(!0).map((function(){return n}))}));var o=(new d.b).fromGeometry(e);delete o.attributes.uv;var u=new d.i(o,new d.j({color:n}));return u.geometry=o,(r=u.position).set.apply(r,Object(l.a)(t)),u.scale.set(.5,.5,.5),u}(t.pos,t.fixed?new d.c(0,0,1):new d.c(0,1,0))})),Bt=St[0].bots.map((function(t){return wt(t.pos,e.newVec3(t.pos[0],0,t.pos[2]),1,new d.c(1,0,0))})),Et=St[0].bots.map((function(t){return St[0].bots.map((function(n){return wt(t.pos,n.pos,1,new d.c(1,0,0))}))})),Ct=function(){var t=new d.n;t.add(new d.a(16777215,.4));var n=new d.e(16777215,.4);return n.position.set(0,1,0),t.add(n),t}();Vt.map((function(t){return Ct.add(t)})),Bt.map((function(t){return Ct.add(t)})),Et.map((function(t,n){return t.map((function(t,r){n>=r||Ct.add(t)}))}));var Pt=function(t){St[t].bots.map((function(t,n){var r;(r=Vt[n].position).set.apply(r,Object(l.a)(t.pos))})),St[t].bots.map((function(t,n){Ct.remove(Bt[n]);var r=u.edgeStrength(t.pos[1]+.5);r<.01||(Ct.add(Bt[n]),jt(t.pos,e.newVec3(t.pos[0],0,t.pos[2]),.3*Math.sqrt(r))(Bt[n]))})),St[t].bots.map((function(n,r){return St[t].bots.map((function(t,o){if(!(r>=o)){Ct.remove(Et[r][o]);var a=u.edgeStrength(e.length(e.sub(t.pos,n.pos)));a<.01||(Ct.add(Et[r][o]),jt(n.pos,t.pos,.3*Math.sqrt(a))(Et[r][o]))}}))}))},kt=function(){var t=Object(O.a)(),n=Object(p.a)(t,2),r=n[0],e=n[1],o=.55*r,u=.9*e,a=xt(),s=Object(i.useRef)(null),f=Object(i.useState)(),b=Object(p.a)(f,2),l=b[0],h=b[1],x=Object(i.useState)(),y=Object(p.a)(x,2),M=y[0],A=y[1],S=Object(i.useState)(),V=Object(p.a)(S,2),B=V[0],E=V[1],C=Object(i.useState)(0),P=Object(p.a)(C,2),k=P[0],F=P[1],I=Object(i.useState)(0),q=Object(p.a)(I,2),D=q[0],W=q[1],N=Object(i.useState)(!1),R=Object(p.a)(N,2),z=R[0],J=R[1];return Object(i.useEffect)((function(){var t=s.current;if(t){var n=new d.l(75,o/u,.1,1e3);n.position.set(10,10,10),n.lookAt(0,0,0),A(n);var r=new d.t({antialias:!0});r.setClearColor("#000000"),r.setSize(o,u),t.appendChild(r.domElement),E(r);var e=new v.a(n,r.domElement);e.enableDamping=!0,e.dampingFactor=.5,h(e);var a=window.setInterval((function(){return F((function(t){return t+1}))}),1e3/30);return function(){window.clearInterval(a),t.removeChild(r.domElement)}}}),[s,o,u]),Object(i.useEffect)((function(){l&&l.update(),B&&M&&B.render(Ct,M)}),[l,B,M,k]),Object(i.useEffect)((function(){var t=Math.round(.1*St.length),n=D%(2*(St.length+t));n<t?Pt(0):(n-=t)<St.length?Pt(n):(n-=St.length)<t?Pt(St.length-1):(n-=t,Pt(St.length-1-n))}),[D]),Object(i.useEffect)((function(){if(z){var t=setInterval((function(){return W((function(t){return t+1}))}),10);return function(){return clearInterval(t)}}}),[z]),Object(c.jsx)(c.Fragment,{children:Object(c.jsxs)(m.a,{container:!0,item:!0,xs:11,children:[Object(c.jsx)(m.a,{item:!0,xs:4,style:{height:.9*window.innerHeight,overflowX:"hidden",overflowY:"scroll"},children:Object(c.jsx)(m.a,{container:!0,direction:"column",children:Object(c.jsx)(m.a,{item:!0,className:a.gridItem,children:Object(c.jsx)(g.a,{children:Object(c.jsxs)(j.a,{children:[Object(c.jsx)(w.a,{children:Object(c.jsx)("b",{children:"Microbots"})}),Object(c.jsx)(w.a,{children:Object(c.jsxs)("button",{onClick:function(){return W(D+1)},children:["Time: ",D]})}),Object(c.jsx)(w.a,{children:Object(c.jsxs)("button",{onClick:function(){return J(!z)},children:["Animating: ",z?"true":"false"]})}),Object(c.jsx)(w.a,{children:Object(c.jsx)("button",{onClick:function(){return function(){var t=document.getElementsByTagName("canvas")[0].toDataURL("image/png"),n=document.createElement("a");n.href=t.replace(/^data:image\/[^;]/,"data:application/octet-stream"),n.download="image.png",n.click()}()},children:"Save screenshot"})})]})})})})}),Object(c.jsx)(m.a,{item:!0,xs:5,children:Object(c.jsx)("div",{ref:s})})]})})};b.a.render(Object(c.jsx)(s.a.StrictMode,{children:Object(c.jsx)(kt,{})}),document.getElementById("root"))}},[[46,1,2]]]);
//# sourceMappingURL=main.16ae81a1.chunk.js.map