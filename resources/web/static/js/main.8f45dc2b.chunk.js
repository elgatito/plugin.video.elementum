(this["webpackJsonpelementum-web"]=this["webpackJsonpelementum-web"]||[]).push([[0],{181:function(e,t,n){},182:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(63),i=n.n(a),s=n(16),l=n.n(s),o=n(27),j=n(15),u=n(72),d=n.n(u),b=n(149),h=n(151),O=n(204),x=n(203),f=n(198),p=n(97),v=n(183),g="refreshRate",m=function(){var e=window.localStorage.getItem(g);return Number(null!==e&&void 0!==e?e:5e3)},C=n.p+"static/media/logo.4754a3cb.png",w=n(2),k=function(){var e=Object(r.useState)((function(){return m()/1e3})),t=Object(j.a)(e,2),n=t[0],c=t[1];return Object(w.jsxs)(b.a,{borderless:!0,color:"green",style:{border:"none"},children:[Object(w.jsxs)(b.a.Item,{header:!0,as:"a",href:"/web",children:[Object(w.jsx)(h.a,{size:"mini",src:C}),"Elementum"]}),Object(w.jsxs)(O.a,{trigger:Object(w.jsx)(b.a.Item,{position:"right",children:"Settings"}),closeIcon:!0,children:[Object(w.jsx)(O.a.Header,{content:"Settings"}),Object(w.jsx)(O.a.Content,{children:Object(w.jsx)(x.a,{children:Object(w.jsx)(x.a.Group,{inline:!0,children:Object(w.jsxs)(x.a.Field,{children:[Object(w.jsx)("label",{htmlFor:"refresh-rate",children:"Refresh rate:"}),Object(w.jsxs)(f.a,{type:"number",min:"1",labelPosition:"right",value:n,onChange:function(e,t){return c(Number(t.value))},children:[Object(w.jsx)("input",{id:"refresh-rate"}),Object(w.jsx)(p.a,{children:"Seconds"})]})]})})})}),Object(w.jsx)(O.a.Actions,{children:Object(w.jsx)(v.a,{onClick:function(e,t){!function(e){var t=e;window.localStorage.setItem(g,t.toString())}(1e3*(n<1?1:n)),window.location.reload()},positive:!0,children:"Save"})})]})]})},y=n(69),S=n(143),F=n(150),A=n(144),R=n(201),I=n(202),T=n(153),z=n(45),H=n(199),P=[{text:"Movies",value:"Movies",icon:"film"},{text:"TV Shows",value:"TvShows",icon:"tv"},{text:"General",value:"General",icon:"magnet"}],D={loading:!1,results:[],value:""};function E(e,t){switch(t.type){case"CleanQuery":return D;case"StartSearch":return Object(y.a)(Object(y.a)({},e),{},{loading:!0,value:t.query});case"FinishSearch":return Object(y.a)(Object(y.a)({},e),{},{loading:!1,results:t.results});case"UpdateSelection":return Object(y.a)(Object(y.a)({},e),{},{value:t.selection})}}var M=function(e){var t,n,r,c,a=e;return Object(w.jsx)(S.a,{children:Object(w.jsxs)(F.a,{children:[Object(w.jsx)(F.a.Image,{size:"small",src:a.image}),Object(w.jsxs)(F.a.Content,{children:[Object(w.jsx)(F.a.Header,{children:a.title}),Object(w.jsx)(F.a.Meta,{children:a.tagline}),Object(w.jsx)(F.a.Description,{children:a.description}),"season"!==a.mediatype&&Object(w.jsx)(F.a.Extra,{children:"".concat(a.rating," - ").concat(null===(t=a.genre)||void 0===t?void 0:t.join(", ")," - ").concat(null!==(n=null!==(r=null===(c=a.date)||void 0===c?void 0:c.toString())&&void 0!==r?r:a.year)&&void 0!==n?n:"-")})]})]})})};function B(e){switch(e){case"Movies":return"movies";case"TvShows":return"shows";case"General":return"."}}function G(e,t){return N.apply(this,arguments)}function N(){return(N=Object(o.a)(l.a.mark((function e(t,n){var r,c;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:return r=e.sent,e.next=5,r.json();case 5:c=e.sent.items,n({type:"FinishSearch",results:c.filter((function(e){return void 0!==e.info})).map((function(e){return{image:e.art.thumb,key:"".concat(e.info.code,"-").concat(e.label),description:e.info.plotoutline,title:e.label,tagline:e.info.tagline,year:e.info.year,date:e.info.date,genre:e.info.genre,rating:e.info.rating,mediatype:e.info.mediatype,path:e.path}}))});case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var _=function(e){var t=e.totalDownloadRate,n=e.totalUploadRate,c=e.active,a=e.finished,i=e.total,s=Object(r.useState)("Movies"),u=Object(j.a)(s,2),d=u[0],b=u[1],h=Object(r.useRef)(),O=Object(r.useReducer)(E,D),x=Object(j.a)(O,2),f=x[0],p=x[1],v=f.loading,g=f.results,m=f.value,C=Object(H.a)(function(){var e=Object(o.a)(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=B(d),e.next=3,G("/".concat(n,"/search?q=").concat(t),p);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),300),k=function(){var e=Object(o.a)(l.a.mark((function e(t){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(p({type:"StartSearch",query:t}),0!==t.trim().length){e.next=4;break}return p({type:"CleanQuery"}),e.abrupt("return");case 4:return e.next=6,C(t);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),y=function(){var e=Object(o.a)(l.a.mark((function e(t){var n,r;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.path.replace("plugin://plugin.video.elementum/",""),r="/".concat(n,"?external=1"),e.t0=d,e.next="Movies"===e.t0?5:"TvShows"===e.t0?8:"General"===e.t0?18:19;break;case 5:return e.next=7,fetch(r);case 7:return e.abrupt("break",19);case 8:if(p({type:"StartSearch",query:m}),!n.includes("links")){e.next=14;break}return e.next=12,fetch(r);case 12:e.next=17;break;case 14:return e.next=16,G(r,p);case 16:h.current.open();case 17:case 18:return e.abrupt("break",19);case 19:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(w.jsx)(w.Fragment,{children:Object(w.jsx)(A.a,{padded:"horizontally",stackable:!0,columns:"3",children:Object(w.jsxs)(A.a.Row,{verticalAlign:"middle",children:[Object(w.jsx)(A.a.Column,{floated:"left",children:Object(w.jsx)(R.a,{fluid:!0,placeholder:"Search",loading:v,results:g,value:m,onSearchChange:function(e,t){var n;return k(null!==(n=t.value)&&void 0!==n?n:"")},resultRenderer:M,onResultSelect:function(e,t){return y(t.result)},ref:h,minCharacters:3,input:{icon:"search",action:Object(w.jsx)(I.a,{fluid:!0,selection:!0,options:P,defaultValue:P[0].value,onChange:function(e,t){return n=t.value,b(n),void p({type:"CleanQuery"});var n}})}})}),Object(w.jsx)(A.a.Column,{width:"3",children:Object(w.jsxs)(T.a.Group,{widths:"3",size:"tiny",children:[Object(w.jsxs)(T.a,{children:[Object(w.jsx)(T.a.Value,{children:c}),Object(w.jsx)(T.a.Label,{children:"Active"})]}),Object(w.jsxs)(T.a,{children:[Object(w.jsx)(T.a.Value,{children:a}),Object(w.jsx)(T.a.Label,{children:"Finished"})]}),Object(w.jsxs)(T.a,{children:[Object(w.jsx)(T.a.Value,{children:i}),Object(w.jsx)(T.a.Label,{children:"Total"})]})]})}),Object(w.jsx)(A.a.Column,{floated:"right",children:Object(w.jsxs)(T.a.Group,{widths:"2",size:"tiny",children:[Object(w.jsx)(T.a,{children:Object(w.jsxs)(T.a.Value,{children:[Object(w.jsx)(z.a,{name:"arrow down",size:"small"})," ".concat(t.toFixed(1)," kB/s")]})}),Object(w.jsx)(T.a,{children:Object(w.jsxs)(T.a.Value,{children:[Object(w.jsx)(z.a,{name:"arrow up",size:"small"})," ".concat(n.toFixed(1)," kB/s")]})})]})})]})})})},V=n(152),L=n(205),q=n(212),Q=n(200),U=n(207),J=function(e){var t=e.torrentIdsToDelete,n=Object(r.useState)(!1),c=Object(j.a)(n,2),a=c[0],i=c[1],s=Object(r.useState)(!1),l=Object(j.a)(s,2),o=l[0],u=l[1],d=0!==t.length;return Object(w.jsxs)(O.a,{onClose:function(){return i(!1)},open:a,trigger:Object(w.jsx)(Q.a,{trigger:Object(w.jsx)("div",{style:{display:"inline-block"},children:Object(w.jsx)(v.a,{content:"Delete",disabled:!d,onClick:function(e,t){return i(!0)}})}),content:"Select at least 1 torrent",disabled:d,closeOnTriggerClick:!1,inverted:!0}),children:[Object(w.jsx)(O.a.Header,{children:"Delete Torrent"}),Object(w.jsx)(O.a.Content,{children:Object(w.jsxs)(O.a.Description,{children:["Are you sure?",Object(w.jsx)("br",{}),Object(w.jsx)(U.a,{negative:!0,children:Object(w.jsx)(q.a,{label:"Also delete files",onChange:function(e,t){var n;return u(null!==(n=t.checked)&&void 0!==n&&n)}})})]})}),Object(w.jsxs)(O.a.Actions,{children:[Object(w.jsx)(v.a,{content:"No",icon:"undo",onClick:function(){return i(!1)}}),Object(w.jsx)(v.a,{content:"Yes",icon:"trash",color:"red",onClick:function(){return t.map((function(e){return fetch("/torrents/delete/".concat(e,"?files=").concat(o))})),void i(!1)}})]})]})};var W=function(){var e=c.a.useState(!1),t=Object(j.a)(e,2),n=t[0],r=t[1],a=c.a.useState(""),i=Object(j.a)(a,2),s=i[0],u=i[1],d=c.a.useState(),b=Object(j.a)(d,2),h=b[0],f=b[1];function p(e,t){return g.apply(this,arguments)}function g(){return(g=Object(o.a)(l.a.mark((function e(t,n){var c;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(c=new FormData).append("uri",s),c.append("file",null!==h&&void 0!==h?h:"null"),null===n||void 0===n||n.forEach((function(e){return c.append(e[0],e[1])})),e.next=6,fetch(t,{method:"POST",body:c});case 6:r(!1);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(w.jsxs)(O.a,{onClose:function(){return r(!1)},onOpen:function(){return r(!0)},open:n,trigger:Object(w.jsxs)(v.a,{icon:!0,labelPosition:"left",floated:"right",primary:!0,children:[Object(w.jsx)(z.a,{name:"download"}),"Add Torrent"]}),children:[Object(w.jsx)(O.a.Header,{children:"Add Torrent"}),Object(w.jsx)(O.a.Content,{children:Object(w.jsx)(O.a.Description,{children:Object(w.jsxs)(x.a,{children:[Object(w.jsx)(x.a.Input,{placeholder:"Magnet or Torrent file URL",onChange:function(e){return u(e.target.value)}}),Object(w.jsx)(x.a.Input,{type:"file",accept:".torrent",onChange:function(e){var t,n;return f(null!==(t=null===(n=e.target.files)||void 0===n?void 0:n.item(0))&&void 0!==t?t:void 0)}})]})})}),Object(w.jsxs)(O.a.Actions,{children:[Object(w.jsx)(v.a,{content:"Cancel",color:"red",onClick:function(){return r(!1)}}),Object(w.jsx)(v.a,{content:"Add (all files)",labelPosition:"left",icon:"download",color:"yellow",onClick:function(){return p("/torrents/add",[["all","1"]])}}),Object(w.jsx)(v.a,{content:"Add",labelPosition:"left",icon:"download",color:"blue",onClick:function(){return p("/torrents/add")}}),Object(w.jsx)(v.a,{content:"Stream",labelPosition:"left",icon:"play",color:"green",onClick:function(){return p("/playuri")}})]})]})},Y=n(208),K=n(146),X=n(131),Z=function(e){var t=e.torrent,n=e.isClicked,r=e.isChecked,c=e.onSelect,a=e.onClick,i="Finished"!==t.status&&"Paused"!==t.status,s=i?"green":"grey",j=function(){var e=Object(o.a)(l.a.mark((function e(n,r){var c,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.stopPropagation(),c=r.checked,a=c?"resume":"pause",e.next=5,fetch("/torrents/".concat(a,"/").concat(t.id));case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),u=function(){var e=Object(o.a)(l.a.mark((function e(n,r){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.stopPropagation(),e.next=3,fetch("/playuri?resume=".concat(t.id));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();return Object(w.jsx)(w.Fragment,{children:Object(w.jsxs)(L.a.Row,{onClick:function(){return a(n?void 0:t)},active:n,children:[Object(w.jsx)(L.a.Cell,{collapsing:!0,textAlign:"center",children:Object(w.jsx)(q.a,{toggle:!0,onChange:j,checked:i})}),Object(w.jsx)(L.a.Cell,{collapsing:!0,textAlign:"center",children:Object(w.jsx)(q.a,{checked:r,onChange:function(e,n){var r;e.stopPropagation(),c(t.id,null!==(r=n.checked)&&void 0!==r&&r)}})}),Object(w.jsx)(L.a.Cell,{collapsing:!0,children:Object(w.jsx)(v.a,{color:"green",icon:"play",floated:"right",onClick:u})}),Object(w.jsx)(L.a.Cell,{children:t.name}),Object(w.jsx)(L.a.Cell,{children:Object(w.jsx)(Q.a,{content:"".concat(t.progress.toFixed(2),"%"),trigger:Object(w.jsx)(Y.a,{percent:t.progress,autoSuccess:!0,size:"small"})})}),Object(w.jsx)(L.a.Cell,{collapsing:!0,textAlign:"center",children:Object(w.jsx)(p.a,{color:s,children:t.status})}),Object(w.jsx)(L.a.Cell,{children:Object(w.jsxs)(K.a,{size:"mini",widths:"2",children:[Object(w.jsx)(T.a,{value:t.ratio.toFixed(2),label:"Seed ratio"}),Object(w.jsx)(Q.a,{content:"Seed time: ".concat(t.seeding_time),trigger:Object(w.jsx)(T.a,{value:"".concat(t.time_ratio.toFixed(2)),label:"Time ratio"})})]})}),Object(w.jsx)(L.a.Cell,{textAlign:"center",children:Object(w.jsx)(p.a,{children:t.size})}),Object(w.jsx)(L.a.Cell,{children:Object(w.jsxs)(K.a,{widths:"2",size:"mini",children:[Object(w.jsx)(T.a,{children:Object(w.jsxs)(X.a,{children:[Object(w.jsx)(z.a,{name:"arrow down",size:"small"})," ".concat(t.download_rate.toFixed(2)," kB/s")]})}),Object(w.jsx)(T.a,{children:Object(w.jsxs)(X.a,{children:[Object(w.jsx)(z.a,{name:"arrow up",size:"small"})," ".concat(t.upload_rate.toFixed(2)," kB/s")]})})]})}),Object(w.jsx)(L.a.Cell,{children:Object(w.jsx)(K.a,{widths:"1",size:"mini",children:Object(w.jsx)(T.a,{value:"".concat(t.seeders," / ").concat(t.seeders_total),label:"Active / Total"})})}),Object(w.jsx)(L.a.Cell,{children:Object(w.jsx)(K.a,{widths:"1",size:"mini",children:Object(w.jsx)(T.a,{value:"".concat(t.peers," / ").concat(t.peers_total),label:"Active / Total"})})})]})})},$=c.a.memo(Z,d.a),ee=function(e){var t=e.torrents,n=e.activeTorrent,c=e.onSetActiveTorrent,a=Object(r.useState)([]),i=Object(j.a)(a,2),s=i[0],l=i[1],o=Object(r.useCallback)((function(e,t){l(t?function(t){return[].concat(Object(V.a)(t),[e])}:function(t){return t.filter((function(t){return t!==e}))})}),[]);return Object(w.jsx)(w.Fragment,{children:Object(w.jsxs)(L.a,{compact:"very",size:"small",stackable:!0,children:[Object(w.jsx)(L.a.Header,{className:"mobile-hidden",children:Object(w.jsxs)(L.a.Row,{children:[Object(w.jsx)(L.a.HeaderCell,{}),Object(w.jsx)(L.a.HeaderCell,{children:Object(w.jsx)(q.a,{onChange:function(e,n){var r,c;return c=null!==(r=n.checked)&&void 0!==r&&r,void l(c?t.map((function(e){return e.id})):[])},checked:s.length>=t.length})}),Object(w.jsx)(L.a.HeaderCell,{}),Object(w.jsx)(L.a.HeaderCell,{children:"Name"}),Object(w.jsx)(L.a.HeaderCell,{children:"Progress"}),Object(w.jsx)(L.a.HeaderCell,{children:"Status"}),Object(w.jsx)(L.a.HeaderCell,{children:"Ratios"}),Object(w.jsx)(L.a.HeaderCell,{children:"Size"}),Object(w.jsx)(L.a.HeaderCell,{children:"Rates"}),Object(w.jsx)(L.a.HeaderCell,{children:"Seeds"}),Object(w.jsx)(L.a.HeaderCell,{children:"Peers"})]})}),Object(w.jsx)(L.a.Body,{children:t.map((function(e){return Object(w.jsx)($,{torrent:e,onSelect:o,onClick:c,isClicked:(null===n||void 0===n?void 0:n.id)===e.id,isChecked:s.includes(e.id)},e.id)}))}),Object(w.jsx)(L.a.Footer,{fullWidth:!0,children:Object(w.jsxs)(L.a.Row,{children:[Object(w.jsx)(L.a.HeaderCell,{}),Object(w.jsxs)(L.a.HeaderCell,{colSpan:10,children:[Object(w.jsx)(W,{}),Object(w.jsx)(J,{torrentIdsToDelete:s})]})]})})]})})},te=n(206),ne=n(209),re=n(145),ce=n(91),ae=n(148),ie=n(147),se=function(e){var t=e.pieces,n=Object(r.useRef)(null),c=Object(r.useRef)(null),a=Object(ie.a)({ref:c}).width,i=Object(ae.useDebounce)(a,100),s=Object(j.a)(i,1)[0];return Object(r.useEffect)((function(){if(s){var e=n.current;if(e){var r=e.getContext("2d");if(r){var a=c.current;a&&function(e,t,n){var r=e.clientWidth,c=Math.floor(r/9),a=9*Math.ceil(n.length/c),i=t.canvas;i.width=r,i.height=a+30;for(var s=0;s<n.length;s+=1){var l=void 0;switch(n[s]){case"+":l="#4CAF50";break;case"-":l="#F0B8B8";break;default:l="#ECEFF1"}t.fillStyle=l,t.fillRect(s%c*9,9*Math.floor(s/c),8,8)}!function(e,t){var n=e.canvas.height-t/2;e.font="15px sans-serif";var r=10.4,c=function(t,c,a){e.fillStyle=t,e.fillRect(c,n,r,r),e.fillStyle="black",e.fillText(a,c+16,n+r)};c("#4CAF50",0,"- Done"),c("#ECEFF1",70,"- Queued"),c("#F0B8B8",170,"- Not selected")}(t,30)}(a,r,t)}}}}),[t,s]),Object(w.jsx)("div",{ref:c,children:Object(w.jsx)("canvas",{ref:n})})},le=function(e){var t=function(e){var t={};return e.forEach((function(e){for(var n=t,r=0;r<e.length;r+=1){var c=e[r];c in n||(n[c]={}),n=n[c]}})),t}(e);return Object(w.jsx)(te.a,{children:Object(w.jsx)(te.a.Item,{children:Object(w.jsx)(te.a.Content,{children:function e(t){return Object.keys(t).map((function(n){var r=Object.keys(t[n]).length>0;return Object(w.jsx)(te.a.List,{children:Object(w.jsxs)(te.a.Item,{children:[Object(w.jsx)(te.a.Icon,{name:r?"folder":"file"}),Object(w.jsxs)(te.a.Content,{children:[r?Object(w.jsx)(te.a.Header,{children:n}):Object(w.jsx)(te.a.Description,{children:n}),e(t[n])]})]})},n)}))}(t)})})})},oe=function(e){var t=e.torrent,n=Object(r.useState)([]),c=Object(j.a)(n,2),a=c[0],i=c[1],s=Object(r.useState)(""),u=Object(j.a)(s,2),d=u[0],b=u[1],h=Object(r.useState)(!0),O=Object(j.a)(h,2),x=O[0],f=O[1];Object(r.useEffect)((function(){f(!0);var e=function(){var e=Object(o.a)(l.a.mark((function e(){var n,r,c,a,s,o,j;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new RegExp("".concat(t.id,".+?Files.+?:\\s+(?<files>.+?)\\n\\n.+?Pieces:\\s+(?<pieces>.+?)\\n\\n\\n"),"gs"),e.next=3,fetch("/info");case 3:return r=e.sent,e.next=6,r.text();case 6:if(c=e.sent,(a=n.exec(c))&&a.groups){e.next=10;break}return e.abrupt("return");case 10:s=a.groups,o=s.files,j=s.pieces,i(o.split("\n").map((function(e){return e.trim()}))),b(j.split("\n").map((function(e){return e.trim()})).join("")),f(!1);case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e();var n=setInterval((function(){e()}),m());return function(){return clearInterval(n)}}),[t.id]);var p=[{menuItem:{key:"general",content:"General"},render:function(){return Object(w.jsx)(ne.a.Pane,{children:Object(w.jsx)(A.a,{children:Object(w.jsx)(re.a,{children:Object(w.jsxs)(ce.a,{children:[Object(w.jsxs)("div",{children:[Object(w.jsx)("b",{children:"Name:"})," ",t.name]}),Object(w.jsxs)("div",{children:[Object(w.jsx)("b",{children:"Size:"})," ",t.size]})]})})})})}},{menuItem:{key:"files",content:"Files"},render:function(){return Object(w.jsx)(ne.a.Pane,{loading:x,children:Object(w.jsx)(A.a,{children:Object(w.jsx)(re.a,{children:Object(w.jsx)(ce.a,{children:le(a.map((function(e){return e.split("/")})))})})})})}},{menuItem:{key:"pieces",content:"Pieces"},render:function(){return Object(w.jsx)(ne.a.Pane,{loading:x,children:Object(w.jsx)(se,{pieces:d})})}}];return Object(w.jsx)(w.Fragment,{children:Object(w.jsx)(ne.a,{panes:p})})};n(180),n(181);var je=function(){var e=Object(r.useState)([]),t=Object(j.a)(e,2),n=t[0],c=t[1],a=Object(r.useState)(),i=Object(j.a)(a,2),s=i[0],u=i[1];return Object(r.useEffect)((function(){var e=function(){var e=Object(o.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/torrents/list");case 2:return t=e.sent,e.next=5,t.json();case 5:n=e.sent,c((function(e){return d()(e,n)?e:n}));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e();var t=setInterval((function(){e()}),m());return function(){return clearInterval(t)}}),[]),Object(w.jsxs)("div",{className:"App",children:[Object(w.jsx)(k,{}),Object(w.jsxs)("div",{children:[Object(w.jsx)(_,{totalDownloadRate:n.reduce((function(e,t){return e+t.download_rate}),0),totalUploadRate:n.reduce((function(e,t){return e+t.upload_rate}),0),active:n.filter((function(e){return"Finished"!==e.status})).length,finished:n.filter((function(e){return"Finished"===e.status})).length,total:n.length}),Object(w.jsx)(ee,{torrents:n,onSetActiveTorrent:u,activeTorrent:s}),void 0!==s&&Object(w.jsx)(oe,{torrent:s})]})]})};i.a.render(Object(w.jsx)(c.a.StrictMode,{children:Object(w.jsx)(je,{})}),document.getElementById("root"))}},[[182,1,2]]]);
//# sourceMappingURL=main.8f45dc2b.chunk.js.map