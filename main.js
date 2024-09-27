const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './abc.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		const airplane = await loadGLTF("./airplane/scene.gltf");
		airplane.scene.scale.set(0.004, 0.004,0.004);
		
		const airplaneMixer = new THREE.AnimationMixer(airplane.scene);
		const airplaneAction = airplaneMixer.clipAction(airplane.animations[0]);
		airplaneAction.play();
		// calling airplaneClip and we are loading the audio from our hard disk
		const airplaneAclip = await loadAudio("./sound/airplane.mp3");
		// we instantiated the THREE listener component using airListener variable
		const airListener = new THREE.AudioListener();
		// instantiated a speaker positional audio as airplaneAudio
		const airplaneAudio = new THREE.PositionalAudio(airListener);	
		
		
		const balloon = await loadGLTF("./balloon/scene.gltf");
		balloon.scene.scale.set(4, 4, 4);
		
		const balloonMixer = new THREE.AnimationMixer(balloon.scene);
		const balloonAction = balloonMixer.clipAction(balloon.animations[0]);
		balloonAction.play();
		
		const balloonAclip = await loadAudio("./sound/balloon.mp3");
		const balloonListener = new THREE.AudioListener();
		const balloonAudio = new THREE.PositionalAudio(balloonListener);	
		
		const car = await loadGLTF("./car/scene.gltf");
		car.scene.scale.set(0.7, 0.7, 0.7);
		car.scene.position.set(0, -0.1, 0);
		
		const carMixer = new THREE.AnimationMixer(car.scene);
		const carAction = carMixer.clipAction(car.animations[0]);
		carAction.play();
		
		const carAclip = await loadAudio("./sound/car.mp3");
		const carListener = new THREE.AudioListener();
		const carAudio = new THREE.PositionalAudio(carListener);	
		
		const airplaneAnchor = mindarThree.addAnchor(0);
		airplaneAnchor.group.add(airplane.scene);
		// added listener to the camera
		camera.add(airListener);
		// we set the referal distance from which the audio should fade out
		airplaneAudio.setRefDistance(100);
		// set the buffer of audio to stream
		airplaneAudio.setBuffer(airplaneAclip);
		// we sset the audio to loop
		airplaneAudio.setLoop(true);
		// we added the audio to the anchor of airplane which will be activated on seeing  the airplane image
		airplaneAnchor.group.add(airplaneAudio)
		
		// make airplane audio play only when the target of airplane image is detected
		airplaneAnchor.onTargetFound = () => {
			airplaneAudio.play();
		}
		// make airplane audio pause then the target image is lost in the camera
		airplaneAnchor.onTargetLost = () => {
			airplaneAudio.pause();
		}
		
		
		const balloonAnchor = mindarThree.addAnchor(1);
		balloonAnchor.group.add(balloon.scene);
		
		camera.add(balloonListener);
		balloonAudio.setRefDistance(100);
		balloonAudio.setBuffer(balloonAclip);
		balloonAudio.setLoop(true);
		balloonAnchor.group.add(balloonAudio)
		balloonAnchor.onTargetFound = () => {
			balloonAudio.play();
		}
		balloonAnchor.onTargetLost = () => {
			balloonAudio.pause();
		}
		
		
		const carAnchor = mindarThree.addAnchor(2);
		carAnchor.group.add(car.scene);
		
		camera.add(carListener);
		carAudio.setRefDistance(100);
		carAudio.setBuffer(carAclip);
		carAudio.setLoop(true);
		carAnchor.group.add(carAudio)
		carAnchor.onTargetFound = () => {
			carAudio.play();
		}
		carAnchor.onTargetLost = () => {
			carAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			airplaneMixer.update(delta);
			balloonMixer.update(delta);
			carMixer.update(delta);
			car.scene.rotation.set(0, car.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});