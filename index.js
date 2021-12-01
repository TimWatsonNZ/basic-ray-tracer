

const canvas = document.createElement('canvas');
canvas.height = canvas.width = 400;
const rayCount = 400;
const pixelScale = canvas.height/rayCount;

document.body.append(canvas);

const ctx = canvas.getContext('2d');

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const s1 = {
  p: { x: 0, y: 0, z: 2 },
  r: 0.5,
  color: {
    r: 255,
    g: 0,
    b: 0
  }
}
const s2 = {
  p: { x: 1, y: 0, z: 4 },
  r: 0.75,
  color: {
    r: 0,
    g: 255,
    b: 0
  }
}
const s3 = {
  p: { x: -1, y: -1, z: 4 },
  r: 0.5,
  color: {
    r: 0,
    g: 0,
    b: 255
  }
}
const s4 = {
  p: { x: 0, y: 42, z: 8 },
  r: 40,
  color: {
    r: 255,
    g: 255,
    b: 255
  }
}

const obj = [s1,s2,s3,s4];

function dist(a, b){ 
  return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)+(a.z-b.z)*(a.z-b.z))
}

function scale(v, s) {
  return {
    x: v.x*s, y: v.y*s, z: v.z*s
  }
}

function mag(p) {
  return Math.sqrt(p.x*p.x+p.y*p.y+p.z*p.z)
}

function norm(p) {
  const m = mag(p);
  return { x: p.x / m, y: p.y/m, z: p.z/m };
}

function add(p, q) {
  return { x: p.x + q.x, y: p.y + q.y, z: p.z + q.z }
}

function min(p, q) {
  return { x: p.x - q.x, y: p.y - q.y, z: p.z - q.z }
}

function dot(p, q) {
  return p.x*q.x+p.y*q.y+p.z*q.z;
}

let magSq = ({x, y, z}) => x ** 2 + y ** 2 + z ** 2;

let angle = (a, b) => Math.acos(dot(a, b) / Math.sqrt(magSq(a) * magSq(b)));

const vectors = [];


for (let r=0;r<rayCount;r++) {
  for (let c=0;c<rayCount;c++) {
    const vector = { x: 1/rayCount*c*2-1 , y: 1/rayCount*r*2-1, z: 1 }

    vectors.push({ v: norm(vector), r, c, collided: false, color: { r: 0, g: 0, b: 0 }, distance: 0 });
  }
}

console.log(vectors);

let steps = 30;

for (let s = 1;s<steps;s+=1) {
  vectors.forEach(v => {
    let closestDistance = 10;

    obj.forEach(sphere => {
      if (v.collided) {
        return;
      }

      const d = dist(scale(v.v, s), sphere.p); //  distance of ray to sphere center
    
      v.collided = d < sphere.r;

      if (v.collided) {
        const collisionDistance = Math.sqrt(sphere.r*sphere.r - d*d);

        const collisionVector = norm(min(sphere.p, scale(v.v, s-collisionDistance))); //  Vector of collision point to sphere center
        v.angle = angle(collisionVector, { x: 0, y: 0, z: -1});  //  0 -> 2PI

        const c = v.angle/(Math.PI*2);
        // console.log(collisionVector.z);
        v.color.r = c * sphere.color.r + 20;
        v.color.g = c * sphere.color.g + 20;
        v.color.b = c * sphere.color.b + 20;

        ctx.fillStyle = `rgb(${v.color.r},${v.color.g},${v.color.b})`;
        
        ctx.fillRect(v.c*pixelScale, v.r*pixelScale, pixelScale, pixelScale);
      } else {
        if (d < closestDistance) {
          closestDistance = d;
        }
      }
    });

    v.distance += closestDistance;

  })
}
const horizon = 10;
vectors.forEach(v => {
  // if(v.collided) {
    // const dist = 255/horizon*v.distance;

    // const color = 255 - v.angle*255 - dist;
    // imageData.data[(v.r*canvas.width+v.c)*4] = v.color.r;
    // imageData.data[(v.r*canvas.width+v.c)*4+1] = v.color.g;
    // imageData.data[(v.r*canvas.width+v.c)*4+2] = v.color.b;
    // imageData.data[(v.r*canvas.width+v.c)*4+3] = 255;
  if(v.collided) {
    ctx.fillStyle = `rgb(${v.color.r},${v.color.g},${v.color.b})`;
  } else {
    ctx.fillStyle = '#FFF';
  }

  ctx.fillRect(v.c*pixelScale, v.r*pixelScale, pixelScale, pixelScale);
})

// ctx.putImageData(imageData, 0, 0);

