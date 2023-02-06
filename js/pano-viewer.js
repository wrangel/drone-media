// JavaScript Document
const img = window.location.search.split('=')[1];
const panoMaxFov = 110; // 90, zoom out

const animatedValues = {
	pitch: { start: -Math.PI / 2, end: 0.2 },
	yaw: { start: Math.PI, end: 0 },
	zoom: { start: 0, end: 50 },
	fisheye: { start: 2, end: 0 },
};

const viewer = new PhotoSphereViewer.Viewer({
	container: document.querySelector('#viewer'),
	panorama: '../media/pano/' + img + '.jpeg',
	maxFov: panoMaxFov, 
	minFov: 10, // 30, zoom in
	defaultPitch: animatedValues.pitch.start,
	defaultYaw: animatedValues.yaw.start,
	defaultZoomLvl: animatedValues.zoom.end,
	fisheye: animatedValues.fisheye.start,
	navbar: [
		'zoom',
		'fullscreen',
		{
			title: 'Rerun animation',
			content: document.querySelector('#replay-icon').innerText,
			onClick: intro,
		},
		{ // create custom button for fisheye
			id: 'fisheye',
			content: document.querySelector('#fisheye-icon').innerText,
			title: 'Fisheye view',
			className: 'fisheye-button',
			onClick: (viewer) => {
				autorotate.stop();
				viewer.setOptions({
					fisheye: true,
					maxFov: 150,
				});
			},
		},
		{ // create custom button for panorama
			id: 'panorama',
			content: document.querySelector('#panorama-icon').innerText,
			title: 'Panorama view',
			className: 'panorama-button',
			onClick: (viewer) => {
				viewer.setOptions({
					panorama: true,
					fisheye: false,
					maxFov: panoMaxFov,
					defaultZoomLvl: animatedValues.zoom.end,
				});
				autorotate.start();
			},
		},
	],
	plugins: [
		[PhotoSphereViewer.AutorotatePlugin, {
			autostartDelay: null,
			autostartOnIdle: false,
			autorotatePitch: animatedValues.pitch.end,
			autorotateSpeed: 0.11,
		}],
	],
});

// Get autorotate plugin
const autorotate = viewer.getPlugin(PhotoSphereViewer.AutorotatePlugin);

// Start intro before first rendering
viewer.addEventListener('ready', intro, { once: true });

function intro() {
	autorotate.stop()
	new PhotoSphereViewer.utils.Animation({
		properties: animatedValues,
		duration: 6000,
		easing: 'inOutQuad',
		onTick: (properties) => {
			viewer.setOption('fisheye', properties.fisheye);
			viewer.rotate({ yaw: properties.yaw, pitch: properties.pitch });
			viewer.zoom(properties.zoom);
		},
	}).then(() => {
		autorotate.start();
	});
}

// Clean up cache
window.addEventListener('beforeunload', function () {
	viewer.destroy();
});	