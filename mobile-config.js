App.info({
  id: 'online.ebazaar.www',
  name: 'ebazaar',
  description: 'Online marketplace for home-made food in Saudi Arabia',
  author: 'ITDar',
  email: 'contact@example.com',
  website: 'http://www.ebazaar.online',
  version: "1.0"
});

// Set up resources such as icons and launch screens.
App.icons({
	"iphone_2x": "images/orange/icons/120 x 120.png",
	"iphone_3x": "images/orange/icons/180 x 180.png",
	"ipad": "images/orange/icons/76 x 76.png",
	"ipad_2x": "images/orange/icons/152 x 152.png",
	"ipad_pro": "images/orange/icons/167 x 167.png",
	"ios_settings": "images/orange/icons/29 x 29.png",
	"ios_settings_2x": "images/orange/icons/58 x 58.png",
	"ios_settings_3x": "images/orange/icons/87 x 87.png",
	"ios_spotlight": "images/orange/icons/40 x 40.png",
	"ios_spotlight_2x": "images/orange/icons/80 x 80.png",
	"android_mdpi": "images/orange/icons/48 x 48.png",
	"android_hdpi": "images/orange/icons/72 x 72.png",
	"android_xhdpi": "images/orange/icons/96 x 96.png",
	"android_xxhdpi": "images/orange/icons/144 x 144.png",
	"android_xxxhdpi": "images/orange/icons/192 x 192.png"
});

App.launchScreens({
	iphone_2x: 'images/orange/launch-screens/640 x 960.png',
	iphone5: 'images/orange/launch-screens/640 x 1136.png',
	iphone6: 'images/orange/launch-screens/750 x 1334.png',
	iphone6p_portrait: 'images/orange/launch-screens/1242 x 2208.png',
	iphone6p_landscape: 'images/orange/launch-screens/2208 x 1242.png',
	ipad_portrait: 'images/orange/launch-screens/768 x 1024.png',
	ipad_portrait_2x : 'images/orange/launch-screens/1536 x 2048.png',
	ipad_landscape: 'images/orange/launch-screens/1024 x 768.png',
	ipad_landscape_2x : 'images/orange/launch-screens/2048 x 1536.png',
	android_mdpi_portrait: 'images/orange/launch-screens/320 x 470.png',
	//android_mdpi_landscape: 'images/orange/launch-screens/470 x 320.png',
	android_hdpi_portrait: 'images/orange/launch-screens/480 x 640.png',
	android_hdpi_landscape: 'images/orange/launch-screens/640 x 480.png',
	android_xhdpi_portrait: 'images/orange/launch-screens/720 x 960.png',
	android_xhdpi_landscape: 'images/orange/launch-screens/960 x 720.png',
	android_xxhdpi_portrait: 'images/orange/launch-screens/1080 x 1440.png',
	android_xxhdpi_landscape: 'images/orange/launch-screens/1440 x 1080.png'
});

App.accessRule('*');
