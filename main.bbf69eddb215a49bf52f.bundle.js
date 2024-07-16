(()=>{"use strict";var e,t={877:(e,t,s)=>{var i=s(440),l=s.n(i);const n=["item1","item2","item3","item4","item5","item6"],a=64,r=20,h=2*Math.PI,o=757,c=2376980/1451,d=[[[0,0],[-1,0],[1,0],[0,-1],[0,-2]],[[0,0],[-1,0],[1,0],[0,1],[0,2]],[[0,0],[-1,0],[0,-1],[0,1],[-2,0]],[[0,0],[1,0],[0,-1],[0,1],[2,0]],[[0,0],[-1,0],[1,0],[0,-1],[0,1]],[[0,0],[0,-1],[0,-2],[1,0],[2,0]],[[0,0],[0,-1],[0,-2],[-1,0],[-2,0]],[[0,0],[0,1],[0,2],[1,0],[2,0]],[[0,0],[0,1],[0,2],[-1,0],[-2,0]]];class p{constructor(e){this.score=0,this.milestone=1e3,this.multiplier=1,this.scene=e,this.scoreText=this.scene.add.text(0,0,`${this.score}`,{fontSize:"80px",color:"#fff",fontStyle:"bold",align:"center"}),this.scoreText.setOrigin(.5)}static getInstance(e){return p.instance||(p.instance=new p(e)),p.instance}getScore(){return this.score}setScore(e){this.score=e}addScore(e){this.score+=e,this.scene.tweens.add({targets:this.scoreText,scale:1.2,duration:100,yoyo:!0,repeat:0})}getScoreText(){return this.scoreText}update(){this.scoreText.setText(`${this.score}`)}getMilestone(){return this.milestone}setMilestone(e){this.milestone=e}resetScore(){this.score=0}resetMilestone(){this.milestone=1e3}getMultiplier(){return this.multiplier}setMultiplier(e){this.multiplier=e}matchScore(e,t){let s=0;switch(e){case"3":s=100*this.multiplier;break;case"4":s=200*this.multiplier;break;case"5":s=300*this.multiplier;break;case"T":s=400*this.multiplier;break;case"special":s=100*t*this.multiplier;break;default:s=10*t*this.multiplier}return this.addScore(s),Math.floor(s)}}const g=p;class u{constructor(e){this.scene=e,this.emitters=[]}static getInstance(e){return u.instance||(u.instance=new u(e)),u.instance}initializeWithSize(e){if(!(this.emitters.length>0||e<=0))for(let t=0;t<e;t++){const e=this.scene.add.particles(0,0,"star",{speed:{min:100,max:200},lifespan:1e3,blendMode:"ADD",gravityY:100,emitting:!1,scale:{start:.1,end:0}});e.setVisible(!1),e.setActive(!1),this.emitters.push(e)}}spawn(e,t){let s=this.emitters.find((e=>!e.active));return s||(s=this.scene.add.particles(0,0,"star",{speed:{min:100,max:200},lifespan:1e3,blendMode:"ADD",gravityY:100,emitting:!1,scale:{start:.1,end:0}}),this.emitters.push(s)),s.setVisible(!0),s.setActive(!0),console.log(this.emitters.length),s}despawn(e){e&&(e.setVisible(!1),e.setActive(!1),e.stopFollow())}}const y=u;class f{constructor(e){this.scene=e,this.emitters=[]}static getInstance(e){return f.instance||(f.instance=new f(e)),f.instance}initializeWithSize(e){if(!(this.emitters.length>0||e<=0))for(let t=0;t<e;t++){const e=this.scene.add.particles(0,0,"star",{speed:{min:100,max:200},lifespan:500,blendMode:"ADD",gravityY:100,emitting:!0,scale:{start:.1,end:0}});e.setVisible(!1),e.setActive(!1),this.emitters.push(e)}}spawn(e,t){let s=this.emitters.find((e=>!e.active));return s||(s=this.scene.add.particles(0,0,"star",{speed:{min:30,max:50},lifespan:1e3,blendMode:"ADD",gravityY:10,emitting:!0,scale:{start:.1,end:0}}),this.emitters.push(s)),s.setPosition(e,t),s.start(),s.setVisible(!0),s.setActive(!0),s}despawn(e){e&&(e.stop(),e.setVisible(!1),e.setActive(!1))}}const x=f;class m{constructor(e){this.tiles={},this.scene=e,n.forEach((e=>{this.tiles[e]=[]})),this.explosionPool=y.getInstance(this.scene)}static getInstance(e){return m.instance||(m.instance=new m(e)),m.instance}initializeWithSize(e){n.forEach((t=>{if(!(this.tiles[t].length>0||e<=0))for(let s=0;s<e;s++){const e=new w({scene:this.scene,x:0,y:0,texture:t});e.setVisible(!1),e.setActive(!1),this.tiles[t].push(e)}}))}spawn(e,t,s){let i=this.tiles[s].find((e=>!e.active));return i?i.setTexture(s):(i=new w({scene:this.scene,x:0,y:0,texture:s}),this.tiles[s].push(i)),i.setPosition(e,t),i.setVisible(!0),i.setActive(!0),i.emitter=this.explosionPool.spawn(e,t),i.emitter.startFollow(i),i.emitter.setDepth(2),i.state="spawned",i}despawn(e){e.setVisible(!1),e.setActive(!1),e.emitter&&(e.emitter.explode(20),this.scene.time.delayedCall(1e3,(()=>{this.explosionPool.despawn(e.emitter)}))),e.state="despawned"}}const T=m;class S extends Phaser.GameObjects.Sprite{constructor(e){super(e.scene,e.x,e.y,e.texture),this.setOrigin(.5,.5),this.setInteractive(),this.scene=e.scene,this.scene.add.existing(this),this.scene.input.setDraggable(this),this.displayWidth=a,this.displayHeight=a,this.width=a,this.height=a,this.tilesPool=T.getInstance(this.scene);const t=this.texture.key.slice(0,5);this.anims.create({key:"explode",frames:[{key:t+"_explode_4"},{key:t+"_explode_3"},{key:t+"_explode_2"},{key:t+"_explode_1",duration:50}],frameRate:20,repeat:0,hideOnComplete:!0});const s=y.getInstance(this.scene);this.emitter=s.spawn(0,0),this.emitter.startFollow(this),this.emitter.setDepth(2)}getExplodedTile(e,t=""){return[]}explode(){this.emitter.explode(20),this.play({key:"explode"}).on("animationcomplete",(()=>{this.destroy()}))}swapDestroy(e,t){return[]}}const w=S,M=class{},v=class extends M{constructor(e,t){super(),this.grid=e,this.scene=t,this.elapsedTime=0,this.scoreManager=g.getInstance(this.scene)}enter(){console.log("MoveState: enter"),this.grid.checkMatches()?this.stateMachine.transition("fill"):this.stateMachine.transition("play")}exit(){console.log("MoveState: exit"),this.elapsedTime=0}execute(e,t){this.elapsedTime+=t,this.elapsedTime>1e3&&(this.grid.checkMatches()?this.stateMachine.transition("fill"):this.stateMachine.transition("play"),this.elapsedTime=0),console.log("MoveState: update")}},O=class extends M{constructor(e,t){super(),this.grid=e,this.scene=t,this.elapsedTime=0,this.scoreManager=g.getInstance(this.scene)}enter(){console.log("PlayState: enter");const e=this.scoreManager.getScore(),t=this.scoreManager.getMilestone();if(console.log(e,t),e>=t)console.log("Its shuffle time"),this.stateMachine.transition("shuffle");else{this.grid.getTileGrid().forEach((e=>{e.forEach((e=>{e&&e.setInteractive()}))}));const e=this.grid.getPossibleMove(this.grid.getTileGrid());if(0===e.length)this.stateMachine.transition("shuffle");else{const t=e[Phaser.Math.Between(0,e.length-1)],s=this.grid.getFirstHintBox(),i=this.grid.getSecondHintBox();s.x=r+79*t.x1,s.y=r+79*t.y1,i.x=r+79*t.x2,i.y=r+79*t.y2}}}exit(){console.log("PlayState: exit"),this.grid.getFirstHintBox().setVisible(!1),this.grid.getSecondHintBox().setVisible(!1),this.elapsedTime=0,this.grid.getTileGrid().forEach((e=>{e.forEach((e=>{e&&e.disableInteractive()}))}))}execute(e,t){if(this.elapsedTime+=t,this.elapsedTime>5e3&&(this.grid.getFirstHintBox().setVisible(!0),this.grid.getSecondHintBox().setVisible(!0)),this.elapsedTime>1e4){const e=this.grid.getTileGrid();for(let t=0;t<e.length;t++)for(let s=0;s<e[t].length;s++)e[t][s]&&this.scene.tweens.add({targets:e[t][s],displayWidth:76.8,displayHeight:76.8,ease:"Sine.easeInOut",duration:200,delay:50*t+50*s,yoyo:!0,repeat:0});this.elapsedTime=0}console.log("PlayState: update")}},b=class extends M{constructor(e,t){super(),this.grid=e,this.scene=t,this.elapsedTime=0}enter(){console.log("SwapState: enter"),this.grid.getSecondSelectedTile()&&this.grid.getFirstSelectedTile()&&this.grid.swapTiles()}exit(){console.log("SwapState: exit");const e=this.grid.getFirstSelectedTile(),t=this.grid.getSecondSelectedTile();e&&(this.scene.tweens.killTweensOf(e),e.displayWidth=a,e.displayHeight=a),t&&(this.scene.tweens.killTweensOf(t),t.displayWidth=a,t.displayHeight=a)}execute(e,t){console.log("SwapState: update"),this.elapsedTime+=t,this.elapsedTime>400&&this.stateMachine.transition("match")}},G=class extends M{constructor(e,t){super(),this.grid=e,this.scene=t,this.tileGroup=this.scene.add.group(),this.circle=new Phaser.Geom.Circle(378.5,300,64),this.elapsedTime=0,this.spawned=!1}enter(){console.log("ShuffleState: enter");const e=this.grid.getTileGrid();this.tileGroup.clear(!1,!1);for(let t=0;t<8;t++){e[t]||(e[t]=[]);for(let s=0;s<8;s++){let i=e[t][s];i||(i=this.grid.addTile(s,t),e[t][s]=i),this.tileGroup.add(i)}}if(this.spawned)for(let t=0;t<e.length;t++)for(let s=0;s<e[t].length;s++){const i=e[t][s];i&&(i.state="created",this.scene.tweens.add({targets:i,x:this.circle.x,y:this.circle.y,ease:"Cubic.easeIn",duration:300,delay:50*t+50*s,repeat:0,yoyo:!1,onComplete:()=>{i.state="spawned"}}))}this.circle.radius=64,this.scene.tweens.add({targets:this.circle,radius:228,ease:"Quintic.easeInOut",duration:2e3,delay:this.spawned?1500:0,repeat:0,onStart:()=>{Phaser.Actions.PlaceOnCircle(this.tileGroup.getChildren(),this.circle)},onUpdate:()=>{Phaser.Actions.RotateAroundDistance(this.tileGroup.getChildren(),{x:this.circle.x,y:this.circle.y},.1,this.circle.radius)},onComplete:()=>{console.log("tween complete");for(let t=0;t<e.length;t++)for(let s=0;s<e[t].length;s++){const i=e[t][s];i&&(i.state="created",this.scene.tweens.add({targets:i,x:r+79*s+32,y:r+79*t+32,ease:"Cubic.easeInOut",duration:300,delay:100*t+50*s,repeat:0,yoyo:!1,onComplete:()=>{i.state="spawned"}}))}}}),this.spawned=!0}exit(){console.log("ShuffleState: exit"),this.elapsedTime=0}execute(e,t){this.elapsedTime+=t,this.elapsedTime>=3350&&this.stateMachine.transition("match"),console.log("ShuffleState: update")}},P=class extends M{constructor(e,t){super(),this.grid=e,this.scene=t,this.elapsedTime=0,this.filled=!1}enter(){this.grid.resetTile(),this.grid.fillTile()}exit(){console.log("FillState: exit"),this.elapsedTime=0,this.filled=!1}execute(e,t){console.log("FillState: update");const s=this.grid.getTileGrid();s.every((e=>e.every((e=>e&&("moving"==e.state||"spawned"==e.state)))))&&(this.grid.fillTile(),this.filled=!0),s.every((e=>e.every((e=>e&&"spawned"==e.state))))&&this.filled&&this.stateMachine.transition("match")}},k=class{constructor(e,t){this.possibleStates={},this.initialState=e,this.possibleStates=t,this.state=null;for(const e in this.possibleStates)this.possibleStates[e].stateMachine=this}update(e,t){null===this.state&&(this.state=this.initialState,this.possibleStates[this.state].enter()),this.possibleStates[this.state].execute(e,t)}transition(e){this.state&&this.possibleStates[this.state].exit(),this.state=e,this.possibleStates[this.state].enter()}getState(){return this.state}};function E(e){return e.reduce(((e,t)=>e.concat(t)),[])}const C=class extends w{constructor(e){super(e);const t=x.getInstance(this.scene);this.specialEmitter=t.spawn(0,0),this.specialEmitter.startFollow(this),this.specialEmitter.name="specialEmitter",this.specialEmitter.setDepth(-10)}getExplodedTile(e){const t=e.getTileGrid(),s=e.getTilePos(t,this),i=[];if(-1!==s.x&&-1!==s.y){for(let e=0;e<8;e++){const l=t[e][s.x];l&&e!==s.y&&i.push(l)}for(let e=0;e<8;e++){const l=t[s.y][e];l&&e!==s.x&&i.push(l)}}return i}};class B extends w{constructor(e){super(Object.assign(Object.assign({},e),{texture:"choco"}));const t=x.getInstance(this.scene);this.specialEmitter=t.spawn(0,0),this.specialEmitter.startFollow(this),this.specialEmitter.name="specialEmitter",this.specialEmitter.setDepth(-1),this.texture.key="choco"}getExplodedTile(e,t){const s=e.getTileGrid(),i=e.getTilePos(s,this),l=[];if(-1!==i.x&&-1!==i.y)for(let e=0;e<8;e++)for(let n=0;n<8;n++){const a=s[e][n];a&&a.texture.key.includes(t)&&(e!=i.y||n!=i.x)&&l.push(a)}return l}swapDestroy(e,t){return t instanceof B?E(e.getTileGrid()):this.getExplodedTile(e,t.texture.key)}}const I=B,H=class extends w{constructor(e){super(e);const t=x.getInstance(this.scene);this.specialEmitter=t.spawn(0,0),this.specialEmitter.startFollow(this),this.specialEmitter.name="specialEmitter",this.specialEmitter.setDepth(-1)}getExplodedTile(e){const t=e.getTileGrid(),s=e.getTilePos(t,this),i=[];if(-1!==s.x&&-1!==s.y)for(let e=s.y-1;e<=s.y+1;e++)for(let l=s.x-1;l<=s.x+1;l++)if(e>=0&&e<8&&l>=0&&l<8){const n=t[e][l];e==s.y&&l==s.x||!n||i.push(n)}return i}};class D extends Phaser.GameObjects.Container{constructor(e){super(e),this.scene=e,this.tileGrid=[],this.canMove=!0,this.explosionPool=new y(this.scene),this.explosionPool.initializeWithSize(64),this.specialTileEffectPool=new x(this.scene),this.specialTileEffectPool.initializeWithSize(4);const t=this.scene.add.image(0,0,"grid");t.setOrigin(0),t.displayWidth=657,t.width=t.displayWidth,t.displayHeight=657,t.height=t.displayHeight,this.add(t),this.jellyDestroy=this.scene.sound.add("jellyDestroy"),this.jellyDrop=this.scene.sound.add("drop"),this.wrongMatch=this.scene.sound.add("wrongMatch"),this.stateMachine=new k("shuffle",{shuffle:new G(this,e),play:new O(this,e),match:new v(this,e),swap:new b(this,e),fill:new P(this,e)}),this.selectedTiledOutline=this.scene.add.image(0,0,"selectedTile"),this.selectedTiledOutline.setTint(16711680),this.selectedTiledOutline.setOrigin(.5),this.selectedTiledOutline.displayWidth=74,this.selectedTiledOutline.displayHeight=74,this.selectedTiledOutline.width=a,this.selectedTiledOutline.height=a,this.selectedTiledOutline.setVisible(!1),this.firstHintBox=this.scene.add.graphics(),this.firstHintBox.lineStyle(5,16711680),this.firstHintBox.strokeRect(0,0,a,a),this.firstHintBox.setVisible(!1),this.secondHintBox=this.scene.add.graphics(),this.secondHintBox.lineStyle(5,16711680),this.secondHintBox.strokeRect(0,0,a,a),this.secondHintBox.setVisible(!1),this.scene.tweens.add({targets:this.firstHintBox,alpha:0,ease:"Sine.easeInOut",duration:700,repeat:-1,yoyo:!0}),this.scene.tweens.add({targets:this.secondHintBox,alpha:0,ease:"Sine.easeInOut",duration:700,repeat:-1,yoyo:!0}),this.add(this.firstHintBox),this.add(this.secondHintBox),this.bringToTop(this.firstHintBox),this.bringToTop(this.secondHintBox),this.add(this.selectedTiledOutline),this.width=t.displayWidth,this.height=t.displayHeight,this.scoreManager=g.getInstance(e),this.scene.add.existing(this),this.scene.input.on("gameobjectdown",this.tileDown,this)}update(e,t){this.stateMachine.update(e,t)}getTileGrid(){return this.tileGrid}getFirstSelectedTile(){return this.firstSelectedTile}getSecondSelectedTile(){return this.secondSelectedTile}getFirstHintBox(){return this.firstHintBox}getSecondHintBox(){return this.secondHintBox}reshuffle(){let e=E(this.tileGrid);e=function(e){for(let t=e.length-1;t>0;t--){const s=Math.floor(Math.random()*(t+1)),i=e[t];e[t]=e[s],e[s]=i}return e}(e),console.log("Grid check: ",e==this.tileGrid),this.tileGrid=function(e,t,s){const i=[];for(let t=0;t<8;t++)i.push(e.slice(8*t,8*t+8));return i}(e),console.log("Grid check: ",e==this.tileGrid);for(let e=0;e<8;e++)for(let t=0;t<8;t++)null!=this.tileGrid[e][t]&&this.setTilePosition(this.tileGrid[e][t],t,e)}addTile(e,t){const s=n[Phaser.Math.RND.between(0,n.length-1)],i=new w({scene:this.scene,x:r+79*e+32,y:(t>=0?r:-20)+79*t+32,texture:s});return i.state="created",this.add(i),this.add(i.emitter),i}setTilePosition(e,t,s){e.x=r+79*t+32,e.y=r+79*s+32}tileDown(e,t,s){if(console.log("tile down"),this.canMove)if(console.log("haha"),this.firstSelectedTile){this.secondSelectedTile=t,console.log("second tile selected");const e=Math.floor(Math.abs(this.firstSelectedTile.x-this.secondSelectedTile.x-15)/a),s=Math.floor(Math.abs(this.firstSelectedTile.y-this.secondSelectedTile.y-15)/a);console.log(e,s),1===e&&0===s||0===e&&1===s?(this.canMove=!1,console.log("can move"),this.selectedTiledOutline.setVisible(!1),this.firstHintBox.setVisible(!1),this.secondHintBox.setVisible(!1),"play"==this.stateMachine.getState()&&(this.scene.tweens.add({targets:this.secondSelectedTile,displayWidth:76.8,displayHeight:76.8,ease:"Sine.easeInOut",duration:200,yoyo:!0,repeat:-1}),this.stateMachine.transition("swap"))):(this.scene.tweens.killTweensOf(this.firstSelectedTile),this.firstSelectedTile.displayWidth=a,this.firstSelectedTile.displayHeight=a,this.firstSelectedTile=this.secondSelectedTile,this.secondSelectedTile=void 0,this.selectedTiledOutline.x=this.firstSelectedTile.x,this.selectedTiledOutline.y=this.firstSelectedTile.y,this.scene.tweens.add({targets:this.firstSelectedTile,displayWidth:76.8,displayHeight:76.8,ease:"Sine.easeInOut",duration:200,yoyo:!0,repeat:-1}))}else this.firstSelectedTile=t,this.selectedTiledOutline.setVisible(!0),this.selectedTiledOutline.x=t.x,this.selectedTiledOutline.y=t.y,console.log("first tile selected"),this.scene.tweens.add({targets:this.firstSelectedTile,displayWidth:76.8,displayHeight:76.8,ease:"Sine.easeInOut",duration:200,yoyo:!0,repeat:-1})}swapTiles(){if(this.firstSelectedTile&&this.secondSelectedTile){console.log("swap tiles");const e={x:this.firstSelectedTile.x,y:this.firstSelectedTile.y},t={x:this.secondSelectedTile.x,y:this.secondSelectedTile.y};this.tileGrid[(e.y-r-32)/79][(e.x-r-32)/79]=this.secondSelectedTile,this.tileGrid[(t.y-r-32)/79][(t.x-r-32)/79]=this.firstSelectedTile,this.scene.add.tween({targets:this.firstSelectedTile,x:this.secondSelectedTile.x,y:this.secondSelectedTile.y,ease:"Cubic.easeInOut",duration:400,repeat:0,yoyo:!1}),this.scene.add.tween({targets:this.secondSelectedTile,x:this.firstSelectedTile.x,y:this.firstSelectedTile.y,ease:"Cubic.easeInOut",duration:400,repeat:0,yoyo:!1,onComplete:()=>{"swap"==this.stateMachine.getState()&&this.stateMachine.transition("match")}}),this.canMove=!0,console.log((e.y-r-32)/79,(e.x-r-32)/79),this.firstSelectedTile=this.tileGrid[(e.y-r-32)/79][(e.x-r-32)/79],this.secondSelectedTile=this.tileGrid[(t.y-r-32)/79][(t.x-r-32)/79]}}checkMatches(){const e=this.getMatches(this.tileGrid);return e.length>0?(this.removeMatchedGroup(e),this.tileUp(),!0):(this.firstSelectedTile&&this.secondSelectedTile&&this.wrongMatch.play(),this.swapTiles(),this.tileUp(),this.canMove=!0,this.scoreManager.setMultiplier(1),!1)}resetTile(){for(let e=0;e<8;e++){let t=!1,s=-1,i=7,l=0;for(;i>=0;){const n=this.tileGrid[i][e];t?n&&(this.tileGrid[s][e]=n,n.state="moved",this.scene.add.tween({targets:n,y:r+79*s+32,ease:"Quad.easeIn",duration:400,delay:50*l,repeat:0,yoyo:!1,onComplete:()=>{n.state="spawned",this.jellyDrop.play()},onStart:()=>{n.state="moving"}}),l++,this.tileGrid[i][e]=void 0,t=!1,i=s,s=-1):n||(t=!0,-1==s&&(s=i)),i--}}}fillTile(){const e=[],t=[];for(let e=0;e<8;e++)t[e]=1;for(let s=this.tileGrid.length-1;s>=0;s--)for(let i=0;i<this.tileGrid[s].length;i++)if(void 0===this.tileGrid[s][i]){e[i]||(e[i]=[]);const l=this.addTile(i,-e[i].length-1);this.add(l),this.add(l.emitter),this.scene.add.tween({targets:l,y:r+79*s+32,ease:"Quad.easeIn",duration:400,repeat:0,yoyo:!1,delay:50*t[i],onComplete:()=>{l.state="spawned",this.jellyDrop.play()}}),t[i]++,e[i].push(l),this.tileGrid[s][i]=l}}tileUp(){this.firstSelectedTile=void 0,this.secondSelectedTile=void 0}removeMatchedGroup(e){for(let t=0;t<e.length;t++){const s=e[t],i=this.tileGrid[s.y][s.x];if(i){const e=this.scoreManager.matchScore(s.type,s.pattern.length);let t=this.scoreManager.getMultiplier()+.2;t>3&&(t=3),this.scoreManager.setMultiplier(t);const l=this.scene.add.text(i.x,i.y,`${e}`,{fontSize:"48px",color:"#ff0",fontStyle:"bold"});l.setOrigin(.5),this.add(l),this.scene.tweens.add({targets:l,y:i.y-50,alpha:0,ease:"Quad.easeIn",duration:2e3,repeat:0,yoyo:!1,onComplete:()=>{l.destroy()}})}if("T"===s.type){const e=this.tileGrid[s.y][s.x];if(e){const t=new C({scene:this.scene,x:e?e.x:0,y:e?e.y:0,texture:e?e.texture.key.slice(0,5)+"_stripes_h":"item1_stripes_h"});this.add(t),t.state="spawned";for(let e=0;e<s.pattern.length;e++){const i=s.pattern[e][0],l=s.pattern[e][1],n=this.tileGrid[s.y+l][s.x+i];n&&(this.scene.tweens.add({targets:n,x:t.x,y:t.y,ease:"Sine.easeInOut",duration:200,yoyo:!1,repeat:0,onComplete:()=>{n.emitter.explode(20),this.scene.time.delayedCall(1e3,(()=>{this.explosionPool.despawn(n.emitter)})),this.specialTileEffectPool.despawn(n.specialEmitter),this.jellyDestroy.play(),n.destroy()}}),this.tileGrid[s.y+l][s.x+i]=void 0),this.tileGrid[s.y][s.x]=t}}}else if("3"==s.type)for(let e=0;e<s.pattern.length;e++){const t=s.pattern[e][0],i=s.pattern[e][1],l=this.tileGrid[s.y+i][s.x+t];l&&this.destroyTile(l)}else if("4"===s.type||"5"===s.type||"6"===s.type){const e=this.tileGrid[s.y][s.x];if(e){let t;t="4"===s.type?new H({scene:this.scene,x:e?e.x:0,y:e?e.y:0,texture:e?e.texture.key.slice(0,5)+"_extra":"item1_extra"}):new I({scene:this.scene,x:e?e.x:0,y:e?e.y:0,texture:""}),this.add(t),t.state="spawned";for(let e=0;e<s.pattern.length;e++){const i=s.pattern[e][0],l=s.pattern[e][1],n=this.tileGrid[s.y+l][s.x+i];n&&(this.scene.tweens.add({targets:n,x:t.x,y:t.y,ease:"Sine.easeInOut",duration:200,yoyo:!1,repeat:0,onComplete:()=>{n.emitter.explode(20),this.scene.time.delayedCall(1e3,(()=>{this.explosionPool.despawn(n.emitter)})),this.specialTileEffectPool.despawn(n.specialEmitter),n.destroy(),this.jellyDestroy.play()}}),this.tileGrid[s.y+l][s.x+i]=void 0)}this.tileGrid[s.y][s.x]=t}}}}destroyTile(e){const t=this.getTilePos(this.tileGrid,e);if(-1!==t.x&&-1!==t.y){this.scene.time.delayedCall(1e3,(()=>{this.explosionPool.despawn(e.emitter)})),this.specialTileEffectPool.despawn(e.specialEmitter);const s=e.getExplodedTile(this);this.tileGrid[t.y][t.x]=void 0,s.forEach((t=>{t&&t!==e&&this.destroyTile(t)})),e.explode(),this.jellyDestroy.play()}}getTilePos(e,t){const s={x:-1,y:-1};for(let i=0;i<e.length;i++)for(let l=0;l<e[i].length;l++)if(t===e[i][l]){s.x=l,s.y=i;break}return s}getPossibleMove(e){const t=[];for(let s=0;s<e.length;s++)for(let i=0;i<e[s].length;i++){if(i<e[s].length-1){let l=e[s][i];e[s][i]=e[s][i+1],e[s][i+1]=l,this.getMatches(e).length>0&&t.push({x1:i,x2:i+1,y1:s,y2:s}),l=e[s][i],e[s][i]=e[s][i+1],e[s][i+1]=l}if(s<e.length-1){let l=e[s][i];e[s][i]=e[s+1][i],e[s+1][i]=l,this.getMatches(e).length>0&&t.push({x1:i,x2:i,y1:s,y2:s+1}),l=e[s][i],e[s][i]=e[s+1][i],e[s+1][i]=l}}return t}getMatches(e){var t,s,i,l,n,a;const r=[];let h=[];const o=[];let c=0;for(let l=0;l<e.length;l++){const n=e[l];h=[];for(let a=0;a<n.length;a++){let p=!1;if(d.forEach((t=>{this.checkPattern(a,l,e,t)&&(o.push({type:"T",x:a,y:l,pattern:t,priority:1}),p=!0)})),a<n.length-2&&!p&&e[l][a]&&e[l][a+1]&&e[l][a+2]){const n=null===(t=e[l][a])||void 0===t?void 0:t.texture.key.slice(0,5),d=null===(s=e[l][a+1])||void 0===s?void 0:s.texture.key.slice(0,5),p=null===(i=e[l][a+2])||void 0===i?void 0:i.texture.key.slice(0,5);if(n===d&&d===p){if(h.length>0&&-1==h.indexOf(e[l][a])){r.push(h);const e=[];let t,s=0;const i=h.indexOf(this.firstSelectedTile),n=h.indexOf(this.secondSelectedTile);-1!==i&&this.firstSelectedTile?(t=this.firstSelectedTile,s=i):-1!==n&&this.secondSelectedTile&&(t=this.secondSelectedTile,s=n);for(let t=0;t<h.length;t++)e.push([t-s,0]);if(t){const s=this.getTilePos(this.tileGrid,t);o.push({type:`${h.length}`,x:s.x,y:s.y,pattern:e,priority:2})}else o.push({type:`${h.length}`,x:c+1-h.length,y:l,pattern:e,priority:2});h=[]}-1==h.indexOf(e[l][a])&&h.push(e[l][a]),-1==h.indexOf(e[l][a+1])&&h.push(e[l][a+1]),-1==h.indexOf(e[l][a+2])&&h.push(e[l][a+2]),c=a+2}}}if(h.length>0){let e;r.push(h);let t=0;const s=[],i=h.indexOf(this.firstSelectedTile),n=h.indexOf(this.secondSelectedTile);-1!==i&&this.firstSelectedTile?(e=this.firstSelectedTile,t=i):-1!==n&&this.secondSelectedTile&&(e=this.secondSelectedTile,t=n);for(let e=0;e<h.length;e++)s.push([e-t,0]);if(e){const t=this.getTilePos(this.tileGrid,e);o.push({type:`${h.length}`,x:t.x,y:t.y,pattern:s,priority:2})}else o.push({type:`${h.length}`,x:c+1-h.length,y:l,pattern:s,priority:2})}}c=0;for(let t=0;t<e.length;t++){const s=e[t];h=[];for(let i=0;i<s.length;i++){let p=!1;if(d.forEach((s=>{this.checkPattern(t,i,e,s)&&(p=!0)})),i<s.length-2&&!p&&e[i][t]&&e[i+1][t]&&e[i+2][t]){const s=null===(l=e[i][t])||void 0===l?void 0:l.texture.key.slice(0,5),d=null===(n=e[i+1][t])||void 0===n?void 0:n.texture.key.slice(0,5),p=null===(a=e[i+2][t])||void 0===a?void 0:a.texture.key.slice(0,5);if(s===d&&d===p){if(h.length>0&&-1==h.indexOf(e[i][t])){r.push(h);const e=[];let s;const i=h.indexOf(this.firstSelectedTile),l=h.indexOf(this.secondSelectedTile);let n=0;-1!==i&&this.firstSelectedTile?(s=this.firstSelectedTile,n=i):-1!==l&&this.secondSelectedTile&&(s=this.secondSelectedTile,n=l);for(let t=0;t<h.length;t++)e.push([0,t-n]);if(s){const t=this.getTilePos(this.tileGrid,s);o.push({type:`${h.length}`,x:t.x,y:t.y,pattern:e,priority:2})}else o.push({type:`${h.length}`,x:t,y:c+1-h.length,pattern:e,priority:2});h=[]}-1==h.indexOf(e[i][t])&&h.push(e[i][t]),-1==h.indexOf(e[i+1][t])&&h.push(e[i+1][t]),-1==h.indexOf(e[i+2][t])&&h.push(e[i+2][t]),c=i+2}}}if(h.length>0){r.push(h);const e=[];let s;const i=h.indexOf(this.firstSelectedTile),l=h.indexOf(this.secondSelectedTile);let n=0;-1!==i&&this.firstSelectedTile?(s=this.firstSelectedTile,n=i):-1!==l&&this.secondSelectedTile&&(s=this.secondSelectedTile,n=l);for(let t=0;t<h.length;t++)e.push([0,t-n]);if(s){const t=this.getTilePos(this.tileGrid,s);o.push({type:`${h.length}`,x:t.x,y:t.y,pattern:e,priority:2})}else o.push({type:`${h.length}`,x:t,y:c+1-h.length,pattern:e,priority:2})}}return o.sort(((e,t)=>e.priority-t.priority)),o}checkPattern(e,t,s,i){const l=s[t][e];return!!l&&i.every((([i,n])=>{var a;const r=e+i,h=t+n;return r>=0&&r<8&&h>=0&&h<8&&(null===(a=s[h][r])||void 0===a?void 0:a.texture.key)===l.texture.key}))}}const A=D;class F extends Phaser.GameObjects.Container{constructor(e){super(e),this.scoreManager=g.getInstance(e);const t=this.scoreManager.getMilestone();this.scoreManager.getScore(),this.milestoneText=e.add.text(0,0,`TARGET: ${t}`,{fontSize:"36px",color:"#fff",fontStyle:"bold"}),this.progressBar=this.scene.add.image(0,50,"bar"),this.progressBar.setOrigin(0),this.progressFill=this.scene.add.image(3,53,"fillBar"),this.progressFill.setOrigin(0),this.cropRect=new Phaser.Geom.Rectangle(0,0,0,this.progressFill.displayHeight),this.progressFill.setCrop(this.cropRect),Phaser.Display.Align.In.LeftCenter(this.progressFill,this.progressBar,-3,0),this.emitter=this.scene.add.particles(0,0,"star",{speed:{min:10,max:20},lifespan:1e3,y:{min:53,max:53+this.progressFill.displayHeight},blendMode:"ADD",gravityY:0,gravityX:-100,emitting:!0,scale:{start:.07,end:0}}),this.emitter.x=this.cropRect.width,this.add(this.milestoneText),this.add(this.progressBar),this.add(this.progressFill),this.add(this.emitter),e.add.existing(this)}update(...e){const t=this.scoreManager.getMilestone(),s=this.scoreManager.getScore();this.scene.tweens.add({targets:this.cropRect,width:this.progressFill.displayWidth*(s%1e3/1e3),duration:100,yoyo:!0,repeat:0}),this.progressFill.setCrop(this.cropRect),this.emitter.x=this.cropRect.width,this.milestoneText.setText(`TARGET: ${t}`)}}const R=F;class j extends Phaser.GameObjects.Container{constructor(e){super(e),this.scene=e,this.scoreManager=g.getInstance(e),this.popup=this.scene.add.image(378.5,c/2,"popup"),this.popup.setScale(1.5),this.milestoneReachText=this.scene.add.text(0,0,"MILESTONE REACHED",{fontSize:"34px",color:"#fff",fontStyle:"bold"}),this.milestoneReachText.setOrigin(.5),Phaser.Display.Align.In.TopCenter(this.milestoneReachText,this.popup,0,30),this.popup.setOrigin(.5),this.add(this.popup),this.add(this.milestoneReachText),this.scoreText=this.scene.add.text(0,0,`${this.scoreManager.getScore()}`,{fontSize:"80px",color:"#000",fontStyle:"bold",align:"center"}),this.scoreText.setOrigin(.5),Phaser.Display.Align.In.Center(this.scoreText,this.popup),this.add(this.scoreText),e.add.existing(this)}display(){this.scene.tweens.addCounter({from:0,to:this.scoreManager.getScore(),duration:1e3,onUpdate:e=>{this.scoreText.setText(`${Math.floor(e.getValue())}`)}})}}const V=j,_=class extends M{constructor(e,t){super(),this.grid=e,this.scene=t,this.elapsedTime=0,this.scoreManager=g.getInstance(this.scene),this.shuffled=!1,this.cheers=this.scene.sound.add("cheers"),this.levelComplete=this.scene.sound.add("levelComplete"),this.overlay=this.scene.add.graphics(),this.overlay.fillStyle(0,0),this.overlay.fillRect(0,0,o,c),this.completeMenu=new V(this.scene),this.completeMenu.setPosition(0,-2e3),this.confetti=this.scene.add.particles(0,0,"confetti",{frequency:1e3/60,lifespan:1e4,speedY:{min:-6e3,max:-4e3},speedX:{min:-500,max:500},angle:{min:-85,max:-95},gravityY:1e3,frame:[0,4,8,12,16],quantity:100,x:{min:0,max:800},emitting:!1,scaleX:{onEmit:e=>1,onUpdate:e=>Math.cos(4*h*e.lifeT)},rotate:{onEmit:e=>0,onUpdate:e=>720*Math.sign(e.velocityX)*e.lifeT},accelerationX:{onEmit:e=>0,onUpdate:e=>-e.velocityX*Phaser.Math.Between(0,1)},accelerationY:{onEmit:e=>0,onUpdate:e=>-e.velocityY*Phaser.Math.Between(3,4)}})}enter(){console.log("MilestoneState: enter"),this.scoreManager.setMilestone(1e3*Math.floor(this.scoreManager.getScore()/1e3)+1e3),this.cheers.play(),this.levelComplete.play(),this.confetti.explode(200,378.5,c),this.scene.tweens.add({targets:this.completeMenu,y:0,duration:500,ease:"Quad.easeOut",onComplete:()=>{this.completeMenu.display(),this.scene.time.delayedCall(3e3,(()=>{this.scene.tweens.add({targets:this.completeMenu,y:-2e3,duration:500,ease:"Bounce"})}))}}),this.scene.tweens.add({targets:this.overlay,alpha:.5,duration:500,ease:"Quad.easeOut",onComplete:()=>{this.scene.time.delayedCall(3e3,(()=>{this.scene.tweens.add({targets:this.overlay,alpha:0,duration:500,ease:"Quad.easeOut"})}))}})}exit(){console.log("MilestoneState: exit"),this.elapsedTime=0,this.shuffled=!1}execute(e,t){this.elapsedTime+=t,console.log("MilestoneState: execute"),this.elapsedTime>4e3&&"shuffle"!==this.grid.stateMachine.getState()&&this.stateMachine.transition("play")}},W=class extends M{constructor(e,t){super(),this.grid=e,this.scene=t,this.elapsedTime=0,this.scoreManager=g.getInstance(this.scene)}enter(){console.log("GamePlayState: enter")}exit(){console.log("GamePlayState: exit"),this.elapsedTime=0}execute(e,t){this.elapsedTime+=t,this.elapsedTime,this.scoreManager.getScore()>=this.scoreManager.getMilestone()&&"shuffle"===this.grid.stateMachine.getState()&&(console.log("GamePlayState: milestone reached"),this.stateMachine.transition("milestone"))}};class z extends Phaser.Scene{constructor(){super("GameScene")}init(){this.cameras.main.setBackgroundColor("#24252A");const e=this.add.image(0,0,"roomBackground");e.setOrigin(0,0),e.setScale(.54);const t=this.add.image(0,0,"topBar");t.setOrigin(.5),t.setScale(o/t.width),this.scoreManager=g.getInstance(this),this.scoreText=this.scoreManager.getScoreText(),this.scoreText.setDepth(5);const s=this.add.image(0,0,"score");s.setOrigin(.5),s.setDepth(5),Phaser.Display.Align.In.TopCenter(t,this.add.zone(378.5,c/2,o,c),0,180),Phaser.Display.Align.In.BottomCenter(this.scoreText,t,0,-350),Phaser.Display.Align.In.TopCenter(s,t,0,-250),this.milestone=new R(this),this.milestone.setScale(.8),Phaser.Display.Align.In.LeftCenter(this.milestone,t,-370,70),this.grid=new A(this),this.grid.setPosition(378.5-this.grid.width/2,500);const i=this.make.graphics().fillRect(this.grid.x,this.grid.y,this.grid.width,this.grid.height);this.grid.setMask(new Phaser.Display.Masks.GeometryMask(this,i)),this.gameMusic=this.sound.add("gameMusic",{loop:!0}),this.gameMusic.play(),this.stateMachine=new k("play",{play:new W(this.grid,this),milestone:new _(this.grid,this)})}create(){}update(e,t){this.grid.update(e,t),this.scoreManager.update(),this.milestone.update(),this.stateMachine.update(e,t)}}const $=z;class U extends Phaser.Scene{constructor(){super({key:"LoadingScene"})}preload(){this.cameras.main.setBackgroundColor(10016391),this.createLoadingbar(),this.load.on("progress",(e=>{this.progressBar.clear(),this.progressBar.fillStyle(16774867,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)}),this),this.load.on("complete",(()=>{this.progressBar.destroy(),this.loadingBar.destroy()}),this),this.load.pack("preload","./assets/pack.json","preload"),this.load.spritesheet("confetti","./assets/images/confetti.png",{frameWidth:16,frameHeight:16})}update(){this.scene.start("GameScene")}createLoadingbar(){this.loadingBar=this.add.graphics(),this.loadingBar.fillStyle(6139463,1),this.loadingBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}const Y=U,L={title:"Jelly Crush",type:Phaser.AUTO,width:o,height:c,parent:"game",scene:[Y,$],backgroundColor:"#000000",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}};class Q extends l().Game{constructor(e){console.log("Game created"),super(e)}}window.addEventListener("load",(()=>{new Q(L)}))}},s={};function i(e){var l=s[e];if(void 0!==l)return l.exports;var n=s[e]={exports:{}};return t[e].call(n.exports,n,n.exports,i),n.exports}i.m=t,e=[],i.O=(t,s,l,n)=>{if(!s){var a=1/0;for(c=0;c<e.length;c++){for(var[s,l,n]=e[c],r=!0,h=0;h<s.length;h++)(!1&n||a>=n)&&Object.keys(i.O).every((e=>i.O[e](s[h])))?s.splice(h--,1):(r=!1,n<a&&(a=n));if(r){e.splice(c--,1);var o=l();void 0!==o&&(t=o)}}return t}n=n||0;for(var c=e.length;c>0&&e[c-1][2]>n;c--)e[c]=e[c-1];e[c]=[s,l,n]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={792:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var l,n,[a,r,h]=s,o=0;if(a.some((t=>0!==e[t]))){for(l in r)i.o(r,l)&&(i.m[l]=r[l]);if(h)var c=h(i)}for(t&&t(s);o<a.length;o++)n=a[o],i.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return i.O(c)},s=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var l=i.O(void 0,[96],(()=>i(877)));l=i.O(l)})();