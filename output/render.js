function main() {
    let then = 0;
    function render(time) {
        if (resizeRendererToDisplaySize(renderer)) { //changes renderer size
            const canvas = renderer.domElement; // updates aspect based on window size
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        time *= 0.001;
        var deltaTime = time - then;
        then = time;

        // camera.position.y = 4 * Math.sin(time)

        alter_all(time);
        renderer.autoClear = false;
        renderer.clear();
        // renderer.render(backgroundScene, backgroundCamera);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();