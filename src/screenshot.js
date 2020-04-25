'use strict';

const puppeteer = require('puppeteer');

module.exports.fileExtension = 'jpg';

module.exports.dateDir = true;

module.exports.defaultDelay = 3000;

module.exports.defaultViewports = [
		{ width: 1200, height: 0 },
		{ width: 992, height: 0 },
		{ width: 768, height: 0 },
		{ width: 576, height: 0 },
];

module.exports.getDate = (date) => {
		let d = new Date(),
					month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
				year = d.getFullYear();
		
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
		
    return [year, month, day].join('-');
}

module.exports.hostnameDir = true;

module.exports.userPages = [];

module.exports.outputDir = 'output';

module.exports.run = async () => {
		try {
				await fs.promises.access(this.outputDir);
		} catch(e) {
				await fs.promises.mkdir(this.outputDir);
		}

		if (this.dateDir) {
				this.outputDir = this.outputDir + '/' + this.getDate();
				try {
						await fs.promises.access(this.outputDir);
				} catch(e) {
						await fs.promises.mkdir(this.outputDir);
				}
		}
		
		const browser = await puppeteer.launch({
				args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		
		const page = await browser.newPage();

		let allPages = [];
		this.userPages.map( async (d) => {
				if (!d.url) return;
				
				let viewportArray;
				if (!d.viewports) viewportArray = this.defaultViewports;
				else viewportArray = d.viewports;

				let filename;
				const parts = new URL(d.url);

				filename = parts.pathname.replace(/^\//,'').replace(/\//g, '_');
				if (filename === '') filename = 'index';
				
				for(let idx = 0; idx < viewportArray.length; idx++) {
						allPages.push({
								url: d.url,
								hostname: parts.hostname,
								viewport: viewportArray[idx],
								delay: d.delay ? d.delay : this.defaultDelay,
								filename: filename + '-' + viewportArray[idx].width + 'x'
										+ viewportArray[idx].height + '.' + this.fileExtension,
						});
				}
				
				return d;
		});
		
		const numPages = allPages.length;

		if (numPages === 0) {
				console.log('No userPages found.');
				process.exit(1);
		}
		
		for (let idx = 0; idx < numPages; idx++) {
				let outputDir = this.outputDir;
				
				if (this.hostnameDir) {
						outputDir = this.outputDir + '/' + allPages[idx].hostname;
						try {
								await fs.promises.access(outputDir);
						} catch(e) {
								await fs.promises.mkdir(outputDir);
						}
				}

				try {
						const outputPath = outputDir + '/' + allPages[idx].filename;
						
						console.log((idx + 1) + ' of ' + numPages + ': '
												+ allPages[idx].viewport.width + 'x'
												+ allPages[idx].viewport.height
												+ ' '
												+ allPages[idx].url
												+ ' => ' + outputPath);
						
						await page.setViewport(allPages[idx].viewport);
						await page.goto(allPages[idx].url, { waitUntil: 'networkidle2' });
						await page.waitFor(allPages[idx].delay);
						await page.screenshot({
								path: outputPath,
								fullPage: true,
						});
				} catch(e) {
						console.log(JSON.stringify(allPages[idx]) + ' failed');
						console.log(e);
				}
		}
		
		await browser.close();
};

