// JavaScript Document
	const img = window.location.search.split('=')[1];
	const dfltZoom = 50;
	const panoMaxFov = 110; // 90, zoom out
	
	const animatedValues = {
		pitch: { start: -Math.PI / 2, end: 0.2 },
		yaw: { start: Math.PI, end: 0 },
		zoom: { start: 0, end: dfltZoom },
		fisheye: { start: 2, end: 0 },
	};
	
	const viewer = new PhotoSphereViewer.Viewer({
		container: document.querySelector('#viewer'),
		panorama: '../media/pano/' + img + '.jpeg',
		maxFov: panoMaxFov, 
		minFov: 10, // 30, zoom in
		defaultZoomLvl: dfltZoom,
		defaultPitch: animatedValues.pitch.start,
		defaultYaw: animatedValues.yaw.start,
		fisheye: animatedValues.fisheye.start,
		navbar: [
			'zoom',
			'fullscreen',
			{
				title: 'Rerun animation',
				content: 'ðŸ”„',
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
				content: 'P',
				title: 'Panorama view',
				className: 'panorama-button',
				onClick: (viewer) => {
					autorotate.start();
					viewer.setOptions({
						fisheye: 0,
						maxFov: panoMaxFov,
					});
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
	
	const autorotate = viewer.getPlugin(PhotoSphereViewer.AutorotatePlugin);
	viewer.addEventListener('ready', intro, { once: true });
	
	function intro() {
		autorotate.stop()
		new PhotoSphereViewer.utils.Animation({
			properties: animatedValues,
			duration: 2500,
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