(this.webpackJsonpmicrobots=this.webpackJsonpmicrobots||[]).push([[0],{45:function(t,n,e){"use strict";e.r(n);var r={};e.r(r),e.d(r,"newVec3",(function(){return w})),e.d(r,"clone",(function(){return S})),e.d(r,"add",(function(){return y})),e.d(r,"sub",(function(){return M})),e.d(r,"multiplyScalar",(function(){return A})),e.d(r,"divideScalar",(function(){return E})),e.d(r,"dot",(function(){return C})),e.d(r,"length",(function(){return k})),e.d(r,"normalize",(function(){return I}));var o={};e.r(o),e.d(o,"newBot",(function(){return W})),e.d(o,"setPos",(function(){return D})),e.d(o,"setWeight",(function(){return F})),e.d(o,"setFixed",(function(){return G})),e.d(o,"average",(function(){return P}));var a={};e.r(a),e.d(a,"newWorld",(function(){return U})),e.d(a,"setBots",(function(){return X})),e.d(a,"setSlack",(function(){return Q})),e.d(a,"edgeStrength",(function(){return $})),e.d(a,"edgeStrengthGround",(function(){return _})),e.d(a,"stiffness",(function(){return tt})),e.d(a,"stiffnessGround",(function(){return nt})),e.d(a,"stiffnessDerivative",(function(){return et})),e.d(a,"stiffnessPair",(function(){return rt})),e.d(a,"stiffnessPairDerivative",(function(){return ot})),e.d(a,"stiffnessMatrix",(function(){return at})),e.d(a,"forceMatrix",(function(){return ut})),e.d(a,"displacement",(function(){return ct})),e.d(a,"resolveCollisionStep",(function(){return it})),e.d(a,"resolveCollision",(function(){return st})),e.d(a,"gradient",(function(){return ft}));var u={};e.r(u),e.d(u,"createAnimation",(function(){return pt}));var c=e(3),i=e(0),s=e.n(i),f=e(11),b=e.n(f),l=e(5),d=e(6),p=e(2),h=e(27),j=e(60),v=e(62),m=e(63),O=e(64),g=e(65),x=e(33),w=function(t,n,e){return[t,n,e]},S=function(t){return[t[0],t[1],t[2]]},y=function(t,n){return[t[0]+n[0],t[1]+n[1],t[2]+n[2]]},M=function(t,n){return[t[0]-n[0],t[1]-n[1],t[2]-n[2]]},A=function(t,n){return[t[0]*n,t[1]*n,t[2]*n]},E=function(t,n){return[t[0]/n,t[1]/n,t[2]/n]},C=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]},k=function(t){return Math.sqrt(C(t,t))},I=function(t){return E(t,k(t))},B=function(t,n,e){return[t,n,e]},V=function(t,n){return[y(t[0],n[0]),y(t[1],n[1]),y(t[2],n[2])]},q=function(t,n){return[A(t[0],n),A(t[1],n),A(t[2],n)]},N=function(t,n){return[C(t[0],n),C(t[1],n),C(t[2],n)]},W=function(){return{pos:w(0,0,0),weight:1,fixed:!1}},D=function(t){return function(n){return n.pos=t,n}},F=function(t){return function(n){return n.weight=t,n}},G=function(t){return function(n){return n.fixed=t,n}},P=function(t,n){var e=W();return e.pos=E(y(t.pos,n.pos),2),e.weight=(t.weight+n.weight)/2,e.fixed=t.fixed||n.fixed,e},R=function(t,n){t.length!==n.length&&function(){throw new Error("Vectors need to be the same length")}();for(var e=0,r=0;r<t.length;++r)e+=t[r]*n[r];return e},T=function(t,n){return B(w(t[0]*n[0],t[0]*n[1],t[0]*n[2]),w(t[1]*n[0],t[1]*n[1],t[1]*n[2]),w(t[2]*n[0],t[2]*n[1],t[2]*n[2]))},z=function(t,n){for(var e=0,r=0;r<t.length;++r)e+=t[r]*n[r];return e},J=function(t,n,e){return t.map((function(t,r){return t+n[r]*e}))},H=function(t,n){for(var e=n.map((function(){return 0})),r=0;r<t.length;++r){var o=t[r][0],a=t[r][1],u=t[r][2];e[o]+=u*n[a]}return e},L=function(t,n){var e=function(t,n){n=n.map((function(t){return t}));for(var e=Object(l.a)(Array(n.length/3)).map((function(){return 0})),r=0;r<t.length;++r){var o=Object(d.a)(t[r],3),a=o[0],u=o[1],c=o[2];Math.floor(a/3)===Math.floor(u/3)&&(e[Math.floor(a/3)]+=c)}e.map((function(t,n){return e[n]=Math.sqrt(3/t)}));for(var i=0;i<t.length;++i)t[i][2]*=e[Math.floor(t[i][0]/3)];for(var s=0;s<n.length;++s)n[s]*=e[Math.floor(s/3)];return[t,n]}(t,n);return function(t,n){for(var e=n.map((function(){return 0})),r=J(n,H(t,e),-1),o=r.map((function(t){return t})),a=z(r,r),u=0;u<10;++u){var c=H(t,o),i=a/z(o,c);e=J(e,o,i),r=J(r,c,-i);var s=z(r,r);o=J(r,o,s/a),a=s}return e}(e[0],e[1])},U=function(){return{bots:[]}},X=function(t){return function(n){return n.bots=t,n}},Y=1.5,K=2,Q=function(t){K=t},Z=.1,$=function(t){return t<Y-K/2?1:t>Y+K/2?0:2*(t+K-Y)*Math.pow(Y+K/2-t,2)/Math.pow(K,3)},_=function(t){return $(t)+1e-4},tt=function(t){var n=k(t);return t=A(t,Math.sqrt($(n))/n),T(t,t)},nt=function(t){return q(T(t,t),_(k(t))/C(t,t))},et=function(t){return function(n){var e=1e-5,r=n[t],o=S(n);o[t]=r+e;var a=S(n);a[t]=r-e;var u,c,i=tt(o),s=tt(a);return q((c=s,[M((u=i)[0],c[0]),M(u[1],c[1]),M(u[2],c[2])]),1/2e-5)}},rt=function(t,n){var e=M(n.pos,t.pos);return tt(e)},ot=function(t){return function(n){return function(e,r){if(e!==t&&r!==t)return B(w(0,0,0),w(0,0,0),w(0,0,0));var o=et(n)(M(r.pos,e.pos));return e===t?o:q(o,-1)}}},at=function(t){for(var n=[],e=0;e<t.bots.length;++e)for(var r=q(nt(w(t.bots[e].pos[1]+.5,0,0)),Z),o=nt(w(0,t.bots[e].pos[1]+.5,0)),a=q(nt(w(0,0,t.bots[e].pos[1]+.5)),Z),u=V(V(r,o),a),c=0;c<3;++c)for(var i=0;i<3;++i)n.push([3*e+c,3*e+i,u[c][i]]);for(var s=0;s<t.bots.length;++s)for(var f=0;f<t.bots.length;++f)if(s!==f&&!(k(M(t.bots[s].pos,t.bots[f].pos))>Y+K/2)){for(var b=rt(t.bots[s],t.bots[f]),l=0;l<3;++l)for(var d=0;d<3;++d)n[9*s+3*l+d][2]+=b[l][d];for(var p=0;p<3;++p)for(var h=0;h<3;++h)n.push([3*s+p,3*f+h,-b[p][h]])}return n},ut=function(t,n,e){return function(r){var o=Object(l.a)(Array(3*r.bots.length)).map((function(){return 0}));return r.bots.forEach((function(a,u){for(var c=0;c<3;++c){var i=(r.bots[u].pos[c]-t.bots[u].pos[c])/e,s=((n.bots[u].pos[c]-r.bots[u].pos[c])/e-i)/e;o[3*u+c]=((1===c?-1:0)-s)*a.weight}})),o}},ct=function(t,n,e){return function(r){var o=ut(t,n,e)(r),a=at(r);return L(a,o)}},it=function(t){for(var n=0;n<t.bots.length;++n)t.bots[n].fixed||(t.bots[n].pos[1]=Math.max(t.bots[n].pos[1],.5));for(var e=0;e<t.bots.length;++e)for(var r=e+1;r<t.bots.length;++r)if(!t.bots[e].fixed||!t.bots[r].fixed){var o=t.bots[e].fixed||t.bots[r].fixed,a=M(t.bots[r].pos,t.bots[e].pos),u=k(a);if(!(u>1)){var c=A(a,(1-u)/(o?1:2)/u);t.bots[e].fixed||(t.bots[e].pos=M(t.bots[e].pos,c)),t.bots[r].fixed||(t.bots[r].pos=y(t.bots[r].pos,c))}}return t},st=function(t){for(var n=t,e=0;e<10;++e)n=it(n);return n},ft=function(t,n,e){return function(r,o,a,u,c){return function(i){for(var s=Object(l.a)(Array(i.bots.length)).map((function(){return w(0,0,0)})),f=Object(l.a)(Array(i.bots.length)).map((function(){return[0,1,2].map((function(){return Object(l.a)(Array(3*i.bots.length)).map((function(){return 0}))}))})),b=0;b<i.bots.length;++b)for(var d=0;d<3;++d){for(var p=q(et(d)(w(i.bots[b].pos[1]+.5,0,0)),Z),h=et(d)(w(0,i.bots[b].pos[1]+.5,0)),j=q(et(d)(w(0,0,i.bots[b].pos[1]+.5)),Z),v=w(n[3*b],n[3*b+1],n[3*b+2]),m=N(V(V(p,h),j),v),O=0;O<3;++O)f[b][d][3*b+O]+=m[O];for(var g=b+1;g<i.bots.length;++g)if(!(k(M(i.bots[g].pos,i.bots[b].pos))>Y+K/2))for(var x=ot(i.bots[b])(d)(i.bots[b],i.bots[g]),S=N(x,M(w(n[3*g],n[3*g+1],n[3*g+2]),v)),E=0;E<3;++E)f[b][d][3*b+E]+=S[E],f[b][d][3*g+E]-=S[E],f[g][d][3*g+E]+=S[E],f[g][d][3*b+E]-=S[E]}for(var C=0;C<i.bots.length;++C)for(var I=0;I<3;++I){var B=f[C][I];s[C][I]=-R(n,B)+(-t[3*C+I]+2*n[3*C+I]-e[3*C+I])/Math.pow(c,2)*2}for(var W=0;W<i.bots.length;++W)if(!(i.bots[W].pos[1]>.5)){var D=i.bots[W].pos[1]+.5;s[W][1]+=2*(D-2)*2e3}for(var F=0;F<i.bots.length;++F)for(var G=F+1;G<i.bots.length;++G){var P=M(i.bots[G].pos,i.bots[F].pos),T=k(P);T>1||(P=A(P,2*(T-2)/T*1e3),s[F]=M(s[F],P),s[G]=y(s[G],P))}for(var z=0;z<i.bots.length;++z){var J=A(r.bots[z].pos,2),H=A(o.bots[z].pos,-8),L=A(i.bots[z].pos,12),U=A(a.bots[z].pos,-8),X=A(u.bots[z].pos,2),Q=y(y(y(y(J,H),L),U),X);s[z]=y(s[z],A(Q,1e5/Math.pow(c,4)))}return s}}},bt=function(t,n){var e=U();return e.bots=t.bots.map((function(t,e){return P(t,n.bots[e])})),e},lt=function(t,n){for(var e=t.map((function(t){return t.bots.map((function(){return w(0,0,0)}))})),r=function(r){var o=(1+r*t.length/500)*t.length/10;Q(2/o);var a=function(t,n){for(var e=Object(l.a)(Array(t.length)).map((function(){return Object(l.a)(Array(t[0].bots.length)).map((function(){return w(0,0,0)}))})),r=Object(l.a)(Array(t.length)).map((function(){return Object(l.a)(Array(3*t[0].bots.length)).map((function(){return 0}))})),o=0;o<t.length;++o){var a=t[Math.max(o-1,0)],u=t[Math.min(o+1,t.length-1)];r[o]=ct(a,u,n)(t[o])}for(var c=1;c<t.length-1;++c){var i=t[Math.max(c-2,0)],s=t[c-1],f=t[c+1],b=t[Math.min(c+2,t.length-1)];e[c]=ft(r[c-1],r[c],r[c+1])(i,s,f,b,n)(t[c])}return e}(t,n).map((function(t){return t.map((function(t){return A(t,-.02/(1e-4+k(t)))}))}));t.map((function(t,n){return t.bots.map((function(t,r){t.fixed||(e[n][r]=y(e[n][r],a[n][r]),e[n][r]=A(e[n][r],.9),t.pos=y(t.pos,e[n][r]))}))}))},o=0;o<500/t.length;++o)r(o)},dt=function(t){for(var n=Object(l.a)(Array(2*t.length-1)),e=0;e<t.length;++e)n[2*e]=t[e];for(var r=1;r<n.length-1;r+=2)n[r]=bt(n[r-1],n[r+1]);return n},pt=function(t,n,e){for(var r=[t,n],o=100,a=0;a<e;++a)o/=2,r=dt(r),lt(r,o);return r},ht=e(26),jt=function(){var t=new p.n;t.add(new p.a(16777215,.4));var n=new p.e(16777215,.4);return n.position.set(0,1,0),t.add(n),t},vt=function(t,n,e){return function(r){var o=new p.h;o.lookAt(Object(ht.a)(p.s,Object(l.a)(t)),Object(ht.a)(p.s,Object(l.a)(n)),(new p.k).up),o.multiply((new p.h).set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1)),r.setRotationFromMatrix(o),r.scale.set(e,k(M(n,t)),e);var a=E(y(t,n),2);return r.position.set(a[0],a[1],a[2]),r}},mt=function(t,n,e,r){var o=new p.d(1,1,1,8,1),a=new p.i(o,new p.j({color:r}));return vt(t,n,e)(a)},Ot=e(28),gt=[{title:"Towers",data:[[[2,.5,0],[2,1.5,0],[2,2.5,0],[2,3.5,0],[2,4.5,0],[-2,.5,0],[-2,1.5,0],[-2,2.5,0],[-2,3.5,0],[-2,4.5,0],[2,5.5,0]],[[2,.5,0],[2,1.5,0],[2,2.5,0],[2,3.5,0],[2,4.5,0],[-2,.5,0],[-2,1.5,0],[-2,2.5,0],[-2,3.5,0],[-2,4.5,0],[-2,5.5,0]]]},{title:"Stack",data:[[[0,.5,0],[0,1.5,0],[0,2.5,0],[0,3.5,0],[0,4.5,0]],[[0,.5,0],[1,.5,0],[2,.5,0],[3,.5,0],[4,.5,0]]]},{title:"Cube",data:[[[-.5,.5,-.5],[.5,.5,-.5],[.5,.5,.5],[-.5,.5,.5],[-.5,1.5,-.5],[.5,1.5,-.5],[.5,1.5,.5],[-.5,1.5,.5],[-.5,2.5,-.5],[.5,2.5,-.5],[.5,2.5,.5],[-.5,2.5,.5],[-.5,3.5,-.5],[.5,3.5,-.5],[.5,3.5,.5],[-.5,3.5,.5]],[[-1.5,.5,-1.5],[-.5,.5,-1.5],[.5,.5,-1.5],[1.5,.5,-1.5],[-1.5,.5,-.5],[-.5,.5,-.5],[.5,.5,-.5],[1.5,.5,-.5],[-1.5,.5,.5],[-.5,.5,.5],[.5,.5,.5],[1.5,.5,.5],[-1.5,.5,1.5],[-.5,.5,1.5],[.5,.5,1.5],[1.5,.5,1.5]]]},{title:"Big cube",data:[Object(l.a)(Array(8)).map((function(t,n){return Object(l.a)(Array(8)).map((function(t,e){return[n-3.5,.5,e-3.5]}))})).flat(),Object(l.a)(Array(4)).map((function(t,n){return Object(l.a)(Array(4)).map((function(t,e){return Object(l.a)(Array(4)).map((function(t,r){return[n-1.5,r+.5,e-1.5]}))}))})).flat().flat()]}],xt=function(t,n){return a.setBots(gt[t].data[n].map((function(t){return o.setPos(r.newVec3(t[0],t[1],t[2]))(o.newBot())})))(a.newWorld())},wt=new Ot.a(123),St=Object(j.a)((function(t){return{gridItem:{padding:t.spacing(2),textAlign:"center"}}})),yt=function(){var t=Object(x.a)(),n=Object(d.a)(t,2),e=n[0],o=n[1],s=.55*e,f=.9*o,b=St(),j=Object(i.useRef)(null),w=Object(i.useState)(),S=Object(d.a)(w,2),y=S[0],M=S[1],A=Object(i.useState)(),E=Object(d.a)(A,2),C=E[0],k=E[1],I=Object(i.useState)(),B=Object(d.a)(I,2),V=B[0],q=B[1],N=Object(i.useState)(0),W=Object(d.a)(N,2),D=W[0],F=W[1],G=Object(i.useState)(0),P=Object(d.a)(G,2),R=P[0],T=P[1],z=Object(i.useState)(!1),J=Object(d.a)(z,2),H=J[0],L=J[1],U=Object(i.useState)(jt()),X=Object(d.a)(U,2),Y=X[0],K=X[1],Q=Object(i.useState)([]),Z=Object(d.a)(Q,2),$=Z[0],_=Z[1],tt=Object(i.useState)([]),nt=Object(d.a)(tt,2),et=nt[0],rt=nt[1],ot=Object(i.useState)([]),at=Object(d.a)(ot,2),ut=at[0],ct=at[1],it=Object(i.useState)([]),st=Object(d.a)(it,2),ft=st[0],bt=st[1],lt=Object(i.useState)(a.newWorld()),dt=Object(d.a)(lt,2),pt=dt[0],ht=dt[1],Ot=Object(i.useState)(a.newWorld()),yt=Object(d.a)(Ot,2),Mt=yt[0],At=yt[1],Et=function(t){ft[t].bots.map((function(t,n){var e;(e=$[n].position).set.apply(e,Object(l.a)(t.pos))})),ft[t].bots.map((function(t,n){Y.remove(et[n]);var e=a.edgeStrength(t.pos[1]+.5);e<.01||(Y.add(et[n]),vt(t.pos,r.newVec3(t.pos[0],0,t.pos[2]),.3*Math.sqrt(e))(et[n]))})),ft[t].bots.map((function(n,e){return ft[t].bots.map((function(t,o){if(!(e>=o)){Y.remove(ut[e][o]);var u=a.edgeStrength(r.length(r.sub(t.pos,n.pos)));u<.01||(Y.add(ut[e][o]),vt(n.pos,t.pos,.3*Math.sqrt(u))(ut[e][o]))}}))}))};return Object(i.useEffect)((function(){0!==ft.length&&(_(ft[0].bots.map((function(t){return function(t,n){var e,r=new p.o(1,16,16);r.computeVertexNormals(),r.faces.forEach((function(t){return t.vertexColors=new Array(3).fill(!0).map((function(){return n}))}));var o=(new p.b).fromGeometry(r);delete o.attributes.uv;var a=new p.i(o,new p.j({color:n}));return a.geometry=o,(e=a.position).set.apply(e,Object(l.a)(t)),a.scale.set(.5,.5,.5),a}(t.pos,t.fixed?new p.c(0,0,1):new p.c(0,1,0))}))),rt(ft[0].bots.map((function(t){return mt(t.pos,r.newVec3(t.pos[0],0,t.pos[2]),1,new p.c(1,0,0))}))),ct(ft[0].bots.map((function(t){return ft[0].bots.map((function(n){return mt(t.pos,n.pos,1,new p.c(1,0,0))}))}))))}),[ft]),Object(i.useEffect)((function(){var t=jt();$.map((function(n){return t.add(n)})),et.map((function(n){return t.add(n)})),ut.map((function(n,e){return n.map((function(n,r){e>=r||t.add(n)}))})),K(t)}),[$,et,ut]),Object(i.useEffect)((function(){var t=j.current;if(t){var n=new p.l(75,s/f,.1,1e3);n.position.set(10,10,10),n.lookAt(0,0,0),k(n);var e=new p.t({antialias:!0});e.setClearColor("#000000"),e.setSize(s,f),t.appendChild(e.domElement),q(e);var r=new h.a(n,e.domElement);r.enableDamping=!0,r.dampingFactor=.5,M(r);var o=window.setInterval((function(){return F((function(t){return t+1}))}),1e3/30);return function(){window.clearInterval(o),t.removeChild(e.domElement)}}}),[j,s,f]),Object(i.useEffect)((function(){y&&y.update(),V&&C&&Y&&V.render(Y,C)}),[y,V,C,D,Y]),Object(i.useEffect)((function(){if(0!==$.length){var t=Math.round(.1*ft.length),n=R%(2*(ft.length+t));n<t?Et(0):(n-=t)<ft.length?Et(n):(n-=ft.length)<t?Et(ft.length-1):(n-=t,Et(ft.length-1-n))}}),[R,Y]),Object(i.useEffect)((function(){if(H){var t=setInterval((function(){return T((function(t){return t+1}))}),10);return function(){return clearInterval(t)}}}),[H]),Object(c.jsx)(c.Fragment,{children:Object(c.jsxs)(v.a,{container:!0,item:!0,xs:11,children:[Object(c.jsx)(v.a,{item:!0,xs:4,style:{height:.9*window.innerHeight,overflowX:"hidden",overflowY:"scroll"},children:Object(c.jsxs)(v.a,{container:!0,direction:"column",children:[Object(c.jsx)("b",{children:"Microbots"}),Object(c.jsx)(v.a,{item:!0,className:b.gridItem,children:Object(c.jsx)(m.a,{children:Object(c.jsxs)(O.a,{children:[Object(c.jsx)(g.a,{children:Object(c.jsx)("b",{children:"Select an example"})}),gt.map((function(t,n){return Object(c.jsx)(g.a,{children:Object(c.jsx)("button",{onClick:function(){var t,e=[xt(t=n,0),xt(t,1)],o=Object(d.a)(e,2),a=o[0],u=o[1],c=function(){return r.multiplyScalar(r.newVec3(wt.next()-.5,wt.next()-.5,wt.next()-.5),1e-4)};a.bots.map((function(t){return t.pos=r.add(t.pos,c())})),u.bots.map((function(t){return t.pos=r.add(t.pos,c())})),ht(a),At(u),bt([a,u]),L(!1)},children:t.title})},n)}))]})})}),Object(c.jsx)(v.a,{item:!0,className:b.gridItem,children:Object(c.jsx)(m.a,{children:Object(c.jsxs)(O.a,{children:[Object(c.jsx)(g.a,{children:Object(c.jsx)("b",{children:"Compute the animation"})}),Object(c.jsx)(g.a,{children:Object(c.jsx)("button",{onClick:function(){bt(u.createAnimation(pt,Mt,8)),L(!0)},children:"Generate animation"})})]})})}),Object(c.jsx)(v.a,{item:!0,className:b.gridItem,children:Object(c.jsx)(m.a,{children:Object(c.jsxs)(O.a,{children:[Object(c.jsx)(g.a,{children:Object(c.jsx)("b",{children:"Extra options"})}),Object(c.jsx)(g.a,{children:Object(c.jsxs)("button",{onClick:function(){return T(R+1)},children:["Time: ",R]})}),Object(c.jsx)(g.a,{children:Object(c.jsxs)("button",{onClick:function(){return L(!H)},children:["Animate: ",H?"true":"false"]})}),Object(c.jsx)(g.a,{children:Object(c.jsx)("button",{onClick:function(){return function(){var t=document.getElementsByTagName("canvas")[0].toDataURL("image/png"),n=document.createElement("a");n.href=t.replace(/^data:image\/[^;]/,"data:application/octet-stream"),n.download="image.png",n.click()}()},children:"Save screenshot"})})]})})})]})}),Object(c.jsx)(v.a,{item:!0,xs:5,children:Object(c.jsx)("div",{ref:j})})]})})};b.a.render(Object(c.jsx)(s.a.StrictMode,{children:Object(c.jsx)(yt,{})}),document.getElementById("root"))}},[[45,1,2]]]);
//# sourceMappingURL=main.b4affd5e.chunk.js.map