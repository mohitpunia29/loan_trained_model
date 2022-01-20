const PushManifest = require('http2-push-manifest');

/**
 * Generate the Link header for server push for the css and js files
 *
 * @param {String} buildDirPath
 * @return {String}
 */
async function getLinkHeaderForServerPush(buildDirPath) {
  const pushManifest = new PushManifest({
    basePath: buildDirPath,
    inputPath: 'index.html'
  });

  const manifest = await pushManifest.generate();

  const preloads = [];
  for (const file in manifest.file) {
    preloads.push(`<${file}>; as=${manifest.file[file].type}; rel=preload`);
  }

  return preloads.join(', ');
}

module.exports = {
  getLinkHeaderForServerPush
};
