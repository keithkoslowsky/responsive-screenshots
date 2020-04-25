## Build
```
(cd docker; docker build -t puppeteer-chrome-linux .)
```

## Options

Pages that you want to capture.
```
screenshot.userPages = [
		{ url: 'https://www.example.com' },
];
```

If you don't specify `viewports` then it will use all the default viewports. You can specify specific viewports for that url by specifying the viewports as an array of objects. To only capture https://www.example.com with viewports 768 and 480, do the following:
```
screenshot.userPages = [
		{
		  url: 'https://www.example.com',
		  viewports: [
			  { width: 768, height: 0 },
				{ width: 480, height: 0 },
			]
		},
];
```

Rather than specifying viewports on each URL, you can set the defaultViewports to your own values and then just specify it by URL to override, when necessary. To change the defaultViewports, do the following:
```
screenshots.defaultViewports = [
		{ width: 1200, height: 0 },
		{ width: 992, height: 0 },
		{ width: 768, height: 0 },
		{ width: 576, height: 0 },
]
```

The screenshots save as jpg by default. To change it to png, do the following:
```
screenshot.fileExtension = 'png';
```

Images by default are saved in the following way:
output/YYYY-MM-DD/HOSTNAME

If that is too granular for you, you can change the output directory and turn on/off the date and hostname directories.

Images are saved in a folder called output, by default. To change that, do the following:
```
screenshot.outputDir = 'foobar';
```

Images are saved in a folder that is today's date, by default. To disable that, do the following:
```
screenshot.dateDir = false;
```

Images are saved in a folder that is is the hostname, by default. To disable that, do the following:
```
screenshot.hostnameDir = false;
```

The program will wait for the network to be idle but it also waits 3 seconds between each page. To change that, do the following:
```
screenshots.defaultDelay = 1000; // 1 second now
```

## Take screenshots

Update index.js with your Options. Then run:

```
docker run -i -v ${PWD}:${PWD} -w $PWD --init --rm --cap-add=SYS_ADMIN --name puppeteer-chrome puppeteer-chrome-linux node -e "`cat src/index.js`"
```