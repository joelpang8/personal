var cube_color = 0xffff00;

function cube_pos(sz, x, y, z) {
    var g = new THREE.CubeGeometry(
        sz,// width
        sz,// height
        sz// depth
    );
    var s = new THREE.Mesh(
        g,
        new THREE.MeshPhongMaterial({ color: cube_color })
    );
    scene.add(s);
    s.position.x = x;
    s.position.y = y;
    s.position.z = z;
    return s;
}

function test_string(t) {
    return [t, Math.sin(t * 2.5), t];
}

function time_string(t, time, off) {
    return [t, Math.sin(t * 2.5 + time * 2.5) * off, t];
}

var length = 50;

function init_cubes() {
    let c = [];
    for (let i = 0; i < length; i++) {
        let t = test_string(i * 0.2);
        c.push(cube_pos(0.3, t[0], t[1], t[2]));
    }
    return c;
}

var all_cubes = [];

var colors = [
    0xff00aa,
    0x66ccff,
    0xffaa33
]
// cube_color = 0xff00ff;
// cube_color = 0x0000ff;
// cube_color = 0xffaa33;

var width = 10;
function init_all() {
    for (let i = 0; i < width; i++) {
        cube_color = colors[i % 3];
        let tmp = init_cubes();
        all_cubes.push(tmp);
        offset_cubes(tmp, 0.35 * i);
    }
}

init_all();

var randoms = [];
for (let i = 0; i < width; i++) {
    randoms.push(Math.random(0.1));
}

function alter_cubes(lst, time, off) {
    lst.forEach((e, ndx) => {
        let t = time_string(ndx * 0.2, time, off);
        e.position.y = t[1] * 1 - mouse.y * 2;
    });
}

function offset_cubes(lst, off) {
    lst.forEach((e) => {
        e.position.x -= off;
    })
}

function alter_all(time) {
    all_cubes.forEach((lst, ndx) => alter_cubes(
        lst,
        time,
        1 + randoms[ndx]
        // * (1 + ndx) * 0.7
    ))
}
