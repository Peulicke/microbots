(this.webpackJsonpmicrobots=this.webpackJsonpmicrobots||[]).push([[0],{50:function(t,n,r){"use strict";r.r(n);var e={};r.r(e),r.d(e,"newVec3",(function(){return x})),r.d(e,"clone",(function(){return M})),r.d(e,"add",(function(){return A})),r.d(e,"addEq",(function(){return V})),r.d(e,"sub",(function(){return S})),r.d(e,"subEq",(function(){return E})),r.d(e,"multiplyScalar",(function(){return k})),r.d(e,"dot",(function(){return B})),r.d(e,"length",(function(){return C})),r.d(e,"dist",(function(){return I})),r.d(e,"normalize",(function(){return q})),r.d(e,"dir",(function(){return D}));var o={};r.r(o),r.d(o,"newBot",(function(){return F})),r.d(o,"average",(function(){return G}));var a={};r.r(a),r.d(a,"newWorld",(function(){return nt})),r.d(a,"setBots",(function(){return rt})),r.d(a,"setSlack",(function(){return at})),r.d(a,"setOffset",(function(){return it})),r.d(a,"edgeStrength",(function(){return ct})),r.d(a,"edgeStrengthGround",(function(){return ut})),r.d(a,"displacement",(function(){return vt})),r.d(a,"neighbors",(function(){return pt})),r.d(a,"gradient",(function(){return bt})),r.d(a,"connections",(function(){return jt}));var i={};r.r(i),r.d(i,"createAnimation",(function(){return yt}));var c=r(4),u=r(0),s=r.n(u),f=r(13),l=r.n(f),h=r(3),v=r(8),p=r(2),b=r(32),d=r(65),j=r(67),g=r(68),m=r(69),w=r(71),O=r(72),y=r(37),x=function(t,n,r){return[t,n,r]},M=function(t){return[t[0],t[1],t[2]]},A=function(t,n){return[t[0]+n[0],t[1]+n[1],t[2]+n[2]]},V=function(t,n){t[0]+=n[0],t[1]+=n[1],t[2]+=n[2]},S=function(t,n){return[t[0]-n[0],t[1]-n[1],t[2]-n[2]]},E=function(t,n){t[0]-=n[0],t[1]-=n[1],t[2]-=n[2]},k=function(t,n){return[t[0]*n,t[1]*n,t[2]*n]},B=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]},C=function(t){return Math.sqrt(B(t,t))},I=function(t,n){return C(S(t,n))},q=function(t){return k(t,1/C(t))},D=function(t,n){return q(S(t,n))},N=function(t,n){for(var r=0;r<3;++r)for(var e=0;e<3;++e)t[r][e]+=n[r][e]},P=function(t,n){for(var r=0;r<3;++r)for(var e=0;e<3;++e)t[r][e]*=n},T=function(t,n){for(var r=[0,0,0],e=0;e<3;++e)for(var o=0;o<3;++o)r[e]+=t[e][o]*n[o];return r},W=r(30),F=function(t){return{pos:t.pos||x(0,0,0),target:t.target||function(){},weight:t.weight||1}},G=function(t,n,r,e){var o=(r+e)/2,a=t.target(o);if(void 0===a){var i,c,u,s;for(u=o;u>=r&&void 0===(i=t.target(u));u-=.01);for(s=o;s<=e&&void 0===(c=t.target(s));s+=.01);if(void 0===i&&void 0===c&&(a=k(A(t.pos,n.pos),.5)),void 0===i&&void 0!==c){var f=s-r;a=k(A(k(t.pos,s-o),k(c,o-r)),1/f)}if(void 0!==i&&void 0===c){var l=e-u;a=k(A(k(i,e-o),k(n.pos,o-u)),1/l)}if(void 0!==i&&void 0!==c){var h=s-u;a=k(A(k(i,s-o),k(c,o-u)),1/h)}}return F(Object(W.a)(Object(W.a)({},t),{},{pos:a}))},R=function(t,n){return r=x(t[0]*n[0],t[0]*n[1],t[0]*n[2]),e=x(t[1]*n[0],t[1]*n[1],t[1]*n[2]),o=x(t[2]*n[0],t[2]*n[1],t[2]*n[2]),[r,e,o];var r,e,o},z=function(t,n){for(var r=0;r<t.length;++r)n[r]=t[r]},J=function(t,n){for(var r=0,e=0;e<t.length;++e)r+=t[e]*n[e];return r},H=function(t,n,r){for(var e=0;e<t.length;++e)t[e]+=n[e]*r},L=function(t,n,r){for(var e=0;e<r.length;++e)r[e]=0;for(var o=0;o<t.length;++o)for(var a=0;a<t[o].length;++a){var i=t[o][a][0],c=t[o][a][1];r[o]+=c*n[i],o!==i&&(r[i]+=c*n[o])}},U=function(t,n){for(var r=0;r<n.length;++r)n[r]*=t[Math.floor(r/3)]},X=function(t,n){var r=Array(n.length);z(n,r);var e=function(t,n){for(var r=Array(n.length/3).fill(0),e=0;e<t.length;++e)for(var o=0;o<t[e].length;++o){var a=Object(v.a)(t[e][o],2),i=a[0],c=a[1];Math.floor(e/3)===Math.floor(i/3)&&(r[Math.floor(e/3)]+=c,e!==i&&(r[Math.floor(i/3)]+=c))}for(var u=0;u<r.length;++u)r[u]=Math.sqrt(Math.sqrt(3/r[u]));return r}(t,r);!function(t,n){for(var r=0;r<n.length;++r)for(var e=0;e<n[r].length;++e){var o=n[r][e][0];n[r][e][1]*=t[Math.floor(r/3)],n[r][e][1]*=t[Math.floor(o/3)]}}(e,t),U(e,r);var o=function(t,n){var r=Array(n.length).fill(0),e=Array(n.length);z(n,e);var o=Array(n.length);L(t,r,o),H(e,o,-1);var a=Array(e.length),i=Array(a.length);z(e,a);for(var c=J(e,e),u=0;u<20;++u){L(t,a,o);var s=c/J(a,o);H(r,a,s),H(e,o,-s);var f=J(e,e);z(a,i),z(e,a),H(a,i,f/c),c=f}return r}(t,r);return U(e,o),o},Y=function(t){return((t[3][1]*t[4][0]-t[4][1]*t[3][0])*t[2][2]+(t[2][1]*t[4][0]-t[4][1]*t[2][0])*-t[3][2]+(t[2][1]*t[3][0]-t[3][1]*t[2][0])*t[4][2])*t[1][3]+((t[3][1]*t[4][0]-t[4][1]*t[3][0])*t[1][2]+(t[1][1]*t[4][0]-t[4][1]*t[1][0])*-t[3][2]+(t[1][1]*t[3][0]-t[3][1]*t[1][0])*t[4][2])*-t[2][3]+((t[2][1]*t[4][0]-t[4][1]*t[2][0])*t[1][2]+(t[1][1]*t[4][0]-t[4][1]*t[1][0])*-t[2][2]+(t[1][1]*t[2][0]-t[2][1]*t[1][0])*t[4][2])*t[3][3]+((t[2][1]*t[3][0]-t[3][1]*t[2][0])*t[1][2]+(t[1][1]*t[3][0]-t[3][1]*t[1][0])*-t[2][2]+(t[1][1]*t[2][0]-t[2][1]*t[1][0])*t[3][2])*-t[4][3]+((t[3][1]*t[4][0]-t[4][1]*t[3][0])*t[1][2]+(t[1][1]*t[4][0]-t[4][1]*t[1][0])*-t[3][2]+(t[1][1]*t[3][0]-t[3][1]*t[1][0])*t[4][2])*t[0][3]+((t[3][1]*t[4][0]-t[4][1]*t[3][0])*t[0][2]+(t[0][1]*t[4][0]-t[4][1]*t[0][0])*-t[3][2]+(t[0][1]*t[3][0]-t[3][1]*t[0][0])*t[4][2])*-t[1][3]+(((t[1][1]*t[4][0]-t[4][1]*t[1][0])*t[0][2]+(t[0][1]*t[4][0]-t[4][1]*t[0][0])*-t[1][2]+(t[0][1]*t[1][0]-t[1][1]*t[0][0])*t[4][2])*t[3][3]+((t[1][1]*t[3][0]-t[3][1]*t[1][0])*t[0][2]+(t[0][1]*t[3][0]-t[3][1]*t[0][0])*-t[1][2]+(t[0][1]*t[1][0]-t[1][1]*t[0][0])*t[3][2])*-t[4][3]+((t[2][1]*t[3][0]-t[3][1]*t[2][0])*t[1][2]+(t[1][1]*t[3][0]-t[3][1]*t[1][0])*-t[2][2]+(t[1][1]*t[2][0]-t[2][1]*t[1][0])*t[3][2])*t[0][3]+((t[2][1]*t[3][0]-t[3][1]*t[2][0])*t[0][2]+(t[0][1]*t[3][0]-t[3][1]*t[0][0])*-t[2][2]+(t[0][1]*t[2][0]-t[2][1]*t[0][0])*t[3][2])*-t[1][3]+((t[1][1]*t[3][0]-t[3][1]*t[1][0])*t[0][2]+(t[0][1]*t[3][0]-t[3][1]*t[0][0])*-t[1][2]+(t[0][1]*t[1][0]-t[1][1]*t[0][0])*t[3][2])*t[2][3]+((t[1][1]*t[2][0]-t[2][1]*t[1][0])*t[0][2]+(t[0][1]*t[2][0]-t[2][1]*t[0][0])*-t[1][2]+(t[0][1]*t[1][0]-t[1][1]*t[0][0])*t[2][2])*-t[3][3])-(((t[3][1]*t[4][0]-t[4][1]*t[3][0])*t[2][2]+(t[2][1]*t[4][0]-t[4][1]*t[2][0])*-t[3][2]+(t[2][1]*t[3][0]-t[3][1]*t[2][0])*t[4][2])*t[0][3]+((t[3][1]*t[4][0]-t[4][1]*t[3][0])*t[0][2]+(t[0][1]*t[4][0]-t[4][1]*t[0][0])*-t[3][2]+(t[0][1]*t[3][0]-t[3][1]*t[0][0])*t[4][2])*-t[2][3]+(((t[2][1]*t[4][0]-t[4][1]*t[2][0])*t[0][2]+(t[0][1]*t[4][0]-t[4][1]*t[0][0])*-t[2][2]+(t[0][1]*t[2][0]-t[2][1]*t[0][0])*t[4][2])*t[3][3]+((t[2][1]*t[3][0]-t[3][1]*t[2][0])*t[0][2]+(t[0][1]*t[3][0]-t[3][1]*t[0][0])*-t[2][2]+(t[0][1]*t[2][0]-t[2][1]*t[0][0])*t[3][2])*-t[4][3])+(((t[2][1]*t[4][0]-t[4][1]*t[2][0])*t[1][2]+(t[1][1]*t[4][0]-t[4][1]*t[1][0])*-t[2][2]+(t[1][1]*t[2][0]-t[2][1]*t[1][0])*t[4][2])*t[0][3]+((t[2][1]*t[4][0]-t[4][1]*t[2][0])*t[0][2]+(t[0][1]*t[4][0]-t[4][1]*t[0][0])*-t[2][2]+(t[0][1]*t[2][0]-t[2][1]*t[0][0])*t[4][2])*-t[1][3]+(((t[1][1]*t[4][0]-t[4][1]*t[1][0])*t[0][2]+(t[0][1]*t[4][0]-t[4][1]*t[0][0])*-t[1][2]+(t[0][1]*t[1][0]-t[1][1]*t[0][0])*t[4][2])*t[2][3]+((t[1][1]*t[2][0]-t[2][1]*t[1][0])*t[0][2]+(t[0][1]*t[2][0]-t[2][1]*t[0][0])*-t[1][2]+(t[0][1]*t[1][0]-t[1][1]*t[0][0])*t[2][2])*-t[4][3])))};function K(t,n,r){this.vertices=t,this.adjacent=n,this.boundary=r,this.lastVisited=-1}function Q(t,n,r){this.vertices=t,this.cell=n,this.index=r}function Z(t,n){var r=this;this.vertices=t,this.simplices=n,this.interior=n.filter((function(t){return!t.boundary})),this.tuple=Object(h.a)(this.vertices),this.orient=function(){return Y(r.tuple)}}function $(t,n){this.point=t,this.index=n}function _(t){var n=t.length;if(0===n)return[];for(var r=new Array(n),e=1,o=0;o<n;++o){for(var a=t[o],i=new Array(4),c=0,u=0;u<3;++u){var s=a[u];i[u]=s,c+=s*s}i[3]=c,r[o]=new $(i,o),e=Math.max(c,e)}r.sort((function(t,n){for(var r=0;r<5;++r){var e=n.point[r]-t.point[r];if(e)return e}return 0})),n=r.length;for(var f=new Array(n+3+1),l=new Array(n+3+1),h=16*e,v=new Array(4),p=0;p<=3;++p)v[p]=0;v[3]=h,f[0]=v.slice(),l[0]=-1;for(var b=0;b<=3;++b){var d=v.slice();d[b]=1,f[b+1]=d,l[b+1]=-1}for(var j=0;j<n;++j){var g=r[j];f[j+3+1]=g.point,l[j+3+1]=g.index}var m=function(t,n){var r=t.length;if(0===r)throw new Error("Must have at least d+1 points");var e=t[0].length;if(r<=e)throw new Error("Must input at least d+1 points");var o=t.slice(0,e+1),a=Y(o);if(0===a)throw new Error("Input not in general position");for(var i=new Array(e+1),c=0;c<=e;++c)i[c]=c;a<0&&(i[0]=1,i[1]=0);for(var u=new K(i,new Array(e+1),!1),s=u.adjacent,f=new Array(e+2),l=0;l<=e;++l){for(var h=i.slice(),v=0;v<=e;++v)v===l&&(h[v]=-1);var p=h[0];h[0]=h[1],h[1]=p;var b=new K(h,new Array(e+1),!0);s[l]=b,f[l]=b}f[e+1]=u;for(var d=0;d<=e;++d)for(var j=s[d].vertices,g=s[d].adjacent,m=0;m<=e;++m){var w=j[m];if(w<0)g[m]=u;else for(var O=0;O<=e;++O)s[O].vertices.indexOf(w)<0&&(g[m]=s[O])}for(var y=new Z(o,f),x=!!n,M=e+1;M<r;++M)y.insert(t[M],x);return y.boundary()}(f,!1);m=m.filter((function(t){for(var n=0;n<=3;++n){var r=l[t[n]];if(r<0)return!1;t[n]=r}return!0}));for(var w=0;w<m.length;++w){var O=m[w],y=O[0];O[0]=O[1],O[1]=y}return m}K.prototype.flip=function(){var t=this.vertices[0];this.vertices[0]=this.vertices[1],this.vertices[1]=t;var n=this.adjacent[0];this.adjacent[0]=this.adjacent[1],this.adjacent[1]=n},Z.prototype.handleBoundaryDegeneracy=function(t,n){var r=this.vertices.length-1,e=this.tuple,o=this.vertices,a=[t];for(t.lastVisited=-r;a.length>0;)for(var i=(t=a.pop()).adjacent,c=0;c<=4;++c){var u=i[c];if(u.boundary&&!(u.lastVisited<=-r)){for(var s=u.vertices,f=0;f<=4;++f){var l=s[f];e[f]=l<0?n:o[l]}var h=this.orient();if(h>0)return u;u.lastVisited=-r,0===h&&a.push(u)}}return null},Z.prototype.walk=function(t,n){var r=this.vertices.length-1,e=this.vertices,o=this.tuple,a=n?this.interior.length*Math.random()|0:this.interior.length-1,i=this.interior[a];t:for(;!i.boundary;){for(var c=i.vertices,u=i.adjacent,s=0;s<=4;++s)o[s]=e[c[s]];i.lastVisited=r;for(var f=0;f<=4;++f){var l=u[f];if(!(l.lastVisited>=r)){var h=o[f];o[f]=t;var v=this.orient();if(o[f]=h,v<0){i=l;continue t}l.boundary?l.lastVisited=-r:l.lastVisited=r}}return}return i},Z.prototype.addPeaks=function(t,n){var r=this.vertices.length-1,e=this.vertices,o=this.tuple,a=this.interior,i=this.simplices,c=[n];n.lastVisited=r,n.vertices[n.vertices.indexOf(-1)]=r,n.boundary=!1,a.push(n);for(var u=[];c.length>0;){var s=(n=c.pop()).vertices,f=n.adjacent,l=s.indexOf(r);if(!(l<0))for(var h=0;h<=4;++h)if(h!==l){var v=f[h];if(v.boundary&&!(v.lastVisited>=r)){var p=v.vertices;if(v.lastVisited!==-r){for(var b=0,d=0;d<=4;++d)p[d]<0?(b=d,o[d]=t):o[d]=e[p[d]];if(this.orient()>0){p[b]=r,v.boundary=!1,a.push(v),c.push(v),v.lastVisited=r;continue}v.lastVisited=-r}var j=v.adjacent,g=s.slice(),m=f.slice(),w=new K(g,m,!0);i.push(w);var O=j.indexOf(n);if(!(O<0)){j[O]=w,m[l]=v,g[h]=-1,m[h]=n,f[h]=w,w.flip();for(var y=0;y<=4;++y){var x=g[y];if(!(x<0||x===r)){for(var M=new Array(3),A=0,V=0;V<=4;++V){var S=g[V];S<0||V===y||(M[A++]=S)}u.push(new Q(M,w,y))}}}}}}u.sort((function(t,n){return function(t,n){var r=t[0]+t[1],e=n[0]+n[1],o=r+t[2]-(e+n[2]);if(o)return o;var a=Math.min(t[0],t[1]),i=Math.min(n[0],n[1]);return(o=Math.min(a,t[2])-Math.min(i,n[2]))||Math.min(a+t[2],r)-Math.min(i+n[2],e)}(t.vertices,n.vertices)}));for(var E=0;E+1<u.length;E+=2){var k=u[E],B=u[E+1],C=k.index,I=B.index;C<0||I<0||(k.cell.adjacent[k.index]=B.cell,B.cell.adjacent[B.index]=k.cell)}},Z.prototype.insert=function(t,n){var r=this.vertices;r.push(t);var e=this.walk(t,n);if(e){for(var o=this.tuple,a=0;a<=4;++a){var i=e.vertices[a];o[a]=i<0?t:r[i]}var c=this.orient(o);c<0||(0!==c||(e=this.handleBoundaryDegeneracy(e,t)))&&this.addPeaks(t,e)}},Z.prototype.boundary=function(){for(var t=[],n=this.simplices,r=n.length,e=0;e<r;++e){var o=n[e];if(o.boundary){for(var a=new Array(4),i=o.vertices,c=0,u=0,s=0;s<=4;++s)i[s]>=0?a[c++]=i[s]:u=1&s;if(0===u){var f=a[0];a[0]=a[1],a[1]=f}t.push(a)}}return t};for(var tt=r(26),nt=function(){return{bots:[]}},rt=function(t){return function(n){return n.bots=t,n}},et=1.5,ot=2,at=function(t){ot=t},it=function(t){et=t},ct=function(t){return t<et-ot/2?1:t>et+ot/2?0:2*(t+ot-et)*Math.pow(et+ot/2-t,2)/Math.pow(ot,3)},ut=function(t){return ct(t)+1e-4},st=function(t){var n=C(t);return t=k(t,Math.sqrt(ct(n))/n),R(t,t)},ft=function(t){var n=R(t,t);return P(n,ut(C(t))/B(t,t)),n},lt=function(t,n){var r=1e-5,e=n[t],o=M(n);o[t]=e+r;var a=M(n);a[t]=e-r;var i=st(o);return function(t,n){for(var r=0;r<3;++r)for(var e=0;e<3;++e)t[r][e]-=n[r][e]}(i,st(a)),P(i,1/2e-5),i},ht=function(t,n,r){for(var e=Object(h.a)(Array(3*t.bots.length)).map((function(){return[]})),o=0;o<t.bots.length;++o)for(var a=ft(x(t.bots[o].pos[1]+.5,0,0)),i=ft(x(0,t.bots[o].pos[1]+.5,0)),c=ft(x(0,0,t.bots[o].pos[1]+.5)),u=0;u<3;++u)for(var s=u;s<3;++s)e[3*o+u].push([3*o+s,.1*(a[u][s]+c[u][s])+i[u][s]]);for(var f=function(n){r[n].forEach((function(r){for(var o=function(t,n){var r=S(n.pos,t.pos);return st(r)}(t.bots[n],t.bots[r]),a=0;a<3;++a)for(var i=0;i<3;++i)e[3*n+a].push([3*r+i,-o[a][i]]),a>i||(e[3*n+a][i-a][1]+=o[a][i],e[3*r+a][i-a][1]+=o[a][i])}))},l=0;l<t.bots.length;++l)f(l);return e},vt=function(t,n,r,e,o,a){var i=function(t,n,r,e){var o=Object(h.a)(Array(3*e.bots.length)).map((function(){return 0}));return e.bots.forEach((function(a,i){for(var c=0;c<3;++c){var u=(e.bots[i].pos[c]-t.bots[i].pos[c])/r,s=((n.bots[i].pos[c]-e.bots[i].pos[c])/r-u)/r;o[3*i+c]=((1===c?-1:0)-s)*a.weight}})),o}(t,n,r,e),c=ht(e,0,a);return X(c,i)},pt=function(t,n,r){return n[r].filter((function(t){return t>r})).filter((function(n){return I(t.bots[r].pos,t.bots[n].pos)<et+ot/2}))},bt=function(t,n,r,e,o,a,i,c,u,s){for(var f=Object(h.a)(Array(u.bots.length)).map((function(){return[0,1,2].map((function(){return 0}))})),l=function(t){for(var r=function(r){var e=lt(r,x(u.bots[t].pos[1]+.5,0,0));P(e,.1);var o=lt(r,x(0,u.bots[t].pos[1]+.5,0)),a=lt(r,x(0,0,u.bots[t].pos[1]+.5));P(a,.1);var i=x(n[3*t],n[3*t+1],n[3*t+2]);N(e,o),N(e,a);var c=B(i,T(e,i));f[t][r]+=c,s[t].forEach((function(e){var o=function(t,n,r){return lt(n,S(t.pos,r.pos))}(u.bots[t],r,u.bots[e]),a=x(n[3*e],n[3*e+1],n[3*e+2]);E(a,i);var c=T(o,a),s=B(a,c);f[t][r]+=s,f[e][r]-=s}))},e=0;e<3;++e)r(e)},v=0;v<u.bots.length;++v)l(v);for(var p=Object(h.a)(Array(u.bots.length)).map((function(){return x(0,0,0)})),b=0;b<u.bots.length;++b)for(var d=0;d<3;++d)p[b][d]=-f[b][d]+(-t[3*b+d]+2*n[3*b+d]-r[3*b+d])/Math.pow(c,2)*2;for(var j=0;j<u.bots.length;++j)if(!(u.bots[j].pos[1]>.5)){var g=u.bots[j].pos[1]+.5;p[j][1]+=2*(g-2)*2e3}for(var m=function(t){s[t].forEach((function(n){var r=S(u.bots[n].pos,u.bots[t].pos),e=C(r);e>1||(r=k(r,2*(e-2)/e*1e3),E(p[t],r),V(p[n],r))}))},w=0;w<u.bots.length;++w)m(w);for(var O=0;O<u.bots.length;++O){var y=k(e.bots[O].pos,2),M=k(o.bots[O].pos,-8),A=k(u.bots[O].pos,12),I=k(a.bots[O].pos,-8),q=k(i.bots[O].pos,2);V(y,M),V(y,A),V(y,I),V(y,q),V(p[O],k(y,100/Math.pow(c,4)))}return p},dt=new tt.a(123),jt=function(t){return function(t){var n=_(t),r=t.map((function(){return{}}));return n.map((function(t){for(var n=0;n<4;++n)for(var e=n+1;e<4;++e)r[t[n]][t[e]]=!0,r[t[e]][t[n]]=!0})),r.map((function(t){return Object.keys(t).map((function(t){return Number(t)}))}))}(t.bots.map((function(t){return A(t.pos,k(x(dt.next()-.5,dt.next()-.5,dt.next()-.5),.1))})))},gt=function(t,n,r,e){var o=nt();return o.bots=t.bots.map((function(t,o){return G(t,n.bots[o],r,e)})),o},mt=function(t,n){var r=Math.floor(20/t.length);if(0!==r)for(var e=1/t.length,o=t.map((function(t){return t.bots.map((function(){return x(0,0,0)}))})),a=t.map((function(t){return jt(t)})),i=t.map((function(t,n){return t.bots.map((function(r,e){return pt(t,a[n],e)}))})),c=function(c){it(1+5/((1+c/r)*t.length));var u=function(t,n,r,e){for(var o=Object(h.a)(Array(t.length)).map((function(){return Object(h.a)(Array(t[0].bots.length)).map((function(){return x(0,0,0)}))})),a=t.map((function(){return Object(h.a)(Array(3*t[0].bots.length)).map((function(){return 0}))})),i=0;i<t.length;++i){var c=t[Math.max(i-1,0)],u=t[Math.min(i+1,t.length-1)];a[i]=vt(c,u,n,t[i],r[i],e[i])}for(var s=1;s<t.length;++s){var f=t[Math.max(s-2,0)],l=t[s-1],v=t[Math.min(s+1,t.length-1)],p=t[Math.min(s+2,t.length-1)];o[s]=bt(a[s-1],a[s],a[Math.min(s+1,t.length-1)],f,l,v,p,n,t[s],e[s])}return o}(t,n,a,i);u=u.map((function(t){return t.map((function(t){return k(t,-e/(1e-4+C(t)))}))})),t.map((function(n,r){return n.bots.map((function(n,e){var a=n.target(r/(t.length-1));void 0===a?(o[r][e]=A(o[r][e],u[r][e]),o[r][e]=k(o[r][e],.9),n.pos=A(n.pos,o[r][e])):n.pos=a}))}))},u=0;u<r;++u)c(u)},wt=function(t){for(var n=Object(h.a)(Array(2*t.length-1)),r=0;r<t.length;++r)n[2*r]=t[r];for(var e=1;e<n.length-1;e+=2)n[e]=gt(n[e-1],n[e+1],(e-1)/(n.length-1),(e+1)/(n.length-1));return n},Ot=function(t){var n=Math.floor(100/t.length);if(0!==n)for(var r=t.map((function(t){return jt(t)})),e=0;e<n;++e)for(var o=function(n){var e=t[Math.max(n-2,0)],o=t[n-1],a=t[n],i=t[n+1],c=t[Math.min(n+2,t.length-1)],u=a.bots.map((function(t,n){var r=k(e.bots[n].pos,-1),a=k(o.bots[n].pos,4),u=k(i.bots[n].pos,4),s=k(c.bots[n].pos,-1);return V(r,a),V(r,u),V(r,s),k(r,1/6)}));a.bots.map((function(t){t.pos[1]+=.01*(.5-t.pos[1])})),a.bots.map((function(t,e){r[n][e].map((function(o){if(!(e>=o)){var i=a.bots[o],c=S(i.pos,t.pos),u=C(c),s=u-1,f=k(c,(s>0?.2/(r[n][e].length+r[n][o].length):1)*s/u),l=t.weight+i.weight;V(t.pos,k(f,i.weight/l)),E(i.pos,k(f,t.weight/l))}}))})),a.bots.map((function(r,e){var o=r.target(n/(t.length-1));if(void 0===o){r.pos=k(r.pos,.1),V(r.pos,k(u[e],.9))}else r.pos=o}))},a=1;a<t.length-1;++a)o(a)},yt=function(t,n,r){for(var e=[t,n],o=100,a=0;a<r;++a)console.log("".concat(a," subdivisions")),o/=2,e=wt(e),Ot(e),mt(e,o);return console.log("done"),e},xt=r(31),Mt=function(){var t=new p.n;t.add(new p.a(16777215,.4));var n=new p.e(16777215,.4);return n.position.set(0,1,0),t.add(n),t},At=function(t,n,r){return function(e){var o=new p.h;o.lookAt(Object(xt.a)(p.s,Object(h.a)(t)),Object(xt.a)(p.s,Object(h.a)(n)),(new p.k).up),o.multiply((new p.h).set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1)),e.setRotationFromMatrix(o),e.scale.set(r,C(S(n,t)),r);var a=k(A(t,n),.5);return e.position.set(a[0],a[1],a[2]),e}},Vt=function(t,n,r,e){var o=new p.d(1,1,1,8,1),a=new p.i(o,new p.j({color:e}));return At(t,n,r)(a)},St=[e.newVec3(0,0,0)],Et=0;Et<10;++Et){var kt=Math.PI/2*(Et/10);St.push(e.newVec3(St[Et][0]+Math.cos(kt),St[Et][1]-Math.sin(kt),0))}for(var Bt=1;Bt<11;++Bt)St.push(e.newVec3(-St[Bt][0],St[Bt][1],0));var Ct=Math.min.apply(Math,Object(h.a)(St.map((function(t){return t[1]}))));St.forEach((function(t,n){return St[n][1]=St[n][1]-Ct+.5}));for(var It={title:"Arc",world:{bots:[].concat(Object(h.a)(Object(h.a)(Array(11)).map((function(t,n){return e.newVec3(n,.5,0)}))),Object(h.a)(Object(h.a)(Array(10)).map((function(t,n){return e.newVec3(-n-1,.5,0)})))).map((function(t,n){return o.newBot({pos:t,target:function(t){if(t>.9999)return St[n]},weight:.01})}))}},qt=[e.newVec3(0,0,0)],Dt=0;Dt<20;++Dt){var Nt=Math.PI/2*(Dt/20);qt.push(e.newVec3(qt[Dt][0]+Math.cos(Nt),qt[Dt][1]-Math.sin(Nt),0))}for(var Pt=1;Pt<21;++Pt)qt.push(e.newVec3(-qt[Pt][0],qt[Pt][1],0));var Tt=Math.min.apply(Math,Object(h.a)(qt.map((function(t){return t[1]}))));qt.forEach((function(t,n){return qt[n][1]=qt[n][1]-Tt+.5}));var Wt={title:"Big arc",world:{bots:[].concat(Object(h.a)(Object(h.a)(Array(21)).map((function(t,n){return e.newVec3(n,.5,0)}))),Object(h.a)(Object(h.a)(Array(20)).map((function(t,n){return e.newVec3(-n-1,.5,0)})))).map((function(t,n){return o.newBot({pos:t,target:function(t){if(t>.9999)return qt[n]},weight:.01})}))}},Ft=Object(h.a)(Array(8)).map((function(t,n){return Object(h.a)(Array(8)).map((function(t,r){return e.newVec3(n-3.5,.5,r-3.5)}))})).flat(),Gt=Object(h.a)(Array(4)).map((function(t,n){return Object(h.a)(Array(4)).map((function(t,r){return Object(h.a)(Array(4)).map((function(t,o){return e.newVec3(n-1.5,o+.5,r-1.5)}))}))})).flat().flat(),Rt={title:"Big cube",world:{bots:Ft.map((function(t,n){return o.newBot({pos:t,target:function(t){if(t>.9999)return Gt[n]},weight:.01})}))}},zt=[[-1.5,.5,-1.5],[-.5,.5,-1.5],[.5,.5,-1.5],[1.5,.5,-1.5],[-1.5,.5,-.5],[-.5,.5,-.5],[.5,.5,-.5],[1.5,.5,-.5],[-1.5,.5,.5],[-.5,.5,.5],[.5,.5,.5],[1.5,.5,.5],[-1.5,.5,1.5],[-.5,.5,1.5],[.5,.5,1.5],[1.5,.5,1.5]],Jt={title:"Cube",world:{bots:[[-.5,.5,-.5],[.5,.5,-.5],[.5,.5,.5],[-.5,.5,.5],[-.5,1.5,-.5],[.5,1.5,-.5],[.5,1.5,.5],[-.5,1.5,.5],[-.5,2.5,-.5],[.5,2.5,-.5],[.5,2.5,.5],[-.5,2.5,.5],[-.5,3.5,-.5],[.5,3.5,-.5],[.5,3.5,.5],[-.5,3.5,.5]].map((function(t,n){return o.newBot({pos:t,target:function(t){if(t>.9999)return zt[n]},weight:.01})}))}},Ht={bots:Object(h.a)(Object(h.a)(Array(5)).map((function(t,n){return o.newBot({pos:[n,.5,0],target:function(t){if(t>.9999)return[0,.5+n,0]},weight:.1})})))},Lt=[[2,.5,0],[2,1.5,0],[2,2.5,0],[2,3.5,0],[2,4.5,0],[-2,.5,0],[-2,1.5,0],[-2,2.5,0],[-2,3.5,0],[-2,4.5,0],[-2,5.5,0]],Ut=[{title:"Stack",world:Ht},{title:"Towers",world:{bots:[[2,.5,0],[2,1.5,0],[2,2.5,0],[2,3.5,0],[2,4.5,0],[-2,.5,0],[-2,1.5,0],[-2,2.5,0],[-2,3.5,0],[-2,4.5,0],[2,5.5,0]].map((function(t,n){return o.newBot({pos:t,target:function(t){if(t>.9999)return Lt[n]},weight:.02})}))}},{title:"Targets",world:{bots:[].concat(Object(h.a)(Object(h.a)(Array(9)).map((function(t,n){return o.newBot({pos:[n,.5,0],weight:.001})}))),[o.newBot({pos:[4.5,.5,4],target:function(t){return Math.abs(t-.4)<.03?[1,3.5,1]:Math.abs(t-.6)<.03?[-1,3.5,1]:Math.abs(t-.8)<.03?[-1,3.5,-1]:Math.abs(t-1)<.03?[1,3.5,-1]:void 0}})])}},It,Wt,Jt,Rt].sort((function(t,n){var r=t.world.bots.length-n.world.bots.length;return 0===r?t.title>n.title?1:-1:r})),Xt=Object(d.a)((function(t){return{gridItem:{padding:t.spacing(2),textAlign:"center"}}})),Yt=function(){var t=Object(y.a)(),n=Object(v.a)(t,2),r=n[0],o=n[1],s=.55*r,f=.9*o,l=Xt(),d=Object(u.useRef)(null),x=Object(u.useState)(),M=Object(v.a)(x,2),A=M[0],V=M[1],S=Object(u.useState)(),E=Object(v.a)(S,2),k=E[0],B=E[1],C=Object(u.useState)(),I=Object(v.a)(C,2),q=I[0],D=I[1],N=Object(u.useState)(0),P=Object(v.a)(N,2),T=P[0],W=P[1],F=Object(u.useState)(0),G=Object(v.a)(F,2),R=G[0],z=G[1],J=Object(u.useState)(!1),H=Object(v.a)(J,2),L=H[0],U=H[1],X=Object(u.useState)(Mt()),Y=Object(v.a)(X,2),K=Y[0],Q=Y[1],Z=Object(u.useState)([]),$=Object(v.a)(Z,2),_=$[0],nt=$[1],rt=Object(u.useState)([]),et=Object(v.a)(rt,2),ot=et[0],at=et[1],it=Object(u.useState)([]),ct=Object(v.a)(it,2),ut=ct[0],st=ct[1],ft=Object(u.useState)([]),lt=Object(v.a)(ft,2),ht=lt[0],vt=lt[1],pt=Object(u.useState)(a.newWorld()),bt=Object(v.a)(pt,2),dt=bt[0],jt=bt[1],gt=Object(u.useState)(a.newWorld()),mt=Object(v.a)(gt,2),wt=mt[0],Ot=mt[1],yt=Object(u.useState)(void 0),xt=Object(v.a)(yt,2),St=xt[0],Et=xt[1],kt=function(t){ht[t].bots.map((function(t,n){var r;(r=_[n].position).set.apply(r,Object(h.a)(t.pos))})),ht[t].bots.map((function(t,n){K.remove(ot[n]);var r=a.edgeStrength(t.pos[1]+.5);r<.01||(K.add(ot[n]),At(t.pos,e.newVec3(t.pos[0],0,t.pos[2]),.3*Math.sqrt(r))(ot[n]))})),ht[t].bots.map((function(n,r){return ht[t].bots.map((function(t,o){if(!(r>=o)){K.remove(ut[r][o]);var i=a.edgeStrength(e.length(e.sub(t.pos,n.pos)));i<.01||(K.add(ut[r][o]),At(n.pos,t.pos,.3*Math.sqrt(i))(ut[r][o]))}}))}))};return Object(u.useEffect)((function(){0!==ht.length&&(nt(ht[0].bots.map((function(t){return function(t,n){var r,e=new p.o(1,16,16);e.computeVertexNormals(),e.faces.forEach((function(t){return t.vertexColors=new Array(3).fill(!0).map((function(){return n}))}));var o=(new p.b).fromGeometry(e);delete o.attributes.uv;var a=new p.i(o,new p.j({color:n}));return a.geometry=o,(r=a.position).set.apply(r,Object(h.a)(t)),a.scale.set(.5,.5,.5),a}(t.pos,void 0===t.target(1)?new p.c(0,0,1):new p.c(0,1,0))}))),at(ht[0].bots.map((function(t){return Vt(t.pos,e.newVec3(t.pos[0],0,t.pos[2]),1,new p.c(1,0,0))}))),st(ht[0].bots.map((function(t){return ht[0].bots.map((function(n){return Vt(t.pos,n.pos,1,new p.c(1,0,0))}))}))))}),[ht]),Object(u.useEffect)((function(){var t=Mt();_.map((function(n){return t.add(n)})),ot.map((function(n){return t.add(n)})),ut.map((function(n,r){return n.map((function(n,e){r>=e||t.add(n)}))})),Q(t)}),[_,ot,ut]),Object(u.useEffect)((function(){var t=d.current;if(t){var n=new p.l(75,s/f,.1,1e3);n.position.set(10,10,10),n.lookAt(0,0,0),B(n);var r=new p.t({antialias:!0});r.setClearColor("#000000"),r.setSize(s,f),t.appendChild(r.domElement),D(r);var e=new b.a(n,r.domElement);e.enableDamping=!0,e.dampingFactor=.5,V(e);var o=window.setInterval((function(){return W((function(t){return t+1}))}),1e3/30);return function(){window.clearInterval(o),t.removeChild(r.domElement)}}}),[d,s,f]),Object(u.useEffect)((function(){A&&A.update(),q&&k&&K&&q.render(K,k)}),[A,q,k,T,K]),Object(u.useEffect)((function(){if(0!==_.length){var t=Math.round(.1*ht.length),n=R%(2*(ht.length+t));n<t?kt(0):(n-=t)<ht.length?kt(n):(n-=ht.length)<t?kt(ht.length-1):(n-=t,kt(ht.length-1-n))}}),[R,K]),Object(u.useEffect)((function(){if(L){var t=setInterval((function(){return z((function(t){return t+1}))}),10);return function(){return clearInterval(t)}}}),[L]),Object(c.jsx)(c.Fragment,{children:Object(c.jsxs)(j.a,{container:!0,item:!0,xs:11,children:[Object(c.jsx)(j.a,{item:!0,xs:4,style:{height:.9*window.innerHeight,overflowX:"hidden",overflowY:"scroll"},children:Object(c.jsxs)(j.a,{container:!0,direction:"column",children:[Object(c.jsx)("b",{children:"Microbots"}),Object(c.jsx)(j.a,{item:!0,className:l.gridItem,children:Object(c.jsxs)(g.a,{children:[Object(c.jsx)(m.a,{children:Object(c.jsx)(w.a,{children:Object(c.jsx)("b",{children:"Select an example"})})}),Ut.map((function(t,n){return Object(c.jsxs)(O.a,{variant:"contained",color:St===n?"primary":"default",onClick:function(){var t,r=new tt.a(123),o=[Ut[t=n].world,a.setBots(Ut[t].world.bots.map((function(t){return{pos:void 0!==t.target&&t.target(1)||t.pos,target:t.target,weight:t.weight}})))(a.newWorld())],i=Object(v.a)(o,2),c=i[0],u=i[1];console.log(c,u);var s=function(){return e.multiplyScalar(e.newVec3(r.next()-.5,r.next()-.5,r.next()-.5),1e-4)};c.bots.map((function(t){return t.pos=e.add(t.pos,s())})),u.bots.map((function(t){return t.pos=e.add(t.pos,s())})),jt(c),Ot(u),vt([c,u]),U(!1),Et(n)},children:[t.title," (",t.world.bots.length," bots)"]},n)})),Object(c.jsx)("br",{}),Object(c.jsx)("br",{})]})}),Object(c.jsx)(j.a,{item:!0,className:l.gridItem,children:Object(c.jsx)(g.a,{children:Object(c.jsxs)(m.a,{children:[Object(c.jsx)(w.a,{children:Object(c.jsx)("b",{children:"Compute the animation"})}),Object(c.jsx)(w.a,{children:Object(c.jsx)(O.a,{variant:"contained",onClick:function(){var t=Date.now();vt(i.createAnimation(dt,wt,8)),console.log((Date.now()-t)/1e3),U(!0)},children:"Generate animation"})})]})})}),Object(c.jsx)(j.a,{item:!0,className:l.gridItem,children:Object(c.jsx)(g.a,{children:Object(c.jsxs)(m.a,{children:[Object(c.jsx)(w.a,{children:Object(c.jsx)("b",{children:"Extra options"})}),Object(c.jsx)(w.a,{children:Object(c.jsxs)(O.a,{variant:"contained",onClick:function(){return z(R+1)},children:["Time: ",R]})}),Object(c.jsx)(w.a,{children:Object(c.jsxs)(O.a,{variant:"contained",onClick:function(){return U(!L)},children:["Animate: ",L?"true":"false"]})}),Object(c.jsx)(w.a,{children:Object(c.jsx)(O.a,{variant:"contained",onClick:function(){return function(){var t=document.getElementsByTagName("canvas")[0].toDataURL("image/png"),n=document.createElement("a");n.href=t.replace(/^data:image\/[^;]/,"data:application/octet-stream"),n.download="image.png",n.click()}()},children:"Save screenshot"})})]})})})]})}),Object(c.jsx)(j.a,{item:!0,xs:5,children:Object(c.jsx)("div",{ref:d})})]})})};l.a.render(Object(c.jsx)(s.a.StrictMode,{children:Object(c.jsx)(Yt,{})}),document.getElementById("root"))}},[[50,1,2]]]);
//# sourceMappingURL=main.e8ed054b.chunk.js.map